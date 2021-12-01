<script setup lang="ts">
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import {
  MultipleChoiceExercise,
  MultipleChoiceItem,
} from '@/MultipleChoice/MultipleChoiceTypes';
import ContentConfig from '@/Lessons/ContentSpec';
import { computed, ComputedRef, onUpdated, ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps<{
  exerciseProp: MultipleChoiceExercise;
}>();

watch(
  () => props.exerciseProp.itemUnderTestAudio,
  (itemUnderTestAudio) => {
    if (itemUnderTestAudio && itemUnderTestAudio instanceof HTMLAudioElement) {
      playItemUnderTestAudio();
    }
  },
  { flush: 'post' },
);

function determineCorrectness(option: MultipleChoiceItem): void {
  if (option.correct) {
    correctHandler(option);
  } else {
    incorrectHandler(option);
  }
}

function correctHandler(option: MultipleChoiceItem): void {
  props.exerciseProp.options.forEach((item) => {
    if (item !== option) {
      item.disabled = true;
    }
  });
  option.color = 'success';
  playOptionAudio(option);
  store.dispatch('setShowContinueButton', true);
}

function incorrectHandler(option: MultipleChoiceItem): void {
  playOptionAudio(option);
  option.buzzing = true;
  watch(
    () => option.buzzing,
    (buzzing: boolean) => {
      if (!buzzing) {
        option.disabled = true;
        setTimeout(playItemUnderTestAudio, 200);
      }
    },
  );
}

function playItemUnderTestAudio(): void {
  const testAudio = props.exerciseProp.itemUnderTestAudio;
  if (testAudio) {
    testAudio.onplaying = () => {
      if (props.exerciseProp)
        // eslint-disable-next-line vue/no-mutating-props
        props.exerciseProp.itemUnderTestAudioPlaying = true;
    };
    testAudio.onpause = () => {
      if (props.exerciseProp)
        // eslint-disable-next-line vue/no-mutating-props
        props.exerciseProp.itemUnderTestAudioPlaying = false;
    };
    testAudio.onended = () => {
      if (props.exerciseProp)
        // eslint-disable-next-line vue/no-mutating-props
        props.exerciseProp.itemUnderTestAudioPlaying = false;
    };
    testAudio.currentTime = 0;
    testAudio.play();
  }
}

function playOptionAudio(option: MultipleChoiceItem): void {
  // pause other (potentially playing) audio
  props.exerciseProp.options.forEach((item) => {
    if (item.audio && !item.audio.paused) {
      item.audio.pause();
    }
  });
  if (props.exerciseProp.itemUnderTestAudio) {
    props.exerciseProp.itemUnderTestAudio.pause();
  }

  // prepare to handle playtime events
  if (option.audio) {
    option.audio.onplaying = () => {
      option.playing = true;
    };
    option.audio.onpause = () => {
      option.playing = false;
    };
    option.audio.onended = () => {
      option.playing = false;
    };

    option.audio.currentTime = 0;
    option.audio.play();
  }
}

function getSpacing(itemCount: number, index: number): string {
  if (itemCount > 1) {
    if (index === 0) {
      return 'mr-n4';
    }
    if (index === itemCount - 1) {
      return 'ml-n4';
    }
    return 'mx-n4';
  }
  return '';
}

const multipleChoiceInstructionPath: ComputedRef<string> = computed(() => {
  return ContentConfig.getInstructionPathFor('multipleChoiceExercise');
});

const itemUnderTestButton = ref<typeof ExerciseButton | null>(null);
onUpdated(() => {
  itemUnderTestButton.value?.$el.focus();
});
</script>

<template>
  <v-container style="height: 100%" fluid>
    <v-row justify="center" style="height: 30%">
      <v-col cols="11">
        <ExerciseButton
          ref="itemUnderTestButton"
          v-instruction="multipleChoiceInstructionPath"
          data-test="item-under-test-button"
          class="bg-primary text-h2"
          :playing="exerciseProp.itemUnderTestAudioPlaying"
          @click="playItemUnderTestAudio"
        >
          <template
            v-if="
              exerciseProp.iconToMatch && exerciseProp.iconToMatch.length > 0
            "
          >
            <v-icon
              v-for="(icon, iconIndex) in exerciseProp.iconToMatch"
              :key="iconIndex"
              :icon="icon"
              :class="getSpacing(exerciseProp.iconToMatch.length, iconIndex)"
            />
          </template>
          <template
            v-else-if="
              exerciseProp.explanationToMatch &&
              exerciseProp.explanationToMatch.length > 0
            "
          >
            <p
              :style="`font-size: ${
                4.4 - 0.4 * exerciseProp.explanationToMatch.length
              }rem`"
            >
              {{ exerciseProp.explanationToMatch }}
            </p>
          </template>
        </ExerciseButton>
      </v-col>
    </v-row>
    <v-row justify="space-around" style="height: 70%">
      <v-col
        v-for="(option, index) in exerciseProp.options"
        :key="index"
        cols="6"
      >
        <ExerciseButton
          :data-test="`option-button-${index + 1}`"
          :playing="option.playing"
          v-model:buzzing="option.buzzing"
          :disabled="option.disabled && !option.buzzing"
          :class="`bg-${option.color}`"
          @click="determineCorrectness(option)"
        >
          <p
            :class="getSpacing(0, 0)"
            :style="`font-size: ${3.4 - 0.4 * option.word.length}rem`"
          >
            {{ option.word }}
          </p>
        </ExerciseButton>
      </v-col>
    </v-row>
  </v-container>
</template>
