<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonRow,
  useIonRouter,
} from '@ionic/vue';
import { useStore } from 'vuex';

import type {
  ComprehensionExercise,
  ComprehensionOption,
  ComprehensionQuestion,
} from '../ComprehensionTypes';
import type { MultipleChoiceExercise as MultipleChoiceExerciseType } from '@/MultipleChoice/MultipleChoiceTypes';
import type { MatchingExercise as MatchingExerciseType } from '@/Matching/MatchingTypes';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import ProgressBar from './ProgressBar.vue';
import HoneyBeeInstructor from '@/common/components/HoneyBeeInstructor.vue';
import MultipleChoiceExercise from '@/MultipleChoice/components/MultipleChoiceExercise.vue';
import MatchingExercise from '@/Matching/components/MatchingExercise.vue';
import calcFontSize from '@/common/utils/CalcFontSize';

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
      // BUG: Instructions should stop playing when proposing answer option #431
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
      } else if (currentStage.value >= STAGE.Review) {
        ionRouter.navigate({ name: 'Home' }, 'root', 'replace');
      } else {
        exercise.value.stages[currentStage.value].instructionAudio?.cancel();
        currentStage.value += 1;
      }
    }
  },
);
watch(currentStage, (currentStage) => {
  switch (currentStage) {
    case STAGE.ReadText:
      store.dispatch('setShowContinueButton', true);
      break;
    case STAGE.AnswerQuestions:
      currentQuestion.value += 1;
      break;
    case STAGE.FocusNewWords:
      store.dispatch('setShowContinueButton', true);
      break;
    case STAGE.PracticeNewWords:
      currentExercise.value += 1;
      break;
    case STAGE.Review:
      store.dispatch('setShowContinueButton', true);
      break;
  }
  if (
    !exercise.value.stages[currentStage].onlyInstructOnRequest &&
    currentStage != STAGE.PracticeNewWords
  ) {
    togglePlayInstructions();
  }
});

function togglePlayInstructions() {
  // BUG: Needs to _properly_ suspend other potentially playing audio #431
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
    <ProgressBar :current-stage="currentStage" :stages="STAGE" />
    <ion-grid fixed style="margin-top: 45px; padding: 0px">
      <div class="flex-row">
        <!-- Top section: Unit text -->
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
          <!-- 1. STAGE.ReadText.
            Read the text silently.
            Then press the arrow and answer the questions.
            If you encounter unfamiliar words, just skip them.
            We will study related new words next.
            请默读这段短文。
            然后点击屏幕上的箭头，回答问题。
            遇到不认识的词语可以跳过，
            后面我们会学习相关的新词。-->
          <!-- 3. STAGE.FocusNewWords.
            Read the text again and try to guess the meaning of any new words.
            Then press the arrow to practice the new words.
            请再次阅读短文，猜猜短文中一些新词语的意思。然后点击箭头回答问题。-->
          <!-- 5. STAGE.Review.
            Finally, read the full text again.
            This time you can listen to the audio by tapping on any word.
            Then, try to read the text aloud on your own.
            最后，请跟随录音朗读短文，边读边用手指指着每一个字。然后自己再试着朗读短文。-->
          <!-- Honeybee instructor -->
          <HoneyBeeInstructor
            v-if="
              [STAGE.ReadText, STAGE.FocusNewWords, STAGE.Review].includes(
                currentStage,
              )
            "
            :audio="exercise.stages[currentStage].instructionAudio"
            :text="exercise.stages[currentStage].instructionText"
            :centered="exercise.stages[currentStage].instructionAudio?.playing"
            :style="{
              margin: '0px',
              marginInline: '10px',
              marginBottom: exercise.stages[currentStage].instructionAudio
                ?.playing
                ? '10px'
                : '-10px',
            }"
            @click="togglePlayInstructions()"
          />
          <!-- Unit text -->
          <ion-card data-test="sentence-card" color="card" background="primary">
            <ion-card-content
              class="ion-text-start"
              :style="`
              font-size: ${
                [STAGE.ReadText, STAGE.FocusNewWords, STAGE.Review].includes(
                  currentStage,
                )
                  ? '1.8rem'
                  : '1.2rem'
              };
            `"
            >
              <template
                v-for="(word, index) in exercise.comprehensionText"
                :key="`start-${index}`"
              >
                <template v-if="!word.isPunctuation">
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
                      <span>
                        {{ word.word }}
                      </span>
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
                    </span>
                  </span>
                  <span v-if="exercise.injectSpaces">{{ ' ' }}</span>
                  <wbr />
                </template>
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
          <!-- 2. STAGE.AnswerQuestions -->
          <!-- Honeybee instructor -->
          <HoneyBeeInstructor
            v-if="currentStage === STAGE.AnswerQuestions"
            :audio="exercise.questions[currentQuestion].questionAudio"
            :text="exercise.questions[currentQuestion].questionText"
            :centered="true"
            style="margin: 10px"
            @click="togglePlayInstructions()"
          />
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
          </template>
          <!-- 4. STAGE.PracticeNewWords
            Answer the questions below.
            If the answer isn't clear,
            make a guess based on reading the text again.
            请回答以下问题。
            答案不清楚的请重新阅读短文，
            根据短文猜出答案。
          -->
          <!-- Honeybee instructor -->
          <HoneyBeeInstructor
            v-if="currentStage === STAGE.PracticeNewWords"
            :audio="exercise.stages[currentStage].instructionAudio"
            :text="exercise.stages[currentStage].instructionText"
            :centered="true"
            style="margin: 10px"
            @click="togglePlayInstructions()"
          />
          <!-- New words exercises -->
          <template
            v-if="
              currentStage === STAGE.PracticeNewWords &&
              exercise.newWordsExercises
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
