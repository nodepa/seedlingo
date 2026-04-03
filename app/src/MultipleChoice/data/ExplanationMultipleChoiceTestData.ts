import placeholder from '@/test-support/audio/placeholder-audio.mp3?url';
import type { MultipleChoiceExercise } from '../MultipleChoiceTypes';
import AudioProvider from '@/Content/AudioProvider';

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
        audio: AudioProvider.createAudioFromUrl(placeholder),
        correct: true,
        disabled: false,
        playing: false,
      },
      {
        word: 'Cousin',
        // word: '姥爷',
        audio: AudioProvider.createAudioFromUrl(placeholder),
        correct: false,
        disabled: false,
        playing: false,
      },
      {
        word: 'Aunt',
        // word: '阿姨',
        audio: AudioProvider.createAudioFromUrl(placeholder),
        correct: false,
        disabled: false,
        playing: false,
      },
      {
        word: 'Grandma',
        // word: '叔叔',
        audio: AudioProvider.createAudioFromUrl(placeholder),
        correct: false,
        disabled: false,
        playing: false,
      },
    ],
  };
}
