import 一 from '@/assets/audio/characters/一.mp3';
import 三 from '@/assets/audio/characters/三.mp3';
import 四 from '@/assets/audio/characters/四.mp3';
import { MultipleChoiceExercise } from '../MultipleChoiceTypes';

export default function MultipleChoiceExplanationTestData(): MultipleChoiceExercise {
  return {
    itemUnderTestAudio: undefined,
    itemUnderTestAudioPlaying: undefined,
    iconToMatch: undefined,
    explanationToMatch: '一加二',
    options: [
      {
        word: '一',
        audio: new Audio(一),
        correct: false,
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
        word: '三',
        audio: new Audio(三),
        correct: true,
        disabled: false,
        playing: false,
        buzzing: false,
      },
    ],
  };
}
