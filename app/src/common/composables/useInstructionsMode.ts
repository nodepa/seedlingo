import { ref } from 'vue';

// Module-level singletons — shared across the entire app, matching the
// previous Vuex global-state behaviour.

const isInstructionsMode = ref(false);

const showInstructionsExplainer = ref(
  !(Number(localStorage.getItem('InstructionsExplainerShownCount')) > 0),
);

function toggleInstructionsMode(): void {
  isInstructionsMode.value = !isInstructionsMode.value;
}

function hideInstructionsExplainer(): void {
  const shownCount =
    Number(localStorage.getItem('InstructionsExplainerShownCount')) || 0;
  localStorage.setItem('InstructionsExplainerShownCount', `${shownCount + 1}`);
  showInstructionsExplainer.value = false;
}

function resetInstructionsMode(): void {
  isInstructionsMode.value = false;
  showInstructionsExplainer.value = !(
    Number(localStorage.getItem('InstructionsExplainerShownCount')) > 0
  );
}

export function useInstructionsMode() {
  return {
    isInstructionsMode,
    showInstructionsExplainer,
    toggleInstructionsMode,
    hideInstructionsExplainer,
    resetInstructionsMode,
  };
}
