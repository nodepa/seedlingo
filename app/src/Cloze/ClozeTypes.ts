import { ExerciseAudio } from '@/common/types/ExerciseAudioType';

export interface ClozeExercise {
  clozeOptions: Array<ClozeOption>;
  clozeText: Array<ClozeWord>;
}

export interface MultiClozeExercise {
  clozeText: Array<ClozeWord>;
  multiClozeOptions: Array<ClozeOption>;
}

export interface ClozeWord {
  audio?: ExerciseAudio;
  buzzing?: boolean;
  isBlank?: boolean;
  revealed?: boolean;
  suppressClozeAudio?: boolean;
  word: string;
}

export interface ClozeOption {
  audio?: ExerciseAudio;
  buzzing: boolean;
  color: string;
  correct?: boolean;
  disabled: boolean;
  suppressOptionAudio?: boolean;
  word: string;
}
