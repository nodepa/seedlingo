import placeholderAudio from '@/test-support/audio/placeholder-audio.mp3.audio?raw';
import 术 from '@/test-support/audio/characters/术.mp3.audio?raw';
import 两 from '@/test-support/audio/characters/两.mp3.audio?raw';
import 二 from '@/test-support/audio/characters/二.mp3.audio?raw';
import 五减二 from '@/test-support/audio/characters/五减二.mp3.audio?raw';
import type { ClozeExercise } from '../ClozeTypes';
import AudioProvider from '@/Content/AudioProvider';
const audio2b64 = (rawMp3: string) => `data:audio/mpeg;base64,${rawMp3}`;

export default function SingleClozeTestData(): ClozeExercise {
  return {
    clozeType: 'SingleCloze',
    clozeText: [
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '我',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '有',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(两)),
        buzzing: false,
        isBlank: true,
        revealed: false,
        suppressClozeAudio: false,
        word: '两',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '个',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '弟弟',
      },
      {
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '，',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '不过',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '没有',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '别的',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '兄弟姐妹',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '。',
        isPunctuation: true,
      },
    ],
    clozeOptions: [
      {
        audio: AudioProvider.createAudioFromData(audio2b64(术)),
        buzzing: false,
        correct: false,
        disabled: false,
        word: '术',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(两)),
        buzzing: false,
        correct: true,
        disabled: false,
        word: '两',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(二)),
        buzzing: false,
        correct: false,
        disabled: false,
        word: '二',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(五减二)),
        buzzing: false,
        correct: false,
        disabled: false,
        word: '五减二',
      },
    ],
  };
}
