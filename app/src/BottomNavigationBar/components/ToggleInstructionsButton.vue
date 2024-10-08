<script setup lang="ts">
import {
  ComponentPublicInstance,
  computed,
  ComputedRef,
  onMounted,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import { createAnimation, IonButton, IonIcon } from '@ionic/vue';
import ToggleInstructionsOnIcon from '@/common/icons/ToggleInstructionsOnIcon.svg';
import ToggleInstructionsOffIcon from '@/common/icons/ToggleInstructionsOffIcon.svg';
import { Instructions } from '@/common/directives/InstructionsDirective';

interface Props {
  showInstructionsExplainer?: boolean;
  toggleInstructionsButtonInstructions: string;
}
const props = withDefaults(defineProps<Props>(), {
  showInstructionsExplainer: false,
});

const toggleInstructionsButton = ref({} as ComponentPublicInstance);
onMounted(() => {
  if (props.showInstructionsExplainer && toggleInstructionsButton.value) {
    const animation = createAnimation()
      .addElement(toggleInstructionsButton.value.$el)
      .duration(2000)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, backgroundColor: 'inherit' },
        {
          offset: 0.5,
          backgroundColor: 'rgba(var(--ion-color-primary-rgb), 0.3)',
        },
      ]);
    toggleInstructionsButton.value.$el.addEventListener('click', () => {
      animation.stop();
    });
    animation.play();
  }
});

const store = useStore();

const toggleInstructionsButtonAudio = ref<HTMLAudioElement | null>(null);
const toggleInstructionsMode = (): void => {
  if (props.showInstructionsExplainer) {
    store.dispatch('hideInstructionsExplainer');

    // Add <audio> element to Instructions.AudioCollection to trigger cancelling whenever other instructions start playing
    const audioEl = toggleInstructionsButtonAudio.value as HTMLAudioElement;
    Instructions.AudioCollection.push(audioEl);
    audioEl.currentTime = 0;
    audioEl.play();
  }

  store.dispatch('instructionsModeStore/toggleInstructionsMode');
};

const isInstructionsMode: ComputedRef<boolean> = computed(() => {
  return store.state.instructionsModeStore.isInstructionsMode;
});
</script>

<template>
  <ion-button
    ref="toggleInstructionsButton"
    data-test="toggle-instructions-button"
    aria-label="Toggle instructions mode"
    @click="toggleInstructionsMode()"
  >
    <ion-icon
      v-if="isInstructionsMode"
      data-test="toggle-instructions-off-icon"
      color="primary"
      :icon="ToggleInstructionsOffIcon"
      aria-hidden="false"
    />
    <ion-icon
      v-else
      data-test="toggle-instructions-on-icon"
      :icon="ToggleInstructionsOnIcon"
      :color="showInstructionsExplainer ? 'primary' : 'medium'"
      aria-hidden="false"
    />
    <audio
      ref="toggleInstructionsButtonAudio"
      :src="toggleInstructionsButtonInstructions"
    />
  </ion-button>
</template>

<style scoped>
ion-button {
  min-height: 3.5rem;
  min-width: 6rem;
}
ion-icon {
  font-size: 2.5rem;
  stroke-width: 0px;
}
</style>
