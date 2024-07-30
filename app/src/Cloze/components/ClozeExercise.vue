<script setup lang="ts">
import { computed, ComputedRef, ref, watch } from 'vue';
import { IonCard, IonCardContent, IonCol, IonGrid, IonRow } from '@ionic/vue';
import { useStore } from 'vuex';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import Content from '@/Content/Content';
import calcFontSize from '@/common/utils/CalcFontSize';

import type { ClozeExercise, ClozeOption, ClozeWord } from '../ClozeTypes';

const props = defineProps<{
  exerciseProp: ClozeExercise;
}>();

const localExercise = ref<ClozeExercise>({} as ClozeExercise);
const exercise = computed({
  get: (): ClozeExercise => {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    exercise.value = props.exerciseProp;
    return localExercise.value as ClozeExercise;
  },
  set: (exercise: ClozeExercise): void => {
    localExercise.value = exercise;
  },
});
watch(
  () => props.exerciseProp,
  (exerciseProp: ClozeExercise) => {
    exercise.value = exerciseProp;
  },
);

const blanks = computed((): Array<ClozeWord> => {
  return exercise.value.clozeText.filter((entry) => entry.isBlank);
});

const store = useStore();
function determineCorrectness(selectedOption: ClozeOption): void {
  if (!selectedOption.suppressOptionAudio) {
    playOptionAudio(selectedOption);
  }

  if (exercise.value.clozeType === 'SingleCloze') {
    if (selectedOption.correct) {
      selectedOption.color = 'success';
      exercise.value.clozeOptions.forEach((option: ClozeOption) => {
        if (option !== selectedOption) {
          option.disabled = true;
        }
      });
      blanks.value[0].revealed = true;
      store.dispatch('setShowContinueButton', true);
    } else {
      selectedOption.buzzing = true;
      watch(
        () => selectedOption.buzzing,
        (buzzing: boolean) => {
          if (!buzzing) {
            selectedOption.disabled = true;
          }
        },
      );
    }
  } else {
    // MultiCloze
    const firstStillHiddenIndex = blanks.value.findIndex(
      (val) => !val.revealed,
    );
    if (blanks.value[firstStillHiddenIndex].word == selectedOption.word) {
      blanks.value[firstStillHiddenIndex].revealed = true;
      selectedOption.disabled = true;
    } else {
      selectedOption.buzzing = true;
    }
    if (firstStillHiddenIndex === blanks.value.length - 1) {
      store.dispatch('setShowContinueButton', true);
    }
  }
}

function playOptionAudio(option: ClozeOption): void {
  // pause other (potentially playing) audio
  exercise.value.clozeOptions.forEach((item: ClozeOption) => {
    if (item.audio?.playing) {
      item.audio.cancel();
    }
  });

  option.audio?.play();
}

const clozeInstructionsPath: ComputedRef<string> = computed(() => {
  if (exercise.value.clozeType === 'SingleCloze') {
    return Content.getInstructionsAudio('singleClozeExercise');
  } else {
    return Content.getInstructionsAudio('multiClozeExercise');
  }
});
</script>

<template>
  <ion-grid fixed>
    <div class="flex-row">
      <div class="flex-col-top">
        <ion-card
          v-instructions="clozeInstructionsPath"
          data-test="sentence-card"
          color="card"
        >
          <ion-card-content class="ion-text-start">
            <template
              v-for="(word, index) in exercise.clozeText"
              :key="`start-${index}`"
            >
              <template v-if="!word.isPunctuation">
                <span class="no-wrap">
                  <span
                    :data-test="`sentence-word-${index + 1}`"
                    style="padding-top: 2px"
                    :class="[
                      'selectable',
                      'ripple-container',
                      { revealed: word.isBlank && word.revealed },
                      { interactive: !word.isBlank || word.revealed },
                      { playing: word.audio?.playing },
                    ]"
                    @click="
                      if (
                        !word.suppressClozeAudio &&
                        (!word.isBlank || word.revealed)
                      )
                        word.audio?.play();
                    "
                  >
                    <span
                      v-if="word.isBlank && !word.revealed"
                      class="cloze-blank"
                      >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                    >
                    <span v-else-if="!word.isBlank || word.revealed">
                      {{ word.word }}
                    </span>
                    <RippleAnimation :playing="word.audio?.playing" />
                  </span>
                  <span
                    v-if="
                      exercise.clozeText[index + 1] &&
                      exercise.clozeText[index + 1].isPunctuation
                    "
                    :data-test="`sentence-word-${index + 1}-punctuation`"
                    class="selectable punctuation"
                    >{{ exercise.clozeText[index + 1].word }}
                  </span>
                </span>
                {{ exercise.injectSpaces ? ' ' : '' }}
                <wbr />
              </template>
            </template>
          </ion-card-content>
        </ion-card>
      </div>
      <div class="flex-col-bottom">
        <ion-row>
          <ion-col
            v-for="(option, index) in exercise.clozeOptions"
            :key="index"
            size-xs="6"
          >
            <ExerciseButton
              v-model:buzzing="option.buzzing"
              :data-test="`option-button-${index + 1}`"
              :playing="option.audio?.playing"
              :disabled="option.disabled"
              :color="option.color || 'primary'"
              @click="determineCorrectness(option)"
            >
              <span
                :style="`
                  font-size: ${calcFontSize(2.5, 1, 10, 'rem', option.word as string, 5)};
                  margin: 0px;
                  white-space: break-spaces;
                `"
              >
                {{ option.word }}
              </span>
            </ExerciseButton>
          </ion-col>
        </ion-row>
      </div>
    </div>
  </ion-grid>
</template>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.flex-col-top {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 40%;
  padding: var(--ion-grid-column-padding);
}
.flex-col-bottom {
  display: flex;
  justify-content: stretch;
  flex: 1 1 60%;
}
ion-row {
  width: 100%;
}
ion-card {
  display: flex;
  height: 100%;
  width: 95%;
  margin: 0px;
  justify-content: center;
  align-items: center;
  overflow: visible;
}
ion-card-content {
  font-size: 1.8rem;
}
.no-wrap {
  white-space: nowrap;
}
.ripple-container {
  position: relative;
}
.cloze-blank {
  display: inline;
  width: 1.6em;
  margin-inline: 3px;
  cursor: default;
  color: var(--ion-color-primary);
}
.cloze-blank::after {
  position: absolute;
  top: -2px;
  right: 1px;
  bottom: -2px;
  left: 1px;
  content: '';
  background-color: transparent;
  border-radius: 0.2em;
  border-color: inherit;
  border-style: dashed;
  border-width: 2px;
}
.revealed {
  margin-inline: 2px;
  padding: 0px 2px;
}
.revealed::after {
  position: absolute;
  top: -2px;
  right: -1px;
  bottom: -2px;
  left: -1px;
  content: '';
  background-color: transparent;
  border-radius: 0.2em;
  border-color: var(--ion-color-primary);
  border-style: dashed;
  border-width: 2px;
}
.selectable {
  user-select: text;
  cursor: pointer;
}
.punctuation {
  cursor: default;
}
ion-button {
  width: 100%;
  height: 100%;
}
@media (hover: hover) and (pointer: fine) {
  span.interactive:hover {
    background-color: var(--ion-color-secondary-tint);
    border-radius: 0.2em;
  }
  span.interactive:hover::after {
    position: absolute;
    top: -2px;
    right: -1px;
    bottom: -2px;
    left: -1px;
    content: '';
    background-color: transparent;
    border-radius: 0.2em;
    border-color: var(--ion-color-primary);
    border-style: solid;
    border-width: 2px;
  }
}
.playing {
  background-color: var(--ion-color-secondary-tint);
  border-radius: 0.2em;
}
.playing::after {
  position: absolute;
  top: -2px;
  right: -1px;
  bottom: -2px;
  left: -1px;
  content: '';
  background-color: transparent;
  border-radius: 0.2em;
  border-color: var(--ion-color-primary);
  border-style: solid;
  border-width: 2px;
}
</style>
