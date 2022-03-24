import ContentSpec from '@/Lessons/ContentSpec';
import 一 from '@/test-support/audio/characters/一.mp3.audio';
import 二 from '@/test-support/audio/characters/二.mp3.audio';
import 三 from '@/test-support/audio/characters/三.mp3.audio';
import 四 from '@/test-support/audio/characters/四.mp3.audio';
import { MultipleChoiceExercise } from '../MultipleChoiceTypes';

export default function MultipleChoiceTestData(): MultipleChoiceExercise {
  return {
    itemUnderTestAudio: new Audio(`data:audio/mpeg;base64,${二}`),
    itemUnderTestAudioPlaying: false,
    iconToMatch: [ContentSpec.getMdiIcon('mdiCellphoneWireless')],
    options: [
      {
        word: '三',
        audio: new Audio(`data:audio/mpeg;base64,${三}`),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
      {
        word: '二',
        audio: new Audio(`data:audio/mpeg;base64,${二}`),
        correct: true,
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
        word: '一',
        audio: new Audio(`data:audio/mpeg;base64,${一}`),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
    ],
  };
}
