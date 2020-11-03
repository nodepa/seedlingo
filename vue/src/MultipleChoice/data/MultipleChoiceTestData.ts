import yi from '@/assets/audio/characters/yi.mp3';
import er from '@/assets/audio/characters/er.mp3';
import san from '@/assets/audio/characters/san.mp3';
import si from '@/assets/audio/characters/si.mp3';
import { mdiCellphoneWireless } from '@mdi/js';

function createAudio(src: string) {
  const el = new Audio(src);
  const audio = {
    el,
    isPlaying: false,
    play() {
      el.currentTime = 0;
      el.play();
    },
    cancel() {
      el.pause();
    },
  };

  el.onplaying = () => {
    audio.isPlaying = true;
  };
  el.onpause = () => {
    audio.isPlaying = false;
  };
  el.onended = () => {
    audio.isPlaying = false;
  };

  return audio;
}

export default function() {
  return {
    itemUnderTestAudio: new Audio(er),
    itemUnderTestAudioIsPlaying: false,
    itemUnderTestIcon: mdiCellphoneWireless,
    answers: {
      1: {
        char: '三',
        audio: new Audio(san),
        correct: false,
        disabled: false,
        playing: false,
        isBuzzing: false,
      },
      2: {
        char: '二',
        audio: new Audio(er),
        correct: true,
        disabled: false,
        playing: false,
        isBuzzing: false,
      },
      3: {
        char: '四',
        audio: new Audio(si),
        correct: false,
        disabled: false,
        playing: false,
        isBuzzing: false,
      },
      4: {
        char: '一',
        audio: new Audio(yi),
        correct: false,
        disabled: false,
        playing: false,
        isBuzzing: false,
      },
    },
  };
}
