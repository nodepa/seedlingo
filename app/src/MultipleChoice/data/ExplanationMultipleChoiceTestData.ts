import 一 from '@/test-support/audio/characters/一.mp3.audio';
import 三 from '@/test-support/audio/characters/三.mp3.audio';
import 四 from '@/test-support/audio/characters/四.mp3.audio';
import { MultipleChoiceExercise } from '../MultipleChoiceTypes';

export default function ExplanationMultipleChoiceTestData(): MultipleChoiceExercise {
  return {
    itemUnderTestAudio: undefined,
    itemUnderTestAudioPlaying: undefined,
    iconToMatch: undefined,
    explanationToMatch: '一加二',
    options: [
      {
        word: '一',
        audio: new Audio(`data:audio/mpeg;base64,${一}`),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
      {
        word: '四',
        audio: new Audio(`data:audio/mpeg;base64,${四}`),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
      {
        word: '三',
        audio: new Audio(`data:audio/mpeg;base64,${三}`),
        correct: true,
        disabled: false,
        playing: false,
        buzzing: false,
      },
    ],
  };
}
