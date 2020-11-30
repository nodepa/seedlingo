export interface MultipleChoiceExercise {
  itemUnderTestAudio?: HTMLMediaElement;
  itemUnderTestAudioIsPlaying?: boolean;
  iconToMatch?: Array<string>;
  phraseToMatch?: string;
  options: Array<MultipleChoiceItem>;
}

export interface MultipleChoiceItem {
  word: string;
  audio: HTMLAudioElement;
  correct: boolean;
  disabled: boolean;
  playing: boolean;
  buzzing: boolean;
  color?: string;
}
