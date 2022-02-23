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
import InstructionIcon from '@/common/icons/InstructionIcon.svg';
import InstructionCloseIcon from '@/common/icons/InstructionCloseIcon.svg';
import { Instruction } from '@/common/directives/InstructionDirective';
import ContentConfig from '@/Lessons/ContentSpec';

interface Props {
  showInstructionExplainer?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  showInstructionExplainer: false,
});

const instructionButton = ref({} as ComponentPublicInstance);
onMounted(() => {
  if (props.showInstructionExplainer && instructionButton.value) {
    const animation = createAnimation()
      .addElement(instructionButton.value.$el)
      .duration(2000)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, backgroundColor: 'inherit' },
        {
          offset: 0.5,
          backgroundColor: 'rgba(var(--ion-color-primary-rgb), 0.3)',
        },
      ]);
    instructionButton.value.$el.addEventListener('click', () => {
      animation.stop();
    });
    animation.play();
  }
});

const store = useStore();

const instructionButtonAudio = ref<HTMLAudioElement | null>(null);
const toggleInstructionMode = (): void => {
  if (props.showInstructionExplainer) {
    store.dispatch('setShowInstructionExplainer', false);

    // Add <audio> element to Instruction.Collection to trigger cancelling whenever another instruction starts playing
    const audioEl = instructionButtonAudio.value as HTMLAudioElement;
    Instruction.AudioCollection.push(audioEl);
    audioEl.currentTime = 0;
    audioEl.play();
  }

  store.dispatch('instructionStore/toggleInstructionMode');
};

const isInstructionMode: ComputedRef<boolean> = computed(() => {
  return store.state.instructionStore.isInstructionMode;
});

const instructionPath: ComputedRef<string> = computed(() => {
  return ContentConfig.getInstructionPathFor('instructionButton');
});
</script>

<template>
  <ion-button
    data-test="toggle-instruction-button"
    ref="instructionButton"
    @click="toggleInstructionMode()"
  >
    <ion-icon
      v-if="isInstructionMode"
      data-test="instruction-close-icon"
      color="primary"
      :icon="InstructionCloseIcon"
      aria-hidden="false"
    />
    <ion-icon
      v-else
      data-test="instruction-icon"
      :icon="InstructionIcon"
      :color="showInstructionExplainer ? 'primary' : 'medium'"
      aria-hidden="false"
    />
    <audio ref="instructionButtonAudio" :src="instructionPath" />
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
