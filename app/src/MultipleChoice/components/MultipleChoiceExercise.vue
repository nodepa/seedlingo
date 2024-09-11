<script setup lang="ts">
import { computed, ComputedRef, onMounted, onUpdated, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/vue';
import { earOutline } from 'ionicons/icons';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import Content from '@/Content/Content';
import calcFontSize from '@/common/utils/CalcFontSize';
import type {
  MultipleChoiceExercise,
  MultipleChoiceItem,
} from '../MultipleChoiceTypes';

const store = useStore();

const props = defineProps<{
  exerciseProp: MultipleChoiceExercise;
}>();

watch(
  () => props.exerciseProp.itemUnderTestAudio,
  (itemUnderTestAudio) => {
    itemUnderTestAudio?.play();
  },
  { flush: 'post' },
);
onMounted(() => props.exerciseProp.itemUnderTestAudio?.play());

function determineCorrectness(option: MultipleChoiceItem): void {
  cancelAllAudio();
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
  if (option.audio) {
    option.audio.play();
  }
  store.dispatch('setShowContinueButton', true);
}

function incorrectHandler(option: MultipleChoiceItem): void {
  if (option.audio.el.src) {
    if (option.audio) {
      option.audio.play();
    }
    watch(
      () => option.audio.playing,
      (playing: boolean) => {
        if (!playing) {
          option.disabled = true;
          setTimeout(() => {
            if (
              !props.exerciseProp.options.reduce(
                (anyPlaying, item) => anyPlaying || item.audio.playing,
                false,
              )
            ) {
              props.exerciseProp.itemUnderTestAudio?.play();
            }
          }, 200);
        }
      },
    );
  } else {
    option.disabled = true;
  }
}

function cancelAllAudio() {
  props.exerciseProp.options.forEach((item) => {
    if (item.audio && item.audio.playing) {
      item.audio.cancel();
    }
  });
  if (props.exerciseProp.itemUnderTestAudio?.playing) {
    props.exerciseProp.itemUnderTestAudio.cancel();
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
          :playing="exerciseProp.itemUnderTestAudio?.playing"
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
          @click="props.exerciseProp.itemUnderTestAudio?.play()"
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
              :style="{
                'font-size': calcFontSize(
                  4,
                  1,
                  10,
                  'rem',
                  exerciseProp.explanationToMatch,
                  5,
                ),
                'white-space': 'break-spaces',
              }"
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
          :buzzing="option.audio.playing && !option.correct"
          :data-test="`option-button-${index + 1}`"
          :disabled="option.disabled && !option.audio.playing"
          :playing="option.audio.playing"
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
            :style="{
              'font-size': calcFontSize(2.5, 1, 10, 'rem', option.word, 5),
              margin: '0px',
              'white-space': 'break-spaces',
            }"
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
