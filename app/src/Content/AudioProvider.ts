import { reactive } from 'vue';
import type { ExerciseAudio } from '@/common/types/ExerciseAudioType';
import Content from './Content';

export default class AudioProvider {
  public static createAudioFromPath(src: string): ExerciseAudio {
    return this.createAudioFromData(Content.getAudioData(src));
  }

  public static createAudioFromData(data: string): ExerciseAudio {
    const el = new Audio(data || undefined);
    const audio = reactive({
      el,
      playing: false,
      play() {
        el.currentTime = 0;
        el.play();
      },
      cancel() {
        el.pause();
      },
    }) as ExerciseAudio;

    el.onplaying = () => {
      audio.playing = true;
    };
    el.onpause = () => {
      audio.playing = false;
    };
    el.onended = () => {
      audio.playing = false;
    };

    return audio;
  }
}
