export interface ExerciseAudio {
  el: HTMLAudioElement;
  playing: boolean;
  play(): void;
  cancel(): void;
}
