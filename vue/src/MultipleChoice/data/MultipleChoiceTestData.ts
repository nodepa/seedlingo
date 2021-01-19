import 一 from '@/assets/audio/characters/一.mp3';
import 二 from '@/assets/audio/characters/二.mp3';
import 三 from '@/assets/audio/characters/三.mp3';
import 四 from '@/assets/audio/characters/四.mp3';
import { mdiCellphoneWireless } from '@mdi/js';
import { MultipleChoiceExercise } from '../MultipleChoiceTypes';

export default function MultipleChoiceTestData(): MultipleChoiceExercise {
  return {
    itemUnderTestAudio: new Audio(二),
    itemUnderTestAudioPlaying: false,
    iconToMatch: [mdiCellphoneWireless],
    options: [
      {
        word: '三',
        audio: new Audio(三),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
      {
        word: '二',
        audio: new Audio(二),
        correct: true,
        disabled: false,
        playing: false,
        buzzing: false,
      },
      {
        word: '四',
        audio: new Audio(四),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
      {
        word: '一',
        audio: new Audio(一),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
    ],
  };
}
