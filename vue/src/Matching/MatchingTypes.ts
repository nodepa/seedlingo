export interface ExerciseAudio {
  el: HTMLAudioElement;
  playing: boolean;
  play(): void;
  cancel(): void;
}

export interface MatchingItem {
  value: string | Array<string>;
  audio?: ExerciseAudio;
  match: number;
  color: string;
  isWord: boolean;
  isIcon: boolean;
  matched: boolean;
  selected: boolean;
  buzzing: boolean;
}
