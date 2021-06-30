import 术 from '@/test-support/audio/characters/术.mp3';
import 两 from '@/test-support/audio/characters/两.mp3';
import 二 from '@/test-support/audio/characters/二.mp3';
import 五减二 from '@/test-support/audio/characters/五减二.mp3';
import sentence from '@/test-support/audio/placeholder-audio.mp3';
import { ClozeExercise } from '@/Cloze/ClozeTypes';

export default function ClozeTestData(): ClozeExercise {
  return {
    sentenceBeginning: ['我', '有'],
    sentenceBlank: '两',
    sentenceEnd: [
      '个',
      '弟弟',
      '，',
      '不过',
      '没有',
      '别的',
      '兄弟',
      '姐妹',
      '。',
    ],
    sentenceAudio: new Audio(sentence),
    sentenceAudioPlaying: false,
    showingBlankFilled: false,
    options: [
      {
        word: '术',
        audio: new Audio(术),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
        color: 'primary',
      },
      {
        word: '两',
        audio: new Audio(两),
        correct: true,
        disabled: false,
        playing: false,
        buzzing: false,
        color: 'primary',
      },
      {
        word: '二',
        audio: new Audio(二),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
        color: 'primary',
      },
      {
        word: '五减二',
        audio: new Audio(五减二),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
        color: 'primary',
      },
    ],
  };
}
