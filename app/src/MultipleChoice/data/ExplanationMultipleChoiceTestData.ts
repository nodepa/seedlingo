import placeholder from '@/test-support/audio/placeholder-audio.mp3.audio?raw';
import { MultipleChoiceExercise } from '../MultipleChoiceTypes';

export default function ExplanationMultipleChoiceTestData(): MultipleChoiceExercise {
  return {
    itemUnderTestAudio: undefined,
    itemUnderTestAudioPlaying: undefined,
    iconToMatch: undefined,
    explanationToMatch: "My parent's brother",
    // explanationToMatch: '妈妈的妈妈',
    pictureToMatch: undefined,
    options: [
      {
        word: 'Uncle',
        // word: '姥姥',
        audio: new Audio(`data:audio/mpeg;base64,${placeholder}`),
        correct: true,
        disabled: false,
        playing: false,
        buzzing: false,
      },
      {
        word: 'Cousin',
        // word: '姥爷',
        audio: new Audio(`data:audio/mpeg;base64,${placeholder}`),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
      {
        word: 'Aunt',
        // word: '阿姨',
        audio: new Audio(`data:audio/mpeg;base64,${placeholder}`),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
      {
        word: 'Grandma',
        // word: '叔叔',
        audio: new Audio(`data:audio/mpeg;base64,${placeholder}`),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
    ],
  };
}
