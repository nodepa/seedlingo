<template>
  <v-container fill-height fluid>
    <v-row align="stretch" justify="center" style="height: 30%">
      <v-col cols="11">
        <ExerciseButton
          ref="itemUnderTestButton"
          v-instruction="multipleChoiceInstructionPath"
          data-test="item-under-test-button"
          color="primary"
          :playing="exercise.itemUnderTestAudioPlaying"
          @click="playItemUnderTestAudio"
        >
          <template
            v-if="exercise.iconToMatch && exercise.iconToMatch.length > 0"
          >
            <v-icon
              v-for="(icon, iconIndex) in exercise.iconToMatch"
              :key="iconIndex"
              :class="getSpacing(exercise.iconToMatch.length, iconIndex)"
              style="font-size: 3rem"
            >
              {{ icon }}
            </v-icon>
          </template>
          <template
            v-else-if="
              exercise.explanationToMatch &&
              exercise.explanationToMatch.length > 0
            "
          >
            <p
              :style="`font-size: ${
                4.4 - 0.4 * exercise.explanationToMatch.length
              }rem`"
            >
              {{ exercise.explanationToMatch }}
            </p>
          </template>
        </ExerciseButton>
      </v-col>
    </v-row>
    <v-row align="stretch" justify="space-around" style="height: 70%">
      <v-col v-for="(option, index) in exercise.options" :key="index" cols="6">
        <ExerciseButton
          :data-test="`option-button-${index + 1}`"
          :playing="option.playing"
          :buzzing.sync="option.buzzing"
          :disabled="option.disabled"
          :color="option.color"
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

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import {
  MultipleChoiceExercise,
  MultipleChoiceItem,
} from '@/MultipleChoice/MultipleChoiceTypes';
import ContentConfig from '@/Lessons/ContentConfig';

@Component({
  // eslint-disable-next-line no-undef
  components: {
    RippleAnimation,
    ExerciseButton,
  },
})
export default class MultipleChoice extends Vue {
  @Prop() exerciseProp!: MultipleChoiceExercise;

  @Watch('localExercise.itemUnderTestAudio')
  onItemUnderTestAudioChanged(newVal: HTMLAudioElement): void {
    if (newVal instanceof HTMLAudioElement) {
      this.playItemUnderTestAudio();
    }
  }

  @Watch('exerciseProp')
  onExercisePropChanged(): void {
    // reset local state
    Object.assign(
      this.$data,
      this.getDefaultData(this.$data.multipleChoiceInstructionPath),
    );
  }

  data(): {
    multipleChoiceInstructionPath: string;
    localExercise: MultipleChoiceExercise;
  } {
    return this.getDefaultData();
  }

  // eslint-disable-next-line class-methods-use-this
  getDefaultData(presetPath?: string): {
    multipleChoiceInstructionPath: string;
    localExercise: MultipleChoiceExercise;
  } {
    return {
      multipleChoiceInstructionPath:
        presetPath || 'await-async-path-in-mounted',
      localExercise: {} as MultipleChoiceExercise,
    };
  }

  get exercise(): MultipleChoiceExercise {
    if (!this.$data.localExercise.options) {
      this.exercise = this.exerciseProp;
    }
    return this.$data.localExercise;
  }

  set exercise(item: MultipleChoiceExercise) {
    this.$data.localExercise = item;
  }

  mounted(): void {
    ContentConfig.getInstructionPathFor('multipleChoiceExercise').then(
      ({ default: path }) => {
        this.$data.multipleChoiceInstructionPath = path;
      },
    );

    ((this.$refs.itemUnderTestButton as Vue).$el as HTMLElement).focus();
  }

  // eslint-disable-next-line class-methods-use-this
  determineCorrectness(option: MultipleChoiceItem): void {
    if (option.correct) {
      this.correctHandler(option);
    } else {
      this.incorrectHandler(option);
    }
  }

  // correctHandler(e: Event, index: number) {
  correctHandler(option: MultipleChoiceItem): void {
    this.exercise.options.forEach((item) => {
      if (item !== option) {
        // eslint-disable-next-line no-param-reassign
        item.disabled = true;
      }
    });
    // eslint-disable-next-line no-param-reassign
    option.color = this.$vuetify.theme.currentTheme.success as string;
    this.playOptionAudio(option);
    this.$store.commit('showContinueButton', true);
  }

  incorrectHandler(option: MultipleChoiceItem): void {
    this.playOptionAudio(option);
    // eslint-disable-next-line no-param-reassign
    option.buzzing = true;
    this.$watch(
      () => {
        return option.buzzing;
      },
      (buzzing: boolean) => {
        if (!buzzing) {
          // eslint-disable-next-line no-param-reassign
          option.disabled = true;
          setTimeout(this.playItemUnderTestAudio, 200);
        }
      },
    );
  }

  playItemUnderTestAudio(): void {
    const testAudio = this.exercise.itemUnderTestAudio;
    if (testAudio) {
      testAudio.onplaying = () => {
        this.exercise.itemUnderTestAudioPlaying = true;
      };
      testAudio.onpause = () => {
        this.exercise.itemUnderTestAudioPlaying = false;
      };
      testAudio.onended = () => {
        this.exercise.itemUnderTestAudioPlaying = false;
      };
      testAudio.play();
    }
  }

  playOptionAudio(option: MultipleChoiceItem): void {
    // pause other (potentially playing) audio
    this.exercise.options.forEach((item) => {
      if (item.audio && !item.audio.paused) {
        item.audio.pause();
      }
    });
    if (this.exercise.itemUnderTestAudio) {
      this.exercise.itemUnderTestAudio.pause();
      this.exercise.itemUnderTestAudio.currentTime = 0;
    }

    // prepare to handle playtime events
    if (option.audio) {
      // eslint-disable-next-line no-param-reassign
      option.audio.onplaying = () => {
        // eslint-disable-next-line no-param-reassign
        option.playing = true;
      };
      // eslint-disable-next-line no-param-reassign
      option.audio.onpause = () => {
        // eslint-disable-next-line no-param-reassign
        option.playing = false;
      };
      // eslint-disable-next-line no-param-reassign
      option.audio.onended = () => {
        // eslint-disable-next-line no-param-reassign
        option.playing = false;
      };

      // eslint-disable-next-line no-param-reassign
      option.audio.currentTime = 0;
      option.audio.play();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getSpacing(itemCount: number, index: number): string {
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
}
</script>

<style lang="stylus" scoped></style>

<style lang="stylus">
.v-icon__svg
  height: 1.8em;
  width: 1.8em;
</style>
