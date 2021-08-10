<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center" style="height: 40%">
      <v-col cols="11">
        <v-card
          v-instruction="clozeInstructionPath"
          data-test="sentence-card"
          @click="playSentenceAudio()"
        >
          <v-card-text
            class="text-h5 text-sm-h3 text-left"
            style="user-select: text"
          >
            <span style="vertical-align: middle">
              <span
                v-for="(word, index) in exercise.sentenceBeginning"
                :key="`start-${index}`"
                class="text-no-wrap"
                >{{ word }}</span
              ><span
                v-if="!exercise.showingBlankFilled"
                class="cloze-blank text-no-wrap"
                :style="`width: ${
                  $vuetify.breakpoint.xsOnly ? '2' : '3'
                }rem; height: ${$vuetify.breakpoint.xsOnly ? '2' : '3'}rem;`"
              /><span
                v-else
                class="text-no-wrap"
                :style="`color: ${$vuetify.theme.currentTheme.success};`"
                >{{
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
              color="primary"
              ><v-icon v-text="mdiCellphoneWireless"
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
          :buzzing.sync="option.buzzing"
          :disabled="option.disabled"
          :color="option.color"
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

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mdiCellphoneWireless } from '@mdi/js';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
// import { Instruction } from '@/common/directives/InstructionDirective';
import ContentConfig from '@/Lessons/ContentConfig';
import { ClozeExercise, ClozeOption } from '../ClozeTypes';

@Component({
  // eslint-disable-next-line no-undef
  components: {
    RippleAnimation,
    ExerciseButton,
  },
})
export default class Cloze extends Vue {
  @Prop() exerciseProp!: ClozeExercise;

  @Watch('localExercise.sentenceAudio')
  onSentenceAudioChanged(newVal: HTMLAudioElement): void {
    if (newVal instanceof HTMLAudioElement) {
      // Instruction.Collection.push(newVal);
      this.playSentenceAudio();
    }
  }

  @Watch('exerciseProp')
  onExercisePropChanged(): void {
    // reset local state
    Object.assign(this.$data, this.getDefaultData());
  }

  data(): {
    clozeInstructionPath: string;
    mdiCellphoneWireless: string;
    localExercise: ClozeExercise;
  } {
    return this.getDefaultData();
  }

  // eslint-disable-next-line class-methods-use-this
  getDefaultData(): {
    clozeInstructionPath: string;
    mdiCellphoneWireless: string;
    localExercise: ClozeExercise;
  } {
    return {
      clozeInstructionPath: 'await-async-path-in-mounted',
      mdiCellphoneWireless,
      localExercise: {} as ClozeExercise,
    };
  }

  get exercise(): ClozeExercise {
    if (!this.$data.localExercise.options) {
      this.exercise = this.exerciseProp;
    }
    return this.$data.localExercise;
  }

  set exercise(item: ClozeExercise) {
    this.$data.localExercise = item;
  }

  mounted(): void {
    ContentConfig.getInstructionPathFor('clozeExercise').then(
      ({ default: path }) => {
        this.$data.clozeInstructionPath = path;
      },
    );
  }

  determineCorrectness(option: ClozeOption): void {
    if (option.correct) {
      this.correctHandler(option);
    } else {
      this.incorrectHandler(option);
    }
  }

  // correctHandler(e: Event, index: number) {
  correctHandler(option: ClozeOption): void {
    this.exercise.options.forEach((item: ClozeOption) => {
      if (item !== option) {
        // eslint-disable-next-line no-param-reassign
        item.disabled = true;
      }
    });
    // eslint-disable-next-line no-param-reassign
    option.color = this.$vuetify.theme.currentTheme.success as string;
    this.exercise.showingBlankFilled = true;
    this.playOptionAudio(option);
    this.$store.commit('showContinueButton', true);
  }

  incorrectHandler(option: ClozeOption): void {
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
          setTimeout(this.playSentenceAudio, 200);
        }
      },
    );
  }

  playSentenceAudio(): void {
    const { sentenceAudio } = this.exercise;
    if (sentenceAudio) {
      sentenceAudio.onplaying = () => {
        this.exercise.sentenceAudioPlaying = true;
      };
      sentenceAudio.onpause = () => {
        this.exercise.sentenceAudioPlaying = false;
      };
      sentenceAudio.onended = () => {
        this.exercise.sentenceAudioPlaying = false;
      };
      sentenceAudio.play();
    }
  }

  playOptionAudio(option: ClozeOption): void {
    // pause other (potentially playing) audio
    this.exercise.options.forEach((item: ClozeOption) => {
      if (item.audio && !item.audio.paused) {
        item.audio.pause();
      }
    });
    if (this.exercise.sentenceAudio) {
      this.exercise.sentenceAudio.pause();
      this.exercise.sentenceAudio.currentTime = 0;
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
}
</script>

<style lang="stylus" scoped></style>

<style lang="stylus">
.v-icon__svg
  height: 1.8em;
  width: 1.8em;
.cloze-blank
  display: inline-block;
  top: 8px;
  position: relative;
  color: var(--v-primary-base);
  border-color: inherit;
  border-style: dotted;
  cursor: text;
</style>
