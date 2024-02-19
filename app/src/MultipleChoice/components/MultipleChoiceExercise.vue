<script setup lang="ts">
import { computed, ComputedRef, onMounted, onUpdated, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/vue';
import ExerciseButton from '../../common/components/ExerciseButton.vue';
import {
  MultipleChoiceExercise,
  MultipleChoiceItem,
} from '../MultipleChoiceTypes';
import Content from '../../Lessons/Content';
import { earOutline } from 'ionicons/icons';

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
      return 'margin-right: -1rem';
    }
    if (index === itemCount - 1) {
      return 'margin-left: -1rem';
    }
    return 'margin-right: -1rem;margin-left: -1rem';
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
  <ion-grid fixed>
    <ion-row class="top-row ion-justify-content-center" style="height: 40%">
      <ion-col size="10">
        <ExerciseButton
          ref="itemUnderTestButton"
          v-instructions="multipleChoiceInstructionsPath"
          data-test="item-under-test-button"
          :playing="exerciseProp.itemUnderTestAudioPlaying"
          color="card"
          style="
            width: 100%;
            height: 100%;
            min-height: 6rem;
            font-size: 4rem;
            --padding-top: 0.5rem;
            --padding-bottom: 0.5rem;
            --padding-start: 0.5rem;
            --padding-end: 0.5rem;
          "
          @click="playItemUnderTestAudio"
        >
          <template
            v-if="
              exerciseProp.pictureToMatch &&
              exerciseProp.pictureToMatch.length > 0
            "
          >
            <img
              :src="exerciseProp.pictureToMatch"
              style="width: 100%; height: 100%; object-fit: contain"
            />
          </template>
          <template
            v-else-if="
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
              exerciseProp.explanationToMatch &&
              exerciseProp.explanationToMatch.length > 0
            "
          >
            <span
              :style="`font-size: ${
                2.5 - exerciseProp.explanationToMatch.length * 0.15
              }rem; white-space: break-spaces;`"
            >
              {{ exerciseProp.explanationToMatch }}
            </span>
          </template>
          <template v-else>
            <ion-icon :icon="earOutline" :style="getSpacing(1, 0)" />
          </template>
        </ExerciseButton>
      </ion-col>
    </ion-row>
    <ion-row class="ion-justify-content-around" style="height: 60%">
      <ion-col
        v-for="(option, index) in exerciseProp.options"
        :key="index"
        size-xs="6"
        size="6"
      >
        <ExerciseButton
          v-model:buzzing="option.buzzing"
          :data-test="`option-button-${index + 1}`"
          :disabled="option.disabled && !option.buzzing"
          :playing="option.playing"
          :color="option.color || 'primary'"
          style="
            width: 100%;
            height: 100%;
            min-height: 4rem;
            --padding-top: 0.5rem;
            --padding-bottom: 0.5rem;
            --padding-start: 0.5rem;
            --padding-end: 0.5rem;
          "
          @click="determineCorrectness(option)"
        >
          <span
            :style="`font-size: ${
              2.5 - option.word.length * 0.15
            }rem; margin: 0px; white-space: break-spaces;`"
          >
            {{ option.word }}
          </span>
        </ExerciseButton>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<style scoped>
ion-button::part(native) {
  contain: size;
}
</style>
