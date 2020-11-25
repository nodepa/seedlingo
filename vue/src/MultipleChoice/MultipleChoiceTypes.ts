export interface MultipleChoiceExercise {
  itemUnderTestAudio: HTMLMediaElement;
  itemUnderTestAudioIsPlaying: boolean;
  itemUnderTestIcon: [string];
  answers: Array<MultipleChoiceItem>;
}

export interface MultipleChoiceItem {
  char: string;
  audio: HTMLAudioElement;
  correct: boolean;
  disabled: boolean;
  playing: boolean;
  isBuzzing: boolean;
  color?: string;
}
