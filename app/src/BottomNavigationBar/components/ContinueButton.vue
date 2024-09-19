<script setup lang="ts">
import {
  ComponentPublicInstance,
  computed,
  ComputedRef,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { createAnimation, IonButton, IonIcon } from '@ionic/vue';
import { arrowForward } from 'ionicons/icons';

defineProps<{
  continueButtonInstructions: string;
}>();

const continueButton = ref({} as ComponentPublicInstance);
watch(
  () => continueButton.value,
  (continueButton) => {
    if (continueButton) {
      const animation = createAnimation()
        .addElement(continueButton.$el)
        .duration(2000)
        .iterations(Infinity)
        .keyframes([
          { offset: 0, backgroundColor: 'inherit' },
          {
            offset: 0.5,
            backgroundColor: 'rgba(var(--ion-color-success-rgb), 0.3)',
          },
        ]);
      continueButton.$el.addEventListener('click', () => {
        animation.stop();
      });
      animation.play();
    }
  },
);

const store = useStore();
const showContinueButton: ComputedRef<boolean> = computed(() => {
  return store.state.showContinueButton;
});
</script>

<template>
  <ion-button
    v-if="showContinueButton"
    ref="continueButton"
    v-instructions="continueButtonInstructions"
    data-test="continue-button"
    aria-label="Show the next exercise"
    @click="store.dispatch('setShowContinueButton', false)"
  >
    <ion-icon :icon="arrowForward" color="success" aria-hidden="false" />
  </ion-button>
</template>

<style scoped>
ion-button {
  min-height: 3.5rem;
  min-width: 6rem;
}
ion-icon {
  font-size: 2.5rem;
}
</style>
