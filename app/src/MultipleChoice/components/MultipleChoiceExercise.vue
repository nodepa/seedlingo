<script setup lang="ts">
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/vue';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import {
  MultipleChoiceExercise,
  MultipleChoiceItem,
} from '@/MultipleChoice/MultipleChoiceTypes';
import Content from '@/Lessons/Content';
import { computed, ComputedRef, onMounted, onUpdated, ref, watch } from 'vue';
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
onMounted(() => {
  if (
    props.exerciseProp.itemUnderTestAudio &&
    props.exerciseProp.itemUnderTestAudio instanceof HTMLAudioElement
  ) {
    playItemUnderTestAudio();
  }
});

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
      return 'margin-right: -16px';
    }
    if (index === itemCount - 1) {
      return 'margin-left: -16px';
    }
    return 'margin-right: -16px;margin-left: -16px';
  }
  return '';
}

const multipleChoiceInstructionsPath: ComputedRef<string> = computed(() => {
  return Content.getInstructionsAudio('multipleChoiceExercise');
});

const itemUnderTestButton = ref<typeof ExerciseButton | null>(null);
onUpdated(() => {
  itemUnderTestButton.value?.$el.focus();
});
</script>

<template>
  <ion-grid style="height: 100%; width: 100%">
    <ion-row class="ion-justify-content-center" style="height: 30%">
      <ion-col size="10">
        <ExerciseButton
          data-test="item-under-test-button"
          ref="itemUnderTestButton"
          :playing="exerciseProp.itemUnderTestAudioPlaying"
          @click="playItemUnderTestAudio"
          v-instructions="multipleChoiceInstructionsPath"
          color="card"
          style="
            width: 100%;
            height: 100%;
            padding-top: 5px;
            padding-bottom: 15px;
            font-size: 3rem;
          "
        >
          <template
            v-if="
              exerciseProp.iconToMatch && exerciseProp.iconToMatch.length > 0
            "
          >
            <ion-icon
              v-for="(icon, iconIndex) in exerciseProp.iconToMatch"
              :key="iconIndex"
              :icon="icon"
              :style="getSpacing(exerciseProp.iconToMatch.length, iconIndex)"
            />
          </template>
          <template
            v-else-if="
              exerciseProp.pictureToMatch &&
              exerciseProp.pictureToMatch.length > 0
            "
          >
            <img
              :src="exerciseProp.pictureToMatch"
              width="200"
              height="128"
              style="object-fit: contain"
            />
          </template>
          <template
            v-else-if="
              exerciseProp.explanationToMatch &&
              exerciseProp.explanationToMatch.length > 0
            "
          >
            <span
              :style="`font-size: ${
                2.7 - exerciseProp.explanationToMatch.length * 0.05
              }rem; white-space: break-spaces;`"
            >
              {{ exerciseProp.explanationToMatch }}
            </span>
          </template>
        </ExerciseButton>
      </ion-col>
    </ion-row>
    <ion-row style="height: 70%" class="ion-justify-content-center">
      <ion-col
        size="6"
        v-for="(option, index) in exerciseProp.options"
        :key="index"
      >
        <ExerciseButton
          :data-test="`option-button-${index + 1}`"
          :disabled="option.disabled && !option.buzzing"
          :playing="option.playing"
          v-model:buzzing="option.buzzing"
          @click="determineCorrectness(option)"
          :color="option.color || 'primary'"
          style="width: 100%; height: 100%; padding: 15px; margin: 0px"
        >
          <span :style="`font-size: ${4 - option.word.length * 0.4}rem;`">
            {{ option.word }}
          </span>
        </ExerciseButton>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<style scoped>
ion-grid {
  --ion-grid-column-padding: 0px;
}
</style>
