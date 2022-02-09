import 术 from '@/test-support/audio/characters/术.mp3.audio';
import 两 from '@/test-support/audio/characters/两.mp3.audio';
import 二 from '@/test-support/audio/characters/二.mp3.audio';
import 五减二 from '@/test-support/audio/characters/五减二.mp3.audio';
import placeholderAudio from '@/test-support/audio/placeholder-audio.mp3.audio';
import { ClozeExercise } from '@/Cloze/ClozeTypes';
import ExerciseProvider from '@/Lessons/ExerciseProvider';

export default function SingleClozeTestData(): ClozeExercise {
  return {
    clozeType: 'SingleCloze',
    clozeText: [
      {
        audio: ExerciseProvider.createAudio(
          `data:audio/mpeg;base64,${placeholderAudio}`,
        ),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '我',
      },
      {
        audio: ExerciseProvider.createAudio(
          `data:audio/mpeg;base64,${placeholderAudio}`,
        ),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '有',
      },
      {
        audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${两}`),
        buzzing: false,
        isBlank: true,
        revealed: false,
        suppressClozeAudio: false,
        word: '两',
      },
      {
        audio: ExerciseProvider.createAudio(
          `data:audio/mpeg;base64,${placeholderAudio}`,
        ),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '个',
      },
      {
        audio: ExerciseProvider.createAudio(
          `data:audio/mpeg;base64,${placeholderAudio}`,
        ),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '弟弟',
      },
      {
        audio: ExerciseProvider.createAudio(
          `data:audio/mpeg;base64,${placeholderAudio}`,
        ),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '，',
      },
      {
        audio: ExerciseProvider.createAudio(
          `data:audio/mpeg;base64,${placeholderAudio}`,
        ),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '不过',
      },
      {
        audio: ExerciseProvider.createAudio(
          `data:audio/mpeg;base64,${placeholderAudio}`,
        ),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '没有',
      },
      {
        audio: ExerciseProvider.createAudio(
          `data:audio/mpeg;base64,${placeholderAudio}`,
        ),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '别的',
      },
      {
        audio: ExerciseProvider.createAudio(
          `data:audio/mpeg;base64,${placeholderAudio}`,
        ),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '兄弟姐妹',
      },
      {
        audio: ExerciseProvider.createAudio(
          `data:audio/mpeg;base64,${placeholderAudio}`,
        ),
        buzzing: false,
        isBlank: false,
        revealed: false,
        suppressClozeAudio: false,
        word: '。',
      },
    ],
    clozeOptions: [
      {
        audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${术}`),
        buzzing: false,
        color: 'primary',
        correct: false,
        disabled: false,
        word: '术',
      },
      {
        audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${两}`),
        buzzing: false,
        color: 'primary',
        correct: true,
        disabled: false,
        word: '两',
      },
      {
        audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${二}`),
        buzzing: false,
        color: 'primary',
        correct: false,
        disabled: false,
        word: '二',
      },
      {
        audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${五减二}`),
        buzzing: false,
        color: 'primary',
        correct: false,
        disabled: false,
        word: '五减二',
      },
    ],
  };
}
