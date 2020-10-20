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
          :outlined="answer.selected"
          elevation="5"
          :disabled="answer.disabled"
          :color="answer.icon ? 'primary' : ''"
          @click="selected = +index"
        >
          <v-icon v-if="answer.icon" class="pa-5 mb-4">
            {{ answer.value }}
          </v-icon>
          <p
            v-else
            :class="
              `${answer.value.length > 1 ? 'display-2' : 'display-3'} pa-5`
            "
          >
            {{ answer.value }}
          </p>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import placeholderAudio from '@/assets/audio/placeholder-audio.mp3';
import yi from '@/assets/audio/characters/yi.mp3';
import er from '@/assets/audio/characters/er.mp3';
import san from '@/assets/audio/characters/san.mp3';
import si from '@/assets/audio/characters/si.mp3';
import {
  mdiDice3,
  mdiNumeric2,
  mdiNumeric3,
  mdiNumeric4,
  mdiPalmTree,
} from '@mdi/js';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';

@Component({
  components: {
    RippleAnimation,
  },
})
export default class Session extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      placeholderAudio,
      yi,
      er,
      san,
      si,
      selected: 0,
      answers: {
        1: {
          icon: true,
          value: mdiNumeric2,
          audio: new Audio(er),
          playing: false,
          selected: false,
          match: 3,
        },
        2: {
          icon: false,
          value: '术',
          audio: new Audio(placeholderAudio),
          playing: false,
          selected: false,
          match: 5,
        },
        3: {
          icon: false,
          value: '二',
          audio: new Audio(er),
          playing: false,
          selected: false,
          match: 1,
        },
        4: {
          icon: true,
          value: mdiNumeric4,
          audio: new Audio(si),
          playing: false,
          selected: false,
          match: 8,
        },
        5: {
          icon: true,
          value: mdiPalmTree,
          audio: new Audio(placeholderAudio),
          playing: false,
          selected: false,
          match: 2,
        },
        6: {
          icon: true,
          value: mdiDice3,
          audio: new Audio(san),
          playing: false,
          selected: false,
          match: 7,
        },
        7: {
          icon: false,
          value: '三',
          audio: new Audio(san),
          playing: false,
          selected: false,
          match: 6,
        },
        8: {
          icon: false,
          value: '四',
          audio: new Audio(si),
          playing: false,
          selected: false,
          match: 4,
        },
      },
    };
  }

  @Watch('selected')
  onSelectedChanged(val: number, oldVal: number) {
    // console.log(`selected changed from ${oldVal} to ${val}`);

    const answer = this.$data.answers[val];
    const oldAnswer = this.$data.answers[oldVal];

    if (answer) {
      answer.selected = true;
    }

    if (oldVal === 0) {
      // only one element selected
    } else if (val === 0) {
      // programmatically reset to 0, due to incorrect match
    } else if (answer.match === oldVal) {
      // new selection has a match in previous selection
      // console.log('correct match!!!');
      answer.selected = true;
      oldAnswer.selected = true;
    } else {
      // new selection does not have a match in previous selection
      // console.log("that's not right");
      oldAnswer.selected = false;
    }
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
}
</script>

<style lang="stylus">
.v-icon__svg
  height: 2.6em;
  width: 2.6em;
</style>
