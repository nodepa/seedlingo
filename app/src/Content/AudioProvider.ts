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
        el.play().catch(() => {
          // Silently ignore AbortError when play() is interrupted by pause()
        });
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

  public static createCompositeAudioFromPaths(srcs: string[]): ExerciseAudio {
    if (srcs.length <= 1) {
      return this.createAudioFromPath(srcs[0]);
    }

    const elements = srcs.map((src) => new Audio(Content.getAudioData(src)));
    let currentIndex = 0;

    const compositeAudio = reactive({
      el: elements[0],
      playing: false,
      play() {
        currentIndex = 0;
        playNext(0);
      },
      cancel() {
        elements[currentIndex]?.pause();
        compositeAudio.playing = false;
      },
    }) as ExerciseAudio;

    function playNext(index: number) {
      if (index >= elements.length) {
        compositeAudio.playing = false;
        return;
      }
      currentIndex = index;
      elements[index].currentTime = 0;
      elements[index].play().catch(() => {
        // Silently ignore AbortError when play() is interrupted by pause()
      });
    }

    elements.forEach((el, index) => {
      el.onplaying = () => {
        compositeAudio.playing = true;
      };
      el.onpause = () => {
        if (currentIndex === index) {
          compositeAudio.playing = false;
        }
      };
      el.onended = () => {
        playNext(index + 1);
      };
    });

    return compositeAudio;
  }
}
