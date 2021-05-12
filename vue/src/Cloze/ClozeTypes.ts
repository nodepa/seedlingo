import { ExerciseAudio } from '@/Matching/MatchingTypes';

export interface ClozeExercise {
  sentenceBeginning: Array<string>;
  sentenceBlank: string;
  sentenceEnd: Array<string>;
  sentenceAudio?: HTMLAudioElement;
  sentenceAudioPlaying: boolean;
  showingBlankFilled: boolean;
  options: Array<ClozeOption>;
}

export interface ClozeOption {
  word: string;
  audio?: HTMLAudioElement;
  correct: boolean;
  disabled: boolean;
  playing: boolean;
  buzzing: boolean;
  color: string;
}

export interface ClozeMatchingExercise {
  clozeText: Array<ClozeWord>;
  clozeOptions: Array<ClozeMatchingOption>;
}

export interface ClozeWord {
  word: string;
  isBlank?: boolean;
  revealed?: boolean;
  audio?: ExerciseAudio;
  buzzing?: boolean;
  linkedClozeOption?: number;
}

export interface ClozeMatchingOption {
  word: string;
  audio: ExerciseAudio; // changed from ClozeOption
  // correct: boolean; // removed vs ClozeOption
  disabled: boolean;
  // playing: boolean; // removed vs ClozeOption
  buzzing: boolean;
  color: string;
  linkedClozeWord: number; // added vs ClozeOption:
}
