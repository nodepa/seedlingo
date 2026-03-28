import { reactive } from 'vue';
import type { ExerciseAudio } from '@/common/types/ExerciseAudioType';

/**
 * Creates an ExerciseAudio instance from a raw base64 audio string (no data
 * URI prefix). If no audio data is provided a silent stub is returned so that
 * the exercise component still works without audio.
 */
export function createAudioFromBase64(base64?: string | null): ExerciseAudio {
  if (!base64) {
    return createSilentAudio();
  }

  const el = new Audio(`data:audio/mpeg;base64,${base64}`);

  const audio = reactive<ExerciseAudio>({
    el,
    playing: false,
    play() {
      if (audio.playing) return;
      audio.el.currentTime = 0;
      audio.el.play().catch(() => {
        // Autoplay may be blocked; silently ignore
        audio.playing = false;
      });
    },
    cancel() {
      audio.el.pause();
      audio.el.currentTime = 0;
      audio.playing = false;
    },
  });

  el.addEventListener('play', () => {
    audio.playing = true;
  });
  el.addEventListener('ended', () => {
    audio.playing = false;
  });
  el.addEventListener('pause', () => {
    audio.playing = false;
  });

  return audio;
}

function createSilentAudio(): ExerciseAudio {
  const el = new Audio();
  return reactive<ExerciseAudio>({
    el,
    playing: false,
    play() {},
    cancel() {},
  });
}
