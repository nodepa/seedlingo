import { ExerciseAudio } from '@/common/types/ExerciseAudioType';

export interface MultipleChoiceExercise {
  itemUnderTestAudio?: ExerciseAudio;
  itemUnderTestAudioPlaying?: boolean;
  iconToMatch?: Array<string>;
  pictureToMatch?: string;
  explanationToMatch?: string;
  options: Array<MultipleChoiceItem>;
}

export interface MultipleChoiceItem {
  word: string;
  audio: ExerciseAudio;
  correct: boolean;
  disabled: boolean;
  playing: boolean;
  color?: string;
}
