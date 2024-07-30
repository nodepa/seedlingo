import { ExerciseAudio } from '@/common/types/ExerciseAudioType';

export interface ClozeExercise {
  clozeOptions: Array<ClozeOption>;
  clozeText: Array<ClozeWord>;
  clozeType: 'SingleCloze' | 'MultiCloze';
  injectSpaces?: boolean;
}

export interface ClozeWord {
  audio?: ExerciseAudio;
  buzzing?: boolean;
  isBlank?: boolean;
  revealed?: boolean;
  suppressClozeAudio?: boolean;
  word: string;
  isPunctuation?: boolean;
}

export interface ClozeOption {
  audio?: ExerciseAudio;
  buzzing: boolean;
  color?: string;
  correct?: boolean;
  disabled: boolean;
  suppressOptionAudio?: boolean;
  word: string;
}
