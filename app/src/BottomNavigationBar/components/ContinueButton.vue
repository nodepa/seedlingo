<script setup lang="ts">
import {
  ComponentPublicInstance,
  computed,
  ComputedRef,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { mdiForward } from '@mdi/js';
import ContentConfig from '@/Lessons/ContentSpec';

const continueButton = ref({} as ComponentPublicInstance);
watch(
  () => continueButton.value,
  (continueButton) => {
    if (continueButton) {
      const animation = continueButton.$el.animate(
        [
          { backgroundColor: 'inherit' },
          {
            backgroundColor: `${continueButton.$vuetify.theme.themes[
              continueButton.$vuetify.theme.current
            ].colors.primary.toString()}66`,
          },
          { backgroundColor: 'inherit' },
        ],
        { duration: 1300, iterations: Infinity },
      );

      continueButton.$el.addEventListener('click', () => {
        animation.cancel();
      });
    }
  },
);

const store = useStore();
const showContinueButton: ComputedRef<boolean> = computed(() => {
  return store.state.showContinueButton;
});

const continueInstructionPath: ComputedRef<string> = computed(() => {
  return ContentConfig.getInstructionPathFor('continueButton');
});
</script>

<template>
  <v-btn
    v-if="showContinueButton"
    icon
    ref="continueButton"
    data-test="continue-button"
    @click="store.dispatch('setShowContinueButton', false)"
    v-instruction="continueInstructionPath"
  >
    <v-icon
      :icon="mdiForward"
      size="3rem"
      color="success"
      aria-hidden="false"
    />
  </v-btn>
</template>

<style scoped>
.v-bottom-navigation .v-btn {
  opacity: 1;
}
</style>
