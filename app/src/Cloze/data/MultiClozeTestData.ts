import placeholderAudio from '@/test-support/audio/placeholder-audio.mp3';
import 两 from '@/test-support/audio/characters/两.mp3';
import { MultiClozeExercise } from '@/Cloze/ClozeTypes';
import ExerciseProvider from '@/Lessons/ExerciseProvider';

export default function MultiClozeTestData(): MultiClozeExercise {
  return {
    clozeText: [
      {
        word: '我',
        audio: ExerciseProvider.createAudio(placeholderAudio),
      },
      {
        word: '有',
        isBlank: true,
        revealed: false,
        audio: ExerciseProvider.createAudio(placeholderAudio),
        buzzing: false,
      },
      {
        word: '两',
        isBlank: true,
        revealed: false,
        audio: ExerciseProvider.createAudio(两),
        buzzing: false,
      },
      {
        word: '个',
        audio: ExerciseProvider.createAudio(placeholderAudio),
      },
      {
        word: '弟弟',
        audio: ExerciseProvider.createAudio(placeholderAudio),
      },
      {
        word: '，',
      },
      {
        word: '不过',
        audio: ExerciseProvider.createAudio(placeholderAudio),
      },
      {
        word: '没有',
        isBlank: true,
        revealed: false,
        audio: ExerciseProvider.createAudio(placeholderAudio),
        buzzing: false,
      },
      {
        word: '别的',
        audio: ExerciseProvider.createAudio(placeholderAudio),
      },
      {
        word: '兄弟姐妹',
        isBlank: true,
        revealed: false,
        audio: ExerciseProvider.createAudio(placeholderAudio),
        buzzing: false,
      },
      {
        word: '。',
      },
    ],
    multiClozeOptions: [
      {
        word: '兄弟姐妹',
        disabled: false,
        buzzing: false,
        color: 'primary',
        audio: ExerciseProvider.createAudio(placeholderAudio),
      },
      {
        word: '两',
        disabled: false,
        buzzing: false,
        color: 'primary',
        audio: ExerciseProvider.createAudio(两),
      },
      {
        word: '没有',
        disabled: false,
        buzzing: false,
        color: 'primary',
        audio: ExerciseProvider.createAudio(placeholderAudio),
      },
      {
        word: '有',
        disabled: false,
        buzzing: false,
        color: 'primary',
        audio: ExerciseProvider.createAudio(placeholderAudio),
      },
    ],
  };
}
