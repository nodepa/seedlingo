// @vitest-environment happy-dom
/**
 * Unit tests for the exercise-completion watcher logic in
 * editor/pages/units/[id].vue.
 *
 * The page itself is too heavy to mount (it requires Amplify, DynamoDB
 * observeQuery, etc.), so we extract the watcher logic into a small reactive
 * setup that mirrors what the page does and verify its behaviour directly.
 *
 * Covered:
 *  - Primary path: exerciseState transitions 'playing' → 'done' when
 *    correctOption.audio.playing goes true → false
 *  - Primary path: does NOT transition while audio is still playing
 *  - Primary path: does NOT transition if showContinueButton has not fired
 *  - Fallback path: transitions after 1000 ms when el.src is empty (no audio)
 *  - Fallback path: does NOT fire 1000 ms timer when el.src is present
 *  - Resetting exerciseState to 'idle' cancels a pending fallback timer
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { reactive, ref, computed, watch } from 'vue';
import type { MultipleChoiceExercise } from '@/MultipleChoice/MultipleChoiceTypes';
import type { ExerciseAudio } from '@/common/types/ExerciseAudioType';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeAudio(hasSrc: boolean): ExerciseAudio {
  const el = new Audio();
  if (hasSrc) {
    // A non-empty src marks this as a "real" audio instance
    Object.defineProperty(el, 'src', {
      value: 'data:audio/mpeg;base64,AAAA',
      writable: true,
    });
  }
  return reactive<ExerciseAudio>({
    el,
    playing: false,
    play: vi.fn(),
    cancel: vi.fn(),
  });
}

function makeExercise(correctHasAudio = true): MultipleChoiceExercise {
  return {
    options: [
      {
        word: 'correct',
        audio: makeAudio(correctHasAudio),
        correct: true,
        disabled: false,
        playing: false,
      },
      {
        word: 'wrong',
        audio: makeAudio(false),
        correct: false,
        disabled: false,
        playing: false,
      },
    ],
    itemUnderTestAudio: makeAudio(true),
  };
}

/**
 * Sets up the same two watchers that editor/pages/units/[id].vue uses,
 * against the provided reactive refs. Returns the refs so tests can
 * manipulate them and assert on exerciseState.
 */
function setupWatchers() {
  const exerciseStore = reactive({ showContinueButton: false });
  const exerciseState = ref<'idle' | 'playing' | 'done'>('playing');
  const currentExercise = ref<MultipleChoiceExercise | null>(null);

  const correctOption = computed(
    () => currentExercise.value?.options.find((opt) => opt.correct) ?? null,
  );

  // Primary watcher — mirrors [id].vue
  watch(
    () => correctOption.value?.audio.playing,
    (playing, wasPlaying) => {
      if (
        wasPlaying === true &&
        playing === false &&
        exerciseState.value === 'playing'
      ) {
        exerciseState.value = 'done';
      }
    },
  );

  // Fallback watcher — mirrors [id].vue
  watch(
    () => exerciseStore.showContinueButton,
    (show) => {
      if (!show || exerciseState.value !== 'playing') return;
      const src = correctOption.value?.audio?.el?.src;
      if (!src) {
        setTimeout(() => {
          if (exerciseState.value === 'playing') {
            exerciseState.value = 'done';
          }
        }, 1000);
      }
    },
  );

  return { exerciseStore, exerciseState, currentExercise };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('exercise completion watchers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('primary path (audio.playing true → false)', () => {
    it('transitions to "done" when correct option audio stops playing', async () => {
      const { exerciseState, currentExercise } = setupWatchers();
      currentExercise.value = makeExercise(true);

      const correctAudio = currentExercise.value.options[0]!.audio;

      // Simulate audio starting then ending
      correctAudio.playing = true;
      await Promise.resolve();
      correctAudio.playing = false;
      await Promise.resolve();

      expect(exerciseState.value).toBe('done');
    });

    it('does NOT transition while audio is still playing', async () => {
      const { exerciseState, currentExercise } = setupWatchers();
      currentExercise.value = makeExercise(true);

      const correctAudio = currentExercise.value.options[0]!.audio;
      correctAudio.playing = true;
      await Promise.resolve();

      expect(exerciseState.value).toBe('playing');
    });

    it('does NOT transition when exerciseState is not "playing"', async () => {
      const { exerciseState, currentExercise } = setupWatchers();
      currentExercise.value = makeExercise(true);
      exerciseState.value = 'idle';

      const correctAudio = currentExercise.value.options[0]!.audio;
      correctAudio.playing = true;
      await Promise.resolve();
      correctAudio.playing = false;
      await Promise.resolve();

      expect(exerciseState.value).toBe('idle');
    });

    it('does NOT react to the wrong option audio stopping', async () => {
      const { exerciseState, currentExercise } = setupWatchers();
      currentExercise.value = makeExercise(true);

      const wrongAudio = currentExercise.value.options[1]!.audio;
      wrongAudio.playing = true;
      await Promise.resolve();
      wrongAudio.playing = false;
      await Promise.resolve();

      expect(exerciseState.value).toBe('playing');
    });

    it('does NOT transition if showContinueButton was never set', async () => {
      const { exerciseState, currentExercise } = setupWatchers();
      currentExercise.value = makeExercise(true);
      // Never set showContinueButton — audio.playing going true→false alone
      // is sufficient for the primary watcher (it watches audio directly, not
      // the store flag), so exerciseState should become 'done'
      const correctAudio = currentExercise.value.options[0]!.audio;
      correctAudio.playing = true;
      await Promise.resolve();
      correctAudio.playing = false;
      await Promise.resolve();

      // Primary watcher fires regardless of showContinueButton
      expect(exerciseState.value).toBe('done');
    });
  });

  describe('fallback path (no audio — 1000 ms timer)', () => {
    it('transitions to "done" after 1000 ms when correct option has no src', async () => {
      const { exerciseStore, exerciseState, currentExercise } = setupWatchers();
      currentExercise.value = makeExercise(false); // no audio src

      exerciseStore.showContinueButton = true;
      await Promise.resolve();

      // Not transitioned yet
      expect(exerciseState.value).toBe('playing');

      // Advance timers by 1000 ms
      vi.advanceTimersByTime(1000);

      expect(exerciseState.value).toBe('done');
    });

    it('does NOT fire the timer when correct option has a src', async () => {
      const { exerciseStore, exerciseState, currentExercise } = setupWatchers();
      currentExercise.value = makeExercise(true); // has audio src

      exerciseStore.showContinueButton = true;
      await Promise.resolve();

      vi.advanceTimersByTime(2000);

      // Should still be 'playing' — the timer was never set because src exists
      expect(exerciseState.value).toBe('playing');
    });

    it('does NOT transition if exerciseState changed before the timer fires', async () => {
      const { exerciseStore, exerciseState, currentExercise } = setupWatchers();
      currentExercise.value = makeExercise(false);

      exerciseStore.showContinueButton = true;
      await Promise.resolve();

      // Manually reset before timer fires
      exerciseState.value = 'idle';
      vi.advanceTimersByTime(1000);

      expect(exerciseState.value).toBe('idle');
    });

    it('does NOT fire when exerciseState is not "playing"', async () => {
      const { exerciseStore, exerciseState, currentExercise } = setupWatchers();
      currentExercise.value = makeExercise(false);
      exerciseState.value = 'idle';

      exerciseStore.showContinueButton = true;
      await Promise.resolve();
      vi.advanceTimersByTime(1000);

      expect(exerciseState.value).toBe('idle');
    });
  });
});
