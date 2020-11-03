export interface MatchingAnswer {
  value: string;
  audio: {
    el: HTMLAudioElement;
    isPlaying: boolean;
    play(): void;
    cancel(): void;
  };
  match: number;
  color: string;
  isChar: boolean;
  isIcon: boolean;
  isMatched: boolean;
  isSelected: boolean;
  isBuzzing: boolean;
}
