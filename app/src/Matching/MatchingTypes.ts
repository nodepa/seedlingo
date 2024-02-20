import { ExerciseAudio } from '@/common/types/ExerciseAudioType';

export type MatchingExercise = Array<MatchingItem>;

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
