import placeholder from '@/test-support/audio/placeholder-audio.mp3.audio?raw';
import type { MultipleChoiceExercise } from '../MultipleChoiceTypes';
import AudioProvider from '@/Content/AudioProvider';
const audio2b64 = (rawMp3: string) => `data:audio/mpeg;base64,${rawMp3}`;

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
        audio: AudioProvider.createAudioFromData(audio2b64(placeholder)),
        correct: true,
        disabled: false,
        playing: false,
      },
      {
        word: 'Cousin',
        // word: '姥爷',
        audio: AudioProvider.createAudioFromData(audio2b64(placeholder)),
        correct: false,
        disabled: false,
        playing: false,
      },
      {
        word: 'Aunt',
        // word: '阿姨',
        audio: AudioProvider.createAudioFromData(audio2b64(placeholder)),
        correct: false,
        disabled: false,
        playing: false,
      },
      {
        word: 'Grandma',
        // word: '叔叔',
        audio: AudioProvider.createAudioFromData(audio2b64(placeholder)),
        correct: false,
        disabled: false,
        playing: false,
      },
    ],
  };
}
