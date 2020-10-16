<template>
  <v-container fill-height fluid>
    <v-row align="stretch" justify="space-around">
      <v-col v-for="(answer, index) in answers" :key="index">
        <v-btn
          :ref="`answer${index}Button`"
          :data-test="`${index < 5 ? 'char' : 'sym'}-${index}-button`"
          height="100%"
          block
          raised
          elevation="5"
          :disabled="answer.disabled"
        >
          <p
            :class="
              `${answer.char.length > 1 ? 'display-2' : 'display-3'} pa-5`
            "
          >
            {{ answer.char }}
          </p>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import placeholderAudio from '@/assets/audio/placeholder-audio.mp3';
import yi from '@/assets/audio/characters/yi.mp3';
import er from '@/assets/audio/characters/er.mp3';
import san from '@/assets/audio/characters/san.mp3';
import si from '@/assets/audio/characters/si.mp3';
import { mdiCellphoneWireless } from '@mdi/js';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import { Instruction } from '@/common/directives/InstructionDirective';

@Component({
  components: {
    RippleAnimation,
  },
})
export default class Session extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      showAnswer: false,
      placeholderAudio,
      itemUnderTestAudio: new Audio(er),
      itemUnderTestAudioIsPlaying: false,
      yi,
      er,
      san,
      si,
      mdiCellphoneWireless,
      answers: {
        1: {
          char: '三',
          audio: new Audio(san),
          correct: false,
          disabled: false,
          playing: false,
        },
        2: {
          char: '二',
          audio: new Audio(er),
          correct: true,
          disabled: false,
          playing: false,
        },
        3: {
          char: '四',
          audio: new Audio(si),
          correct: false,
          disabled: false,
          playing: false,
        },
        4: {
          char: '一',
          audio: new Audio(yi),
          correct: false,
          disabled: false,
          playing: false,
        },
        5: {
          char: '五',
          audio: new Audio(placeholderAudio),
          correct: false,
          disabled: false,
          playing: false,
        },
        6: {
          char: '六',
          audio: new Audio(placeholderAudio),
          correct: false,
          disabled: false,
          playing: false,
        },
        7: {
          char: '七',
          audio: new Audio(placeholderAudio),
          correct: false,
          disabled: false,
          playing: false,
        },
        8: {
          char: '八',
          audio: new Audio(placeholderAudio),
          correct: false,
          disabled: false,
          playing: false,
        },
      },
    };
  }

  correctHandler(e: Event, index: number) {
    this.$data.answers[index].audio.addEventListener('ended', () => {
      this.$data.showAnswer = true;
    });
    Object.keys(this.$data.answers).forEach((key) => {
      if (key !== `${index}`) {
        this.$data.answers[key].disabled = true;
      }
    });
    const button = (this.$refs[`answer${index}Button`] as Array<Vue>)[0]
      .$el as HTMLElement;
    button.style.backgroundColor = this.$vuetify.theme.currentTheme
      .success as string;
    this.playAnswerAudio(index);
  }

  incorrectHandler(e: Event, index: number) {
    this.playAnswerAudio(index);

    const button = (this.$refs[`answer${index}Button`] as Array<Vue>)[0]
      .$el as HTMLElement;
    button.style.backgroundColor = this.$vuetify.theme.currentTheme
      .error as string;
    button.animate(
      [
        { transform: 'translate(0px, 0px)' },
        { transform: 'translate(-3px, 2px)' },
        { transform: 'translate(2px, 2px)' },
        { transform: 'translate(0px, -2px)' },
        { transform: 'translate(-2px, 3px)' },
        { transform: 'translate(0px, 0px)' },
      ],
      {
        duration: 200,
        iterations: 4,
        easing: 'ease-in-out',
      },
    );
  }

  playAnswerAudio(index: number) {
    const answer = this.$data.answers[index];
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

  mounted() {
    Instruction.Collection.push(
      this.$data.itemUnderTestAudio as HTMLMediaElement,
    );
  }
}
</script>

<style lang="stylus" scoped></style>
