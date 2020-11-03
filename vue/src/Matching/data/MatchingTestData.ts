import placeholderAudio from '@/assets/audio/placeholder-audio.mp3';
// import yi from '@/assets/audio/characters/yi.mp3';
import er from '@/assets/audio/characters/er.mp3';
import san from '@/assets/audio/characters/san.mp3';
import si from '@/assets/audio/characters/si.mp3';
import {
  mdiDice3,
  mdiNumeric2,
  // mdiNumeric3,
  mdiNumeric4,
  mdiPalmTree,
} from '@mdi/js';

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
    1: {
      value: mdiNumeric2,
      audio: createAudio(er),
      match: 3,
      color: 'primary',
      isChar: false,
      isIcon: true,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    2: {
      value: '术',
      audio: createAudio(placeholderAudio),
      match: 5,
      color: '',
      isChar: true,
      isIcon: false,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    3: {
      value: '二',
      audio: createAudio(er),
      match: 1,
      color: '',
      isChar: true,
      isIcon: false,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    4: {
      value: mdiNumeric4,
      audio: createAudio(si),
      match: 8,
      color: 'primary',
      isChar: false,
      isIcon: true,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    5: {
      value: mdiPalmTree,
      audio: createAudio(placeholderAudio),
      match: 2,
      color: 'primary',
      isChar: false,
      isIcon: true,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    6: {
      value: mdiDice3,
      audio: createAudio(san),
      match: 7,
      color: 'primary',
      isChar: false,
      isIcon: true,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    7: {
      value: '三',
      audio: createAudio(san),
      match: 6,
      color: '',
      isChar: true,
      isIcon: false,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    8: {
      value: '四',
      audio: createAudio(si),
      match: 4,
      color: '',
      isChar: true,
      isIcon: false,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
  };
}
