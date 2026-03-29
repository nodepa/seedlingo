import 一 from '@/test-support/audio/characters/一.mp3?url';
import 二 from '@/test-support/audio/characters/二.mp3?url';
import 三 from '@/test-support/audio/characters/三.mp3?url';
import 四 from '@/test-support/audio/characters/四.mp3?url';
import pic from '@/test-support/pics/两.jpg';
import type { MultipleChoiceExercise } from '../MultipleChoiceTypes';
import AudioProvider from '@/Content/AudioProvider';

export default function MultipleChoiceTestData(): MultipleChoiceExercise {
  return {
    itemUnderTestAudio: AudioProvider.createAudioFromUrl(二),
    itemUnderTestAudioPlaying: false,
    pictureToMatch: pic,
    options: [
      {
        word: '3',
        audio: AudioProvider.createAudioFromUrl(三),
        correct: false,
        disabled: false,
        playing: false,
      },
      {
        word: '2',
        audio: AudioProvider.createAudioFromUrl(二),
        correct: true,
        disabled: false,
        playing: false,
      },
      {
        word: '4',
        audio: AudioProvider.createAudioFromUrl(四),
        correct: false,
        disabled: false,
        playing: false,
      },
      {
        word: '1',
        audio: AudioProvider.createAudioFromUrl(一),
        correct: false,
        disabled: false,
        playing: false,
      },
    ],
  };
}
