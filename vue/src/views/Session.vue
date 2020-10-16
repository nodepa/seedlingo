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
          <v-icon x-large>{{ mdiCellphoneWireless }}</v-icon>
          <RippleAnimation :playing="itemUnderTestAudioIsPlaying" :delay="0" />
          <RippleAnimation
            :playing="itemUnderTestAudioIsPlaying"
            :delay="200"
          />
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="stretch" justify="space-around" style="height: 70%">
      <template v-if="!showAnswer">
        <v-col v-for="(answer, index) in answers" :key="index">
          <v-btn
            :ref="`answer${index}Button`"
            :data-test="`choice-${index}-button`"
            height="100%"
            block
            raised
            elevation="5"
            :disabled="answer.disabled"
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
            <RippleAnimation :playing="answer.playing" :delay="0" />
            <RippleAnimation :playing="answer.playing" :delay="200" />
          </v-btn>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="11">
          <v-card
            v-if="
              (answer = Object.values(answers).find((answer) => answer.correct))
            "
            class="fill-height"
            color="success"
            style="display:flex; align-items: center; justify-content: center"
            @click="playAnswerAudio(Object.values(answers).indexOf(answer) + 1)"
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
    const animation = button.animate(
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
    ['finish', 'cancel'].forEach((eventType) => {
      animation.addEventListener(eventType, () => {
        this.$data.answers[index].disabled = true;
        setTimeout(this.playItemUnderTestAudio, 200);
      });
    });
  }

  playItemUnderTestAudio() {
    const testAudio = this.$data.itemUnderTestAudio;
    testAudio.onplaying = () => {
      this.$data.itemUnderTestAudioIsPlaying = true;
    };
    testAudio.onpause = () => {
      this.$data.itemUnderTestAudioIsPlaying = false;
    };
    testAudio.onended = () => {
      this.$data.itemUnderTestAudioIsPlaying = false;
    };
    testAudio.play();
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
    ((this.$refs.itemUnderTestAudioButton as Vue).$el as HTMLElement).focus();

    Instruction.Collection.push(
      this.$data.itemUnderTestAudio as HTMLMediaElement,
    );

    this.playItemUnderTestAudio();
  }
}
</script>

<style lang="stylus" scoped></style>
