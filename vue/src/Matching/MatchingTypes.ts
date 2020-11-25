export interface ExerciseAudio {
  el: HTMLAudioElement;
  isPlaying: boolean;
  play(): void;
  cancel(): void;
}

export interface MatchingItem {
  value: string | Array<string>;
  audio: ExerciseAudio;
  match: number;
  color: string;
  isChar: boolean;
  isIcon: boolean;
  isMatched: boolean;
  isSelected: boolean;
  isBuzzing: boolean;
}
