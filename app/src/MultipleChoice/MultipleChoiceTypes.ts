export interface MultipleChoiceExercise {
  itemUnderTestAudio?: HTMLMediaElement;
  itemUnderTestAudioPlaying?: boolean;
  iconToMatch?: Array<string>;
  pictureToMatch?: string;
  explanationToMatch?: string;
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
