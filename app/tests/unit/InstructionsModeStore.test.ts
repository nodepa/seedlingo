import { beforeEach, describe, expect, it } from 'vitest';
import { useInstructionsMode } from '@/common/composables/useInstructionsMode';

describe('useInstructionsMode', () => {
  const { isInstructionsMode, toggleInstructionsMode, resetInstructionsMode } =
    useInstructionsMode();

  beforeEach(() => {
    resetInstructionsMode();
  });

  describe('initial state', () => {
    it('has isInstructionsMode set to false', () => {
      expect(isInstructionsMode.value).toBe(false);
    });
  });

  describe('toggleInstructionsMode', () => {
    it('sets isInstructionsMode to true on first toggle', () => {
      toggleInstructionsMode();
      expect(isInstructionsMode.value).toBe(true);
    });

    it('sets isInstructionsMode back to false on second toggle', () => {
      toggleInstructionsMode();
      toggleInstructionsMode();
      expect(isInstructionsMode.value).toBe(false);
    });

    it('alternates state correctly across multiple toggles', () => {
      for (let i = 0; i < 5; i++) {
        toggleInstructionsMode();
        expect(isInstructionsMode.value).toBe(i % 2 === 0);
      }
    });
  });

  describe('resetInstructionsMode', () => {
    it('resets isInstructionsMode to false after toggling', () => {
      toggleInstructionsMode();
      expect(isInstructionsMode.value).toBe(true);

      resetInstructionsMode();
      expect(isInstructionsMode.value).toBe(false);
    });

    it('remains false when resetInstructionsMode is called on already-false state', () => {
      resetInstructionsMode();
      expect(isInstructionsMode.value).toBe(false);
    });
  });
});
