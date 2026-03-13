import { beforeEach, describe, expect, it } from 'vitest';
import { createStore } from 'vuex';
import InstructionsModeStore from '@/common/store/InstructionsModeStore';
import type { InstructionsModeState } from '@/common/directives/InstructionsDirective';

interface TestStoreState {
  instructionsModeStore: InstructionsModeState;
}

function createTestStore() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createStore<TestStoreState>({
    modules: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      instructionsModeStore: InstructionsModeStore as any,
    },
  });
}

describe('InstructionsModeStore', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: ReturnType<typeof createTestStore>;

  beforeEach(async () => {
    store = createTestStore();
    await store.dispatch('instructionsModeStore/resetState');
  });

  describe('initial state', () => {
    it('has isInstructionsMode set to false', () => {
      expect(store.state.instructionsModeStore.isInstructionsMode).toBe(false);
    });
  });

  describe('toggleInstructionsMode action', () => {
    it('sets isInstructionsMode to true on first toggle', async () => {
      await store.dispatch('instructionsModeStore/toggleInstructionsMode');
      expect(store.state.instructionsModeStore.isInstructionsMode).toBe(true);
    });

    it('sets isInstructionsMode back to false on second toggle', async () => {
      await store.dispatch('instructionsModeStore/toggleInstructionsMode');
      await store.dispatch('instructionsModeStore/toggleInstructionsMode');
      expect(store.state.instructionsModeStore.isInstructionsMode).toBe(false);
    });

    it('alternates state correctly across multiple toggles', async () => {
      for (let i = 0; i < 5; i++) {
        await store.dispatch('instructionsModeStore/toggleInstructionsMode');
        expect(store.state.instructionsModeStore.isInstructionsMode).toBe(
          i % 2 === 0,
        );
      }
    });
  });

  describe('resetState action', () => {
    it('resets isInstructionsMode to false after toggling', async () => {
      await store.dispatch('instructionsModeStore/toggleInstructionsMode');
      expect(store.state.instructionsModeStore.isInstructionsMode).toBe(true);

      await store.dispatch('instructionsModeStore/resetState');
      expect(store.state.instructionsModeStore.isInstructionsMode).toBe(false);
    });

    it('remains false when resetState is called on already-false state', async () => {
      await store.dispatch('instructionsModeStore/resetState');
      expect(store.state.instructionsModeStore.isInstructionsMode).toBe(false);
    });
  });
});
