import type { ExerciseAudio } from '@/common/types/ExerciseAudioType';

export interface MatchingExercise {
  items: Array<MatchingItem>;
  unsuppressWordAudio?: boolean;
}

export interface MatchingItem {
  wordOrIcons: string | Array<string>;
  audio?: ExerciseAudio;
  picture?: string;
  match: number;
  color?: string;
  isWord: boolean;
  isIcon: boolean;
  matched: boolean;
  selected: boolean;
  buzzing: boolean;
}
