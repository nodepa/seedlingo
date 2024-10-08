import placeholderAudio from '@/test-support/audio/placeholder-audio.mp3.audio?raw';
import 两 from '@/test-support/audio/characters/两.mp3.audio?raw';
import type { ClozeExercise } from '../ClozeTypes';
import AudioProvider from '@/Content/AudioProvider';
const audio2b64 = (rawMp3: string) => `data:audio/mpeg;base64,${rawMp3}`;

export default function MultiClozeTestData(): ClozeExercise {
  return {
    clozeType: 'MultiCloze',
    clozeText: [
      {
        word: '我',
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
      },
      {
        word: '有',
        isBlank: true,
        revealed: false,
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
      },
      {
        word: '两',
        isBlank: true,
        revealed: false,
        audio: AudioProvider.createAudioFromData(audio2b64(两)),
        buzzing: false,
      },
      {
        word: '个',
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
      },
      {
        word: '弟弟',
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
      },
      {
        word: '，',
        isPunctuation: true,
      },
      {
        word: '不过',
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
      },
      {
        word: '没有',
        isBlank: true,
        revealed: false,
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
      },
      {
        word: '别的',
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
      },
      {
        word: '兄弟姐妹',
        isBlank: true,
        revealed: false,
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        buzzing: false,
      },
      {
        word: '。',
        isPunctuation: true,
      },
    ],
    clozeOptions: [
      {
        word: '兄弟姐妹',
        disabled: false,
        buzzing: false,
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
      },
      {
        word: '两',
        disabled: false,
        buzzing: false,
        audio: AudioProvider.createAudioFromData(audio2b64(两)),
      },
      {
        word: '没有',
        disabled: false,
        buzzing: false,
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
      },
      {
        word: '有',
        disabled: false,
        buzzing: false,
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
      },
    ],
  };
}
