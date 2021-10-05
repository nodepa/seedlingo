<script setup lang="ts">
import { mdiCellphoneWireless } from '@mdi/js';
import { computed, ComputedRef, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import ContentConfig from '@/Lessons/ContentConfig';

import { ClozeExercise, ClozeOption } from '../ClozeTypes';

const props = defineProps<{
  exerciseProp: ClozeExercise;
}>();

const localExercise = ref<ClozeExercise>({} as ClozeExercise);
const exercise = computed({
  get: (): ClozeExercise => {
    if (localExercise.value) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      exercise.value = props.exerciseProp;
    }
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

onMounted(() => {
  if (
    exercise.value.sentenceAudio &&
    exercise.value.sentenceAudio instanceof HTMLAudioElement
  ) {
    playSentenceAudio();
  }
});

function determineCorrectness(option: ClozeOption): void {
  if (option.correct) {
    correctHandler(option);
  } else {
    incorrectHandler(option);
  }
}

const store = useStore();
function correctHandler(option: ClozeOption): void {
  exercise.value.options.forEach((item: ClozeOption) => {
    if (item !== option) {
      item.disabled = true;
    }
  });
  option.color = 'success';
  if (exercise.value) exercise.value.showingBlankFilled = true;
  playOptionAudio(option);
  store.dispatch('setShowContinueButton', true);
}

function incorrectHandler(option: ClozeOption): void {
  playOptionAudio(option);
  option.buzzing = true;
  watch(
    () => option.buzzing,
    (buzzing: boolean) => {
      if (!buzzing) {
        option.disabled = true;
        setTimeout(playSentenceAudio, 200);
      }
    },
  );
}

function playSentenceAudio(): void {
  if (exercise.value) {
    const { sentenceAudio } = exercise.value;
    if (sentenceAudio) {
      sentenceAudio.onplaying = () => {
        if (exercise.value) exercise.value.sentenceAudioPlaying = true;
      };
      sentenceAudio.onpause = () => {
        if (exercise.value) exercise.value.sentenceAudioPlaying = false;
      };
      sentenceAudio.onended = () => {
        if (exercise.value) exercise.value.sentenceAudioPlaying = false;
      };
      sentenceAudio.play();
    }
  }
}

function playOptionAudio(option: ClozeOption): void {
  // pause other (potentially playing) audio
  exercise.value.options.forEach((item: ClozeOption) => {
    if (item.audio && !item.audio.paused) {
      item.audio.pause();
    }
  });
  if (exercise.value.sentenceAudio) {
    exercise.value.sentenceAudio.pause();
    exercise.value.sentenceAudio.currentTime = 0;
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

const clozeInstructionPath: ComputedRef<string> = computed(() => {
  return ContentConfig.getInstructionPathFor('clozeExercise');
});
</script>

<template>
  <v-container fluid style="height: 100%">
    <v-row align="center" justify="center" style="height: 40%">
      <v-col cols="11">
        <v-card
          v-instruction="clozeInstructionPath"
          data-test="sentence-card"
          @click="playSentenceAudio()"
        >
          <v-card-text
            class="text-h5 text-sm-h3 text-center"
            style="user-select: text"
          >
            <span>
              <span
                v-for="(word, index) in exercise.sentenceBeginning"
                :key="`start-${index}`"
                class="text-no-wrap"
                >{{ word }}</span
              ><span
                v-if="!exercise.showingBlankFilled"
                class="cloze-blank text-primary text-no-wrap"
              /><span v-else class="text-no-wrap bg-success">{{
                exercise.options.filter((option) => option.correct)[0].word
              }}</span
              ><span
                v-for="(word, index) in exercise.sentenceEnd"
                :key="`end-${index}`"
                class="text-no-wrap"
                >{{ word }}</span
              ></span
            ><v-btn
              v-if="exercise.sentenceAudio"
              style="right: 0px"
              icon
              class="bg-primary"
              ><v-icon :icon="mdiCellphoneWireless"
            /></v-btn>
          </v-card-text>
          <RippleAnimation :playing="exercise.sentenceAudioPlaying" />
          <RippleAnimation
            :playing="exercise.sentenceAudioPlaying"
            :delay="200"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row align="stretch" justify="space-around" style="height: 60%">
      <v-col v-for="(option, index) in exercise.options" :key="index" cols="6">
        <ExerciseButton
          :data-test="`option-button-${index + 1}`"
          :playing="option.playing"
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

<style>
.cloze-blank {
  display: inline-block;
  width: 1.4em;
  height: 1.4em;
  vertical-align: text-bottom;
  border-color: inherit;
  border-style: dotted;
  cursor: text;
}
</style>
