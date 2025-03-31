import 一 from '@/test-support/audio/characters/一.mp3.audio?raw';
import 二 from '@/test-support/audio/characters/二.mp3.audio?raw';
import 三 from '@/test-support/audio/characters/三.mp3.audio?raw';
import 四 from '@/test-support/audio/characters/四.mp3.audio?raw';
import pic from '@/test-support/pics/两.jpg';
import type { MultipleChoiceExercise } from '../MultipleChoiceTypes';
import AudioProvider from '@/Content/AudioProvider';
const audio2b64 = (rawMp3: string) => `data:audio/mpeg;base64,${rawMp3}`;

export default function MultipleChoiceTestData(): MultipleChoiceExercise {
  return {
    itemUnderTestAudio: AudioProvider.createAudioFromData(audio2b64(二)),
    itemUnderTestAudioPlaying: false,
    pictureToMatch: pic,
    options: [
      {
        word: '3',
        audio: AudioProvider.createAudioFromData(audio2b64(三)),
        correct: false,
        disabled: false,
        playing: false,
      },
      {
        word: '2',
        audio: AudioProvider.createAudioFromData(audio2b64(二)),
        correct: true,
        disabled: false,
        playing: false,
      },
      {
        word: '4',
        audio: AudioProvider.createAudioFromData(audio2b64(四)),
        correct: false,
        disabled: false,
        playing: false,
      },
      {
        word: '1',
        audio: AudioProvider.createAudioFromData(audio2b64(一)),
        correct: false,
        disabled: false,
        playing: false,
      },
    ],
  };
}
