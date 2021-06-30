export interface ClozeOption {
  word: string;
  audio?: HTMLAudioElement;
  correct: boolean;
  disabled: boolean;
  playing: boolean;
  buzzing: boolean;
  color: string;
}

export interface ClozeExercise {
  sentenceBeginning: Array<string>;
  sentenceBlank: string;
  sentenceEnd: Array<string>;
  sentenceAudio?: HTMLAudioElement;
  sentenceAudioPlaying: boolean;
  showingBlankFilled: boolean;
  options: Array<ClozeOption>;
}
