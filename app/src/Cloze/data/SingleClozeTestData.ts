import placeholderAudio from '@/test-support/audio/placeholder-audio.mp3?url';
import 术 from '@/test-support/audio/characters/术.mp3?url';
import 两 from '@/test-support/audio/characters/两.mp3?url';
import 二 from '@/test-support/audio/characters/二.mp3?url';
import 五减二 from '@/test-support/audio/characters/五减二.mp3?url';
import type { ClozeExercise } from '../ClozeTypes';
import AudioProvider from '@/Content/AudioProvider';

export default function SingleClozeTestData(): ClozeExercise {
  return {
    clozeType: 'SingleCloze',
    clozeText: [
      {
        audio: AudioProvider.createAudioFromUrl(placeholderAudio),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '我',
      },
      {
        audio: AudioProvider.createAudioFromUrl(placeholderAudio),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '有',
      },
      {
        audio: AudioProvider.createAudioFromUrl(两),
        buzzing: false,
        isBlank: true,
        revealed: false,
        suppressClozeAudio: false,
        word: '两',
      },
      {
        audio: AudioProvider.createAudioFromUrl(placeholderAudio),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '个',
      },
      {
        audio: AudioProvider.createAudioFromUrl(placeholderAudio),
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
        audio: AudioProvider.createAudioFromUrl(placeholderAudio),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '不过',
      },
      {
        audio: AudioProvider.createAudioFromUrl(placeholderAudio),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '没有',
      },
      {
        audio: AudioProvider.createAudioFromUrl(placeholderAudio),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '别的',
      },
      {
        audio: AudioProvider.createAudioFromUrl(placeholderAudio),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '兄弟姐妹',
      },
      {
        audio: AudioProvider.createAudioFromUrl(placeholderAudio),
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
        audio: AudioProvider.createAudioFromUrl(术),
        buzzing: false,
        correct: false,
        disabled: false,
        word: '术',
      },
      {
        audio: AudioProvider.createAudioFromUrl(两),
        buzzing: false,
        correct: true,
        disabled: false,
        word: '两',
      },
      {
        audio: AudioProvider.createAudioFromUrl(二),
        buzzing: false,
        correct: false,
        disabled: false,
        word: '二',
      },
      {
        audio: AudioProvider.createAudioFromUrl(五减二),
        buzzing: false,
        correct: false,
        disabled: false,
        word: '五减二',
      },
    ],
  };
}
