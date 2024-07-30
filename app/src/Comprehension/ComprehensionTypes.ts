import type { ExerciseAudio } from '@/common/types/ExerciseAudioType';
import type { MatchingExercise } from '@/Matching/MatchingTypes';
import type { MultipleChoiceExercise } from '@/MultipleChoice/MultipleChoiceTypes';

export interface ComprehensionExercise {
  comprehensionText: Array<ComprehensionWord>;
  questions: Array<ComprehensionQuestion>;
  stages: Array<ComprehensionStage>;
  newWordsExercises?: Array<MultipleChoiceExercise | MatchingExercise>;
  injectSpaces?: boolean;
}

export interface ComprehensionWord {
  audio?: ExerciseAudio;
  suppressComprehensionAudio?: boolean;
  word: string;
  isNew?: boolean;
  isPunctuation?: boolean;
}

export interface ComprehensionStage {
  instructionText?: string;
  instructionAudio?: ExerciseAudio;
  questionnaire?: boolean;
  onlyInstructOnRequest?: boolean;
}

export interface ComprehensionQuestion {
  questionText: string;
  questionAudio?: ExerciseAudio;
  options: Array<ComprehensionOption>;
}

export interface ComprehensionOption {
  audio?: ExerciseAudio;
  buzzing: boolean;
  color?: string;
  correct?: boolean;
  disabled: boolean;
  suppressOptionAudio?: boolean;
  word: string;
}
