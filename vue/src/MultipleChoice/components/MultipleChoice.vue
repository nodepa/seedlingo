<template>
  <v-container fill-height fluid>
    <v-row align="stretch" justify="center" style="height: 30%">
      <v-col cols="11">
        <v-btn
          ref="itemUnderTestAudioButton"
          v-instruction="placeholderAudio"
          data-test="item-under-test-audio-button"
          class="pa-10"
          height="100%"
          block
          raised
          elevation="5"
          color="primary"
          @click="playItemUnderTestAudio"
        >
          <v-icon x-large>{{ exercise.itemUnderTestIcon }}</v-icon>
          <RippleAnimation
            :playing="exercise.itemUnderTestAudioIsPlaying"
            :delay="0"
          />
          <RippleAnimation
            :playing="exercise.itemUnderTestAudioIsPlaying"
            :delay="200"
          />
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="stretch" justify="space-around" style="height: 70%">
      <template v-if="!showAnswer">
        <v-col v-for="(answer, index) in exercise.answers" :key="index">
          <AnswerButton
            :ref="`answer${index}Button`"
            :data-test="`choice-${index}-button`"
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
              :class="
                `${answer.char.length > 1 ? 'display-2' : 'display-3'} pa-5`
              "
            >
              {{ answer.char }}
            </p>
          </AnswerButton>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="11">
          <v-card
            v-if="
              (answer = Object.values(exercise.answers).find(
                (answer) => answer.correct,
              ))
            "
            class="fill-height"
            color="success"
            style="display:flex; align-items: center; justify-content: center"
            @click="
              playAnswerAudio(
                Object.values(exercise.answers).indexOf(answer) + 1,
              )
            "
          >
            <p
              :class="
                `${answer.char.length > 1 ? 'display-3' : 'display-4'} py-16`
              "
            >
              {{ answer.char }}
            </p>
            <RippleAnimation :playing="answer.playing" :delay="0" />
            <RippleAnimation :playing="answer.playing" :delay="200" />
            <!-- Adds empty el here to block v-card last el styling -->
            <span />
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import placeholderAudio from '@/assets/audio/placeholder-audio.mp3';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import AnswerButton from '@/common/components/AnswerButton.vue';
import { Instruction } from '@/common/directives/InstructionDirective';
import getExerciseTestData from '@/MultipleChoice/data/MultipleChoiceTestData';

@Component({
  components: {
    RippleAnimation,
    AnswerButton,
  },
})
export default class MultipleChoice extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      showAnswer: false,
      placeholderAudio,
      exercise: {},
    };
  }

  created() {
    this.$data.exercise = getExerciseTestData();
  }

  mounted() {
    ((this.$refs.itemUnderTestAudioButton as Vue).$el as HTMLElement).focus();

    Instruction.Collection.push(
      this.$data.exercise.itemUnderTestAudio as HTMLMediaElement,
    );

    this.playItemUnderTestAudio();
  }

  correctHandler(e: Event, index: number) {
    this.$data.exercise.answers[index].audio.addEventListener('ended', () => {
      this.$data.showAnswer = true;
    });
    Object.keys(this.$data.exercise.answers).forEach((key) => {
      if (key !== `${index}`) {
        this.$data.exercise.answers[key].disabled = true;
      }
    });
    const button = (this.$refs[`answer${index}Button`] as Array<Vue>)[0]
      .$el as HTMLElement;
    button.style.backgroundColor = this.$vuetify.theme.currentTheme
      .success as string;
    this.playAnswerAudio(index);
    this.$store.commit('showContinueButton', true);
  }

  incorrectHandler(e: Event, index: number) {
    this.playAnswerAudio(index);
    const answer = this.$data.exercise.answers[index];
    answer.isBuzzing = true;
    const button = (this.$refs[`answer${index}Button`] as Array<Vue>)[0]
      .$el as HTMLElement;
    button.style.backgroundColor = this.$vuetify.theme.currentTheme
      .error as string;
    this.$watch(
      () => {
        return this.$data.exercise.answers[index].isBuzzing;
      },
      (isBuzzing: boolean) => {
        if (!isBuzzing) {
          this.$data.exercise.answers[index].disabled = true;
          setTimeout(this.playItemUnderTestAudio, 200);
        }
      },
    );
  }

  playItemUnderTestAudio() {
    const testAudio = this.$data.exercise.itemUnderTestAudio;
    testAudio.onplaying = () => {
      this.$data.exercise.itemUnderTestAudioIsPlaying = true;
    };
    testAudio.onpause = () => {
      this.$data.exercise.itemUnderTestAudioIsPlaying = false;
    };
    testAudio.onended = () => {
      this.$data.exercise.itemUnderTestAudioIsPlaying = false;
    };
    testAudio.play();
  }

  playAnswerAudio(index: number) {
    const answer = this.$data.exercise.answers[index];
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
}
</script>

<style lang="stylus" scoped></style>
