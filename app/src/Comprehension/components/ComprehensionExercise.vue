<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonIcon,
  useIonRouter,
} from '@ionic/vue';
import { useStore } from 'vuex';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import Instructor from '@/common/icons/HoneyBee.svg';

import {
  ComprehensionExercise,
  ComprehensionOption,
  ComprehensionQuestion,
} from '../ComprehensionTypes';
import MultipleChoiceExercise from '@/MultipleChoice/components/MultipleChoiceExercise.vue';
import { MultipleChoiceExercise as MultipleChoiceExerciseType } from '@/MultipleChoice/MultipleChoiceTypes';
import MatchingExercise from '@/Matching/components/MatchingExercise.vue';
import { MatchingExercise as MatchingExerciseType } from '@/Matching/MatchingTypes';

const store = useStore();
const ionRouter = useIonRouter();

const props = defineProps<{
  exerciseProp: ComprehensionExercise;
}>();
const localExercise = ref<ComprehensionExercise>({} as ComprehensionExercise);
const exercise = computed({
  get: (): ComprehensionExercise => {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    exercise.value = props.exerciseProp;

    return localExercise.value;
  },
  set: (exercise: ComprehensionExercise): void => {
    localExercise.value = exercise;
  },
});
watch(
  () => props.exerciseProp,
  (exerciseProp: ComprehensionExercise) => {
    exercise.value = exerciseProp;
  },
);

const STAGE = Object.freeze<{ [key: string]: number }>({
  ReadText: 0,
  AnswerQuestions: 1,
  FocusNewWords: 2,
  PracticeNewWords: 3,
  Review: 4,
});

const currentStage = ref(-1);
const currentQuestion = ref(-1);
const currentExercise = ref(-1);
const allowWordInteraction = computed(() => currentStage.value >= STAGE.Review);
onMounted(() => {
  currentStage.value = STAGE.ReadText;
});
watch(
  () => store.state.showContinueButton,
  (show: boolean) => {
    if (!show) {
      // FIX Stop any audio playing
      // Instructions keep playing when selecting answer option
      if (
        currentQuestion.value >= 0 &&
        currentQuestion.value < exercise.value.questions.length - 1
      ) {
        currentQuestion.value += 1;
        togglePlayInstructions();
      } else if (
        currentExercise.value >= 0 &&
        currentExercise.value <
          (exercise.value.newWordsExercises?.length || 1) - 1
      ) {
        currentExercise.value += 1;
      } else {
        exercise.value.stages[currentStage.value].instructionAudio?.cancel();
        currentStage.value += 1;
      }
      if (currentStage.value > STAGE.Review) {
        ionRouter.navigate({ name: 'Home' }, 'root', 'replace');
      }
    }
  },
);
watch(currentStage, (currentStage) => {
  switch (currentStage) {
    case STAGE.ReadText:
      store.dispatch('setShowContinueButton', true);
      togglePlayInstructions();
      break;
    case STAGE.AnswerQuestions:
      currentQuestion.value += 1;
      togglePlayInstructions();
      break;
    case STAGE.FocusNewWords:
      store.dispatch('setShowContinueButton', true);
      togglePlayInstructions();
      break;
    case STAGE.PracticeNewWords:
      currentExercise.value += 1;
      togglePlayInstructions();
      break;
    case STAGE.Review:
      // BUG If multiple choice -> exercise audio plays over instruction
      store.dispatch('setShowContinueButton', true);
      togglePlayInstructions();
      break;
  }
});

function togglePlayInstructions() {
  // need to _properly_ suspend other potentially playing audio,
  // while also allow to stop audio by click
  if (currentStage.value === STAGE.AnswerQuestions) {
    if (
      exercise.value.questions[currentQuestion.value].questionAudio?.playing
    ) {
      exercise.value.questions[currentQuestion.value].questionAudio?.cancel();
    } else {
      exercise.value.questions[
        currentQuestion.value
      ].questionAudio?.el.scrollIntoView();
      exercise.value.questions[currentQuestion.value].questionAudio?.play();
    }
  } else {
    if (exercise.value.stages[currentStage.value].instructionAudio?.playing) {
      exercise.value.stages[currentStage.value].instructionAudio?.cancel();
    } else {
      exercise.value.stages[
        currentStage.value
      ].instructionAudio?.el.scrollIntoView();
      exercise.value.stages[currentStage.value].instructionAudio?.play();
    }
  }
}

function determineCorrectness(
  selectedOption: ComprehensionOption,
  relatedQuestion: ComprehensionQuestion,
): void {
  playOptionAudio(selectedOption);
  if (selectedOption.correct) {
    selectedOption.color = 'success';
    relatedQuestion.options.forEach((option: ComprehensionOption) => {
      if (option !== selectedOption) {
        option.disabled = true;
      }
    });
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
}
function playOptionAudio(option: ComprehensionOption): void {
  // pause other (potentially playing) audio
  exercise.value.questions.forEach((question: ComprehensionQuestion) => {
    question.options.forEach((option) => {
      if (option.audio?.playing) {
        option.audio.cancel();
      }
    });
  });
  option.audio?.play();
}
</script>
<template>
  <div style="display: grid; width: 100%; height: 100%; overflow: auto">
    <!-- Progress bar -->
    <div
      style="
        position: absolute;
        z-index: 1;
        top: 0px;
        left: 0px;
        right: 0px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        margin: 10px;
        padding: 5px;
        padding-inline: 6px;
        border-radius: 25px;
        background-color: var(--ion-color-step-250);
      "
    >
      <span
        style="
          width: 15px;
          height: 15px;

          border-radius: 100%;
          background-color: var(--ion-color-primary);
        "
      ></span>
      <span
        :style="`
            flex-grow: 1;
            height: 3px;
            background-color: var(--ion-color-primary${
              currentStage <= STAGE.ReadText ? '-contrast' : ''
            });
          `"
      ></span>
      <span
        :style="`
            width: 15px;
            height: 15px;
            border-radius: 100%;
            background-color: var(--ion-color-primary${
              currentStage <= STAGE.ReadText ? '-contrast' : ''
            });
          `"
      ></span>
      <span
        :style="`
            flex-grow: 1;
            height: 3px;
            background-color: var(--ion-color-primary${
              currentStage <= STAGE.AnswerQuestions ? '-contrast' : ''
            });
          `"
      ></span>
      <span
        :style="`
            width: 15px;
            height: 15px;
            border-radius: 100%;
            background-color: var(--ion-color-primary${
              currentStage <= STAGE.AnswerQuestions ? '-contrast' : ''
            });
          `"
      ></span>
      <span
        :style="`
            flex-grow: 1;
            height: 3px;
            background-color: var(--ion-color-primary${
              currentStage <= STAGE.FocusNewWords ? '-contrast' : ''
            });
          `"
      ></span>
      <span
        :style="`
            width: 15px;
            height: 15px;
            border-radius: 100%;
            background-color: var(--ion-color-primary${
              currentStage <= STAGE.FocusNewWords ? '-contrast' : ''
            });
          `"
      ></span>
      <span
        :style="`
            flex-grow: 1;
            height: 3px;
            background-color: var(--ion-color-primary${
              currentStage <= STAGE.PracticeNewWords ? '-contrast' : ''
            });
          `"
      ></span>
      <span
        :style="`
            width: 15px;
            height: 15px;
            border-radius: 100%;
            background-color: var(--ion-color-primary${
              currentStage <= STAGE.PracticeNewWords ? '-contrast' : ''
            });
          `"
      ></span>
    </div>
    <ion-grid fixed style="margin-top: 35px; padding: 0px">
      <div class="flex-row">
        <!-- Top section: Lesson text -->
        <div
          :class="[
            'flex-col-top',
            {
              'flex-col-top-maximized': [
                STAGE.ReadText,
                STAGE.FocusNewWords,
              ].includes(currentStage),
            },
          ]"
          style="position: relative"
        >
          <!-- Stage 1 -->
          <!-- Read the text silently. Then press the arrow and answer some questions about it. Don’t worry about any new words right now. You will learn those later. -->
          <!--
          Stage 3 aka 3a. Read the text again and try to guess the meaning of any new words you see (in pink). Then press the arrow and answer some questions about them.: a matching exercise, matching characters to audio (with full text still visible if possible)?
          请再次阅读短文，猜猜短文中一些新词语（粉色字体）的意思。然后点击箭头回答问题。
        -->
          <!--
          Stage 5. Read the full text again. This time you can listen to the audio by tapping on any word. Then, try to read the text aloud on your own.
          最后，请跟随录音朗读短文，边读边用手指指着每一个字。然后自己再试着朗读短文。
        -->
          <!-- Honeybee instructor -->
          <div
            v-if="
              [STAGE.ReadText, STAGE.FocusNewWords, STAGE.Review].includes(
                currentStage,
              )
            "
            :style="`
            position: absolute;
            z-index: 1;
            width: ${
              exercise.stages[currentStage].instructionAudio?.playing
                ? '64'
                : '36'
            }px;
            height: ${
              exercise.stages[currentStage].instructionAudio?.playing
                ? '64'
                : '36'
            }px;
            transition: 1s ease-in-out;
            color: var(--ion-card-background);
            background-color: var(--ion-color-card);
            border: 2px solid var(--ion-color-primary);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          `"
            @click="togglePlayInstructions()"
          >
            <ion-icon
              :icon="Instructor"
              :style="`
              font-size: ${
                exercise.stages[currentStage].instructionAudio?.playing
                  ? 56
                  : 32
              }px;
              margin: 0 0 -0.1em -0.1em;
              transition: 1s ease-in-out;`"
              aria-hidden="false"
            />
            <RippleAnimation
              :playing="exercise.stages[currentStage].instructionAudio?.playing"
            />
          </div>
          <!-- Honeybee text -->
          <div
            v-if="
              [STAGE.ReadText, STAGE.FocusNewWords, STAGE.Review].includes(
                currentStage,
              )
            "
            :style="`
            width: 100%;
            height: ${
              exercise.stages[currentStage].instructionAudio?.playing
                ? '140'
                : '0'
            }px;
            margin-top: ${
              exercise.stages[currentStage].instructionAudio?.playing
                ? 1.8
                : 0.0
            }rem;
            scale:${
              exercise.stages[currentStage].instructionAudio?.playing
                ? '1'
                : '0'
            };
            translate:${
              exercise.stages[currentStage].instructionAudio?.playing
                ? '0% 0%'
                : '-49% -45%'
            };
            transition: 1s ease-in-out;
          `"
          >
            <ion-card style="min-height: 80%">
              <ion-card-content style="font-size: 1rem; line-height: normal">
                <span
                  >{{ exercise.stages[currentStage].instructionText }}
                </span>
              </ion-card-content>
            </ion-card>
          </div>
          <!-- Lesson text -->
          <ion-card data-test="sentence-card" color="card" background="primary">
            <ion-card-content
              class="ion-text-justify"
              :style="`
              font-size: ${
                [STAGE.ReadText, STAGE.FocusNewWords, STAGE.Review].includes(
                  currentStage,
                )
                  ? '1.8rem'
                  : '1.2rem'
              };
              transition: 1s ease-in-out;
            `"
            >
              <template
                v-for="(word, index) in exercise.comprehensionText"
                :key="`start-${index}`"
              >
                <span class="no-wrap">
                  <span
                    :data-test="`sentence-word-${index + 1}`"
                    :class="[
                      'selectable',
                      'ripple-container',
                      {
                        interactive:
                          allowWordInteraction &&
                          !word.suppressComprehensionAudio,
                      },
                      { playing: word.audio?.playing },
                    ]"
                    style="padding-top: 2px"
                    :style="`${
                      currentStage >= STAGE.FocusNewWords && word.isNew
                        ? 'color: var(--ion-color-tertiary);'
                        : ''
                    }`"
                    @click="
                      if (
                        allowWordInteraction &&
                        !word.suppressComprehensionAudio
                      )
                        word.audio?.play();
                    "
                  >
                    <template v-if="!word.isPunctuation">
                      {{ word.word }}
                    </template>
                    <RippleAnimation :playing="word.audio?.playing" />
                  </span>
                  <span
                    v-if="
                      exercise.comprehensionText[index + 1] &&
                      exercise.comprehensionText[index + 1].isPunctuation
                    "
                    :data-test="`sentence-word-${index + 1}-punctuation`"
                    class="selectable punctuation"
                    >{{ exercise.comprehensionText[index + 1].word }}
                  </span></span
                >
              </template>
            </ion-card-content>
          </ion-card>
        </div>
        <!-- Bottom section: Questions/exercises -->
        <div
          :class="[
            'flex-col-bottom',
            { 'flex-col-bottom-minimized': currentStage === STAGE.ReadText },
          ]"
          style="position: relative"
        >
          <!-- Stage 2 -->
          <!-- Honeybee instructor -->
          <div
            v-if="currentStage === STAGE.AnswerQuestions"
            :style="`
            position: absolute;
            z-index: 1;
            width: ${
              exercise.questions[currentQuestion].questionAudio?.playing
                ? '64'
                : '36'
            }px;
            height: ${
              exercise.questions[currentQuestion].questionAudio?.playing
                ? '64'
                : '36'
            }px;
            transition: 1s ease-in-out;
            color: var(--ion-card-background);
            background-color: var(--ion-color-card);
            border: 2px solid var(--ion-color-primary);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          `"
            @click="togglePlayInstructions()"
          >
            <ion-icon
              :icon="Instructor"
              :style="`
              font-size: ${
                exercise.questions[currentQuestion].questionAudio?.playing
                  ? 56
                  : 32
              }px;
              margin: 0 0 -0.1em -0.1em;
              transition: 1s ease-in-out;`"
              aria-hidden="false"
            />
            <RippleAnimation
              :playing="
                exercise.questions[currentQuestion].questionAudio?.playing
              "
            />
          </div>
          <!-- Honeybee text -->
          <div
            v-if="currentStage === STAGE.AnswerQuestions"
            :style="`
            width: 100%;
            margin-top: ${
              exercise.questions[currentQuestion].questionAudio?.playing
                ? 2.4
                : 0.8
            }rem;
            transition: 1s ease-in-out;
          `"
          >
            <ion-card @click="togglePlayInstructions()">
              <ion-card-content
                style="
                  font-size: 2rem;
                  line-height: normal;
                  color: var(--ion-text-color);
                "
              >
                <span>{{
                  exercise.questions[currentQuestion].questionText
                }}</span>
              </ion-card-content>
            </ion-card>
          </div>
          <!-- Questions -->
          <template v-if="currentStage === STAGE.AnswerQuestions">
            <ion-row style="flex-grow: 1">
              <ion-col
                v-for="(option, oIndex) in exercise.questions[currentQuestion]
                  .options"
                :key="oIndex"
                size-xs="6"
              >
                <ExerciseButton
                  v-model:buzzing="option.buzzing"
                  :data-test="`option-button-${oIndex + 1}`"
                  :playing="option.audio?.playing"
                  :disabled="option.disabled"
                  :color="option.color || 'primary'"
                  style="
                    width: 100%;
                    height: 100%;
                    --padding-top: 10px;
                    --padding-bottom: 10px;
                  "
                  @click="
                    determineCorrectness(
                      option,
                      exercise.questions[currentQuestion],
                    )
                  "
                >
                  <span
                    :style="`font-size: ${
                      4 - option.word.length * 0.6
                    }rem; margin: 0px; white-space: break-spaces;`"
                  >
                    {{ option.word }}
                  </span>
                </ExerciseButton>
              </ion-col>
            </ion-row>
          </template>
          <!--
          Stage 4 aka 3b. [...] answer some questions about them.: a matching exercise, matching characters to audio (with full text still visible if possible)?
          回答问题。
        -->
          <!-- Honeybee instructor -->
          <div
            v-if="currentStage === STAGE.PracticeNewWords"
            :style="`
            position: absolute;
            z-index: 10;
            width: ${
              exercise.stages[currentStage].instructionAudio?.playing
                ? '64'
                : '36'
            }px;
            height: ${
              exercise.stages[currentStage].instructionAudio?.playing
                ? '64'
                : '36'
            }px;
            transition: 1s ease-in-out;
            color: var(--ion-card-background);
            background-color: var(--ion-color-card);
            border: 2px solid var(--ion-color-primary);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          `"
            @click="togglePlayInstructions()"
          >
            <ion-icon
              :icon="Instructor"
              :style="`
              font-size: ${
                exercise.stages[currentStage].instructionAudio?.playing
                  ? 56
                  : 32
              }px;
              margin: 0 0 -0.1em -0.1em;
              transition: 1s ease-in-out;`"
              aria-hidden="false"
            />
            <RippleAnimation
              :playing="exercise.stages[currentStage].instructionAudio?.playing"
            />
          </div>
          <!-- Honeybee text -->
          <div
            v-if="currentStage === STAGE.PracticeNewWords"
            :style="`
            width: 100%;
            height: ${
              exercise.stages[currentStage].instructionAudio?.playing
                ? '140'
                : '0'
            }px;
            margin-top: ${
              exercise.stages[currentStage].instructionAudio?.playing
                ? 2.6
                : 0.0
            }rem;
            scale:${
              exercise.stages[currentStage].instructionAudio?.playing
                ? '1'
                : '0'
            };
            translate:${
              exercise.stages[currentStage].instructionAudio?.playing
                ? '0% 0%'
                : '-49% -45%'
            };
            transition: 1s ease-in-out;
          `"
          >
            <ion-card style="min-height: 80%">
              <ion-card-content style="font-size: 1rem; line-height: normal">
                <span>{{ exercise.stages[currentStage].instructionText }}</span>
              </ion-card-content>
            </ion-card>
          </div>
          <!-- New words exercises -->
          <template
            v-if="
              currentStage === STAGE.PracticeNewWords &&
              exercise.newWordsExercises &&
              !exercise.stages[currentStage].instructionAudio?.playing
            "
          >
            <MultipleChoiceExercise
              v-if="'options' in exercise.newWordsExercises[currentExercise]"
              :exercise-prop="
                exercise.newWordsExercises[
                  currentExercise
                ] as MultipleChoiceExerciseType
              "
            />
            <MatchingExercise
              v-else
              :exercise-prop="
                exercise.newWordsExercises[
                  currentExercise
                ] as MatchingExerciseType
              "
            />
          </template>
        </div>
      </div>
    </ion-grid>
  </div>
</template>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.flex-col-top {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  padding: var(--ion-grid-column-padding);
  transition: flex-grow 1s;
}
.flex-col-top-maximized {
  flex-basis: 100%;
}
.flex-col-bottom {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  flex: 1 1 60%;
  transition: flex-grow 1s;
}
.flex-col-bottom-minimized {
  flex-basis: 0%;
}
ion-card {
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
.selectable {
  user-select: text;
}
.interactive {
  cursor: pointer;
}
.punctuation {
  cursor: text;
}
ion-button {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
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
