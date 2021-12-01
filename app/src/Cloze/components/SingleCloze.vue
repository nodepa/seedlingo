<script setup lang="ts">
import { computed, ComputedRef, ref, watch } from 'vue';
import { useStore } from 'vuex';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import ContentSpec from '@/Lessons/ContentSpec';

import { ClozeExercise, ClozeOption } from '../ClozeTypes';

const props = defineProps<{
  exerciseProp: ClozeExercise;
}>();

const localExercise = ref<ClozeExercise>({} as ClozeExercise);
const exercise = computed({
  get: (): ClozeExercise => {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    exercise.value = props.exerciseProp;
    return localExercise.value;
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

function determineCorrectness(option: ClozeOption): void {
  if (option.correct) {
    correctHandler(option);
  } else {
    incorrectHandler(option);
  }
}

const store = useStore();
function correctHandler(clozeOption: ClozeOption): void {
  exercise.value.clozeOptions.forEach((option: ClozeOption) => {
    if (option !== clozeOption) {
      option.disabled = true;
    }
  });
  clozeOption.color = 'success';
  const blank = exercise.value.clozeText.find((clozeWord) => clozeWord.isBlank);
  if (blank) blank.revealed = true;
  if (!clozeOption.suppressOptionAudio) {
    playOptionAudio(clozeOption);
  }
  store.dispatch('setShowContinueButton', true);
}

function incorrectHandler(option: ClozeOption): void {
  if (!option.suppressOptionAudio) {
    playOptionAudio(option);
  }
  option.buzzing = true;
  watch(
    () => option.buzzing,
    (buzzing: boolean) => {
      if (!buzzing) {
        option.disabled = true;
      }
    },
  );
}

function playOptionAudio(clozeOption: ClozeOption): void {
  if (clozeOption.audio?.el.src) {
    // pause other (potentially playing) audio
    exercise.value.clozeOptions.forEach((option: ClozeOption) => {
      if (option.audio?.playing) {
        option.audio.cancel();
      }
    });
    clozeOption.audio.play();
  }
}

const singleClozeInstructionPath: ComputedRef<string> = computed(() => {
  return ContentSpec.getInstructionPathFor('singleClozeExercise');
});
</script>

<template>
  <v-container fluid style="height: 100%">
    <v-row align="center" justify="center" style="height: 40%">
      <v-col cols="11">
        <v-card
          v-instruction="singleClozeInstructionPath"
          data-test="sentence-card"
          class="overflow-visible"
        >
          <v-card-text
            class="text-h5 text-sm-h3 text-center"
            style="user-select: text"
          >
            <template
              v-for="(word, index) in exercise.clozeText"
              :key="`start-${index}`"
            >
              <span
                v-if="word.isBlank && !word.revealed"
                :data-test="`sentence-word-${index + 1}`"
                class="
                  ripple-container
                  cloze-blank
                  text-primary text-h5 text-sm-h3
                  no-wrap
                "
              >
                <RippleAnimation :playing="word.audio?.playing" />
                <RippleAnimation :playing="word.audio?.playing" :delay="200" />
              </span>
              <span
                v-else-if="word.isBlank && word.revealed"
                :data-test="`sentence-word-${index + 1}`"
                class="ripple-container bg-success text-h5 text-sm-h3 no-wrap"
                @click="word.audio?.play()"
              >
                {{ word.word
                }}<RippleAnimation :playing="word.audio?.playing" />
                <RippleAnimation :playing="word.audio?.playing" :delay="200" />
              </span>
              <span
                v-else
                :data-test="`sentence-word-${index + 1}`"
                class="ripple-container text-h5 text-sm-h3 no-wrap"
                @click="if (!word.suppressClozeAudio) word.audio?.play();"
              >
                {{ word.word
                }}<RippleAnimation :playing="word.audio?.playing" />
                <RippleAnimation :playing="word.audio?.playing" :delay="200" />
              </span>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row align="stretch" justify="space-around" style="height: 60%">
      <v-col
        v-for="(option, index) in exercise.clozeOptions"
        :key="index"
        cols="6"
      >
        <ExerciseButton
          :data-test="`option-button-${index + 1}`"
          :playing="option.audio?.playing"
          v-model:buzzing="option.buzzing"
          :disabled="option.disabled"
          :class="`bg-${option.color}`"
          @click="determineCorrectness(option)"
        >
          <span :class="`text-h${option.word.length + 1}`">
            {{ option.word }}
          </span>
        </ExerciseButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.cloze-blank {
  display: inline-block;
  width: 1.6em;
  height: 1.1em;
  margin: 0px 2px;
  vertical-align: text-bottom;
  border-color: inherit;
  border-style: dotted;
  cursor: text;
}
.ripple-container {
  position: relative;
}
.text-sm-h3 {
  line-height: 1.4em;
}
.text-h5 {
  line-height: 1.4em;
}
.no-wrap {
  word-break: keep-all;
}
</style>
