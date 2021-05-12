import 术 from '@/assets/audio/characters/术.mp3';
import 两 from '@/assets/audio/characters/两.mp3';
import { ClozeMatchingExercise } from '@/Cloze/ClozeTypes';
import ExerciseProvider from '@/Lessons/ExerciseProvider';

export default function ClozeMatchingTestData(): ClozeMatchingExercise {
  return {
    clozeText: [
      {
        word: '我',
        audio: ExerciseProvider.createAudio(术),
      },
      {
        word: '有',
        isBlank: true,
        revealed: false,
        audio: ExerciseProvider.createAudio(术),
        buzzing: false,
        linkedClozeOption: 3,
      },
      {
        word: '两',
        isBlank: true,
        revealed: false,
        audio: ExerciseProvider.createAudio(两),
        buzzing: false,
        linkedClozeOption: 1,
      },
      {
        word: '个',
        audio: ExerciseProvider.createAudio(术),
      },
      {
        word: '弟弟',
        audio: ExerciseProvider.createAudio(术),
      },
      {
        word: '，',
      },
      {
        word: '不过',
        audio: ExerciseProvider.createAudio(术),
      },
      {
        word: '没有',
        isBlank: true,
        revealed: false,
        audio: ExerciseProvider.createAudio(术),
        buzzing: false,
        linkedClozeOption: 2,
      },
      {
        word: '别的',
        audio: ExerciseProvider.createAudio(术),
      },
      {
        word: '兄弟＿姐妹',
        isBlank: true,
        revealed: false,
        audio: ExerciseProvider.createAudio(术),
        buzzing: false,
        linkedClozeOption: 0,
      },
      {
        word: '。',
      },
    ],
    clozeOptions: [
      {
        word: '兄弟姐妹',
        disabled: false,
        buzzing: false,
        color: 'primary',
        audio: ExerciseProvider.createAudio(术),
        linkedClozeWord: 9,
      },
      {
        word: '两',
        linkedClozeWord: 2,
        disabled: false,
        buzzing: false,
        color: 'primary',
        audio: ExerciseProvider.createAudio(两),
      },
      {
        word: '没有',
        linkedClozeWord: 7,
        disabled: false,
        buzzing: false,
        color: 'primary',
        audio: ExerciseProvider.createAudio(术),
      },
      {
        word: '有',
        linkedClozeWord: 1,
        disabled: false,
        buzzing: false,
        color: 'primary',
        audio: ExerciseProvider.createAudio(术),
      },
    ],
  };
}
