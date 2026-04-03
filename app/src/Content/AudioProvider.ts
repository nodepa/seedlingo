import { reactive } from 'vue';
import type { ExerciseAudio } from '@/common/types/ExerciseAudioType';
import Content from './Content';

export default class AudioProvider {
  private static waitForElement(
    el: HTMLAudioElement,
    timeoutMs = 500,
  ): Promise<void> {
    // HAVE_FUTURE_DATA (3) or HAVE_ENOUGH_DATA (4) — already buffered enough
    if (el.readyState >= 3) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const onReady = () => {
        cleanup();
        resolve();
      };
      const timer = setTimeout(() => {
        cleanup();
        resolve();
      }, timeoutMs);
      function cleanup() {
        el.removeEventListener('canplaythrough', onReady);
        clearTimeout(timer);
      }
      el.addEventListener('canplaythrough', onReady, { once: true });
    });
  }

  public static createAudioFromPath(src: string): ExerciseAudio {
    return this.createAudioFromUrl(Content.getAudioUrl(src));
  }

  public static createAudioFromUrl(url: string): ExerciseAudio {
    const el = new Audio(url || undefined);
    el.preload = 'auto';
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
      readyToPlay(): Promise<void> {
        return AudioProvider.waitForElement(el);
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
    if (srcs.length === 0) {
      return this.createAudioFromUrl('');
    }
    if (srcs.length === 1) {
      return this.createAudioFromPath(srcs[0]);
    }

    const elements = srcs.map((src) => {
      const el = new Audio(Content.getAudioUrl(src));
      el.preload = 'auto';
      return el;
    });
    let currentIndex = 0;

    const compositeAudio = reactive({
      el: elements[0],
      playing: false,
      play() {
        // Stop any currently playing elements before restarting from the beginning
        elements.forEach((el) => {
          el.pause();
          el.currentTime = 0;
        });
        currentIndex = 0;
        playNext(0);
      },
      cancel() {
        elements[currentIndex]?.pause();
        compositeAudio.playing = false;
      },
      readyToPlay(): Promise<void> {
        return Promise.all(
          elements.map((el) => AudioProvider.waitForElement(el)),
        ).then(() => undefined);
      },
    }) as ExerciseAudio;

    function playNext(index: number) {
      if (index >= elements.length) {
        compositeAudio.playing = false;
        return;
      }
      currentIndex = index;
      compositeAudio.el = elements[index];
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
