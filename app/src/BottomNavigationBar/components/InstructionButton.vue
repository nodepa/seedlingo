<script setup lang="ts">
import {
  ComponentPublicInstance,
  computed,
  ComputedRef,
  onMounted,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import ContentConfig from '@/Lessons/ContentSpec';
import { Instruction } from '@/common/directives/InstructionDirective';
import InstructionIcon from '@/common/icons/InstructionIcon';
import InstructionCloseIcon from '@/common/icons/InstructionCloseIcon';

const store = useStore();

const instructionButton = ref({} as ComponentPublicInstance);
const showGetInstructionGraphic: ComputedRef<boolean> = computed(() => {
  return store.state.showGetInstructionGraphic;
});
onMounted(() => {
  if (showGetInstructionGraphic.value && instructionButton.value) {
    const animation = instructionButton.value.$el.animate(
      [
        { backgroundColor: 'inherit' },
        {
          backgroundColor: `${instructionButton.value.$vuetify.theme.themes[
            instructionButton.value.$vuetify.theme.current
          ].colors.primary.toString()}66`,
        },
        { backgroundColor: 'inherit' },
      ],
      { duration: 1300, iterations: Infinity },
    );
    instructionButton.value.$el.addEventListener('click', () =>
      animation.cancel(),
    );
  }
});

const instructionButtonAudio = ref<HTMLAudioElement | null>(null);
const toggleInstructionMode = (): void => {
  if (showGetInstructionGraphic.value) {
    store.dispatch('setShowGetInstructionGraphic', false);

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
  <v-btn
    ref="instructionButton"
    icon
    :input-value="isInstructionMode"
    @click="toggleInstructionMode()"
    data-test="toggle-instruction-button"
    :class="{ 'v-btn--active': showGetInstructionGraphic }"
  >
    <v-icon
      v-if="isInstructionMode"
      data-test="instruction-close-icon"
      size="3rem"
      :icon="InstructionCloseIcon"
      aria-hidden="false"
    >
    </v-icon>
    <v-icon
      v-else
      :color="showGetInstructionGraphic ? 'primary' : 'inherit'"
      data-test="instruction-icon"
      size="3rem"
      :icon="InstructionIcon"
      aria-hidden="false"
    >
    </v-icon>
    <audio ref="instructionButtonAudio" :src="instructionPath" />
  </v-btn>
</template>
