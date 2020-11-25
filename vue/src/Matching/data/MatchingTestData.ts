import placeholderAudio from '@/assets/audio/placeholder-audio.mp3';
import er from '@/assets/audio/characters/er.mp3';
import san from '@/assets/audio/characters/san.mp3';
import si from '@/assets/audio/characters/si.mp3';
import {
  mdiDice3,
  mdiNumeric2Circle,
  mdiNumeric4Circle,
  mdiPalmTree,
} from '@mdi/js';

export function createAudio(src: string) {
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
  return [
    {
      value: [mdiNumeric2Circle],
      audio: createAudio(er),
      match: 2,
      color: 'primary',
      isChar: false,
      isIcon: true,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    {
      value: '术',
      audio: createAudio(placeholderAudio),
      match: 4,
      color: '',
      isChar: true,
      isIcon: false,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    {
      value: '二',
      audio: createAudio(er),
      match: 0,
      color: '',
      isChar: true,
      isIcon: false,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    {
      value: [mdiNumeric4Circle],
      audio: createAudio(si),
      match: 7,
      color: 'primary',
      isChar: false,
      isIcon: true,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    {
      value: [mdiPalmTree],
      audio: createAudio(placeholderAudio),
      match: 1,
      color: 'primary',
      isChar: false,
      isIcon: true,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    {
      value: [mdiDice3],
      audio: createAudio(san),
      match: 6,
      color: 'primary',
      isChar: false,
      isIcon: true,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    {
      value: '三',
      audio: createAudio(san),
      match: 5,
      color: '',
      isChar: true,
      isIcon: false,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
    {
      value: '四',
      audio: createAudio(si),
      match: 3,
      color: '',
      isChar: true,
      isIcon: false,
      isMatched: false,
      isSelected: false,
      isBuzzing: false,
    },
  ];
}
