import { ExerciseAudio } from '@/common/types/ExerciseAudioType';

export interface MatchingItem {
  wordOrIcons: string | Array<string>;
  audio?: ExerciseAudio;
  match: number;
  color?: string;
  isWord: boolean;
  isIcon: boolean;
  matched: boolean;
  selected: boolean;
  buzzing: boolean;
}
