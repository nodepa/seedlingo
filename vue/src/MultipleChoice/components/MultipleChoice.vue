<template>
  <v-container fill-height fluid>
    <v-row align="stretch" justify="center" style="height: 30%">
      <v-col cols="11">
        <AnswerButton
          ref="itemUnderTestAudioButton"
          v-instruction="placeholderAudio"
          data-test="item-under-test-audio-button"
          color="primary"
          :is-playing="exercise.itemUnderTestAudioIsPlaying"
          @click="playItemUnderTestAudio"
        >
          <v-icon
            v-for="(icon, iconIndex) in exercise.itemUnderTestIcon"
            :key="iconIndex"
            :class="getSpacing(exercise.itemUnderTestIcon.length, iconIndex)"
            style="font-size: 3rem"
          >
            {{ icon }}
          </v-icon>
        </AnswerButton>
      </v-col>
    </v-row>
    <v-row align="stretch" justify="space-around" style="height: 70%">
      <v-col v-for="(answer, index) in exercise.answers" :key="index" cols="6">
        <AnswerButton
          :ref="`answer${index}Button`"
          :data-test="`choice-${index + 1}-button`"
          :is-playing="answer.playing"
          :is-buzzing.sync="answer.isBuzzing"
          :disabled="answer.disabled"
          :color="answer.color"
          v-on="
            answer.correct
              ? { click: (e) => correctHandler(e, index) }
              : { click: (e) => incorrectHandler(e, index) }
          "
        >
          <p
            :class="getSpacing(0, 0)"
            :style="`font-size: ${3.4 - 0.4 * answer.char.length}rem`"
          >
            {{ answer.char }}
          </p>
        </AnswerButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import placeholderAudio from '@/assets/audio/placeholder-audio.mp3';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import AnswerButton from '@/common/components/AnswerButton.vue';
import { Instruction } from '@/common/directives/InstructionDirective';
import { MultipleChoiceExercise } from '@/MultipleChoice/MultipleChoiceTypes';

@Component({
  components: {
    RippleAnimation,
    AnswerButton,
  },
})
export default class MultipleChoice extends Vue {
  @Prop() exerciseProp!: MultipleChoiceExercise;

  @Watch('localExercise.itemUnderTestAudio')
  onItemUnderTestAudioChanged(newVal: HTMLAudioElement) {
    if (newVal instanceof HTMLAudioElement) {
      Instruction.Collection.push(newVal);
      this.playItemUnderTestAudio();
    }
  }

  @Watch('exerciseProp')
  onExercisePropChanged() {
    Object.assign(this.$data, this.getDefaultData());
  }

  data() {
    return this.getDefaultData();
  }

  // eslint-disable-next-line class-methods-use-this
  getDefaultData() {
    return {
      placeholderAudio,
      localExercise: {},
    };
  }

  get exercise() {
    if (!this.$data.localExercise.answers) {
      this.exercise = this.exerciseProp;
    }
    return this.$data.localExercise;
  }

  set exercise(item: MultipleChoiceExercise) {
    this.$data.localExercise = item;
  }

  mounted() {
    ((this.$refs.itemUnderTestAudioButton as Vue).$el as HTMLElement).focus();
  }

  correctHandler(e: Event, index: number) {
    this.exercise.answers[index].color = this.$vuetify.theme.currentTheme
      .success as string;
    this.exercise.answers.forEach((answer, i) => {
      if (i !== index) {
        // eslint-disable-next-line no-param-reassign
        answer.disabled = true;
      }
    });
    this.playAnswerAudio(index);
    this.$store.commit('showContinueButton', true);
  }

  incorrectHandler(e: Event, index: number) {
    this.playAnswerAudio(index);
    const answer = this.exercise.answers[index];
    answer.isBuzzing = true;
    this.$watch(
      () => {
        return this.exercise.answers[index].playing;
      },
      (playing: boolean) => {
        if (!playing) {
          this.exercise.answers[index].disabled = true;
          setTimeout(this.playItemUnderTestAudio, 200);
        }
      },
    );
  }

  playItemUnderTestAudio() {
    const testAudio = this.exercise.itemUnderTestAudio;
    testAudio.onplaying = () => {
      this.exercise.itemUnderTestAudioIsPlaying = true;
    };
    testAudio.onpause = () => {
      this.exercise.itemUnderTestAudioIsPlaying = false;
    };
    testAudio.onended = () => {
      this.exercise.itemUnderTestAudioIsPlaying = false;
    };
    testAudio.play();
  }

  playAnswerAudio(index: number) {
    // pause other (potentially playing) audio
    this.exercise.answers.forEach((answer) => {
      answer.audio.pause();
      // eslint-disable-next-line no-param-reassign
      answer.audio.currentTime = 0;
    });
    this.exercise.itemUnderTestAudio.pause();
    this.exercise.itemUnderTestAudio.currentTime = 0;

    // prepare to handle playtime events
    const answer = this.exercise.answers[index];
    answer.audio.onplaying = () => {
      answer.playing = true;
    };
    answer.audio.onpause = () => {
      answer.playing = false;
    };
    answer.audio.onended = () => {
      answer.playing = false;
    };

    answer.audio.play();
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
