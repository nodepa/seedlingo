import { ref } from 'vue';

// Module-level singleton — shared across the entire app, matching the
// previous Vuex global-state behaviour.
const showContinueButton = ref(false);

export function useContinueButton() {
  return { showContinueButton };
}
