<script setup lang="ts">
import HomeButton from './HomeButton.vue';
import ContinueButton from './ContinueButton.vue';
import InstructionButton from './InstructionButton.vue';
import { IonButtons, IonFooter, IonToolbar } from '@ionic/vue';

defineProps<{
  continueInstructionPath: string;
  homeInstructionPath: string;
  instructionPath: string;
  homeButtonDisabled?: boolean;
  homeButtonFocused?: boolean;
  showInstructionExplainer?: boolean;
}>();
</script>

<template>
  <ion-footer>
    <ion-toolbar data-test="bottom-navigation-bar">
      <ion-buttons>
        <HomeButton
          :home-button-disabled="homeButtonDisabled"
          :home-button-focused="homeButtonFocused"
          :home-instruction-path="homeInstructionPath"
        />
        <ContinueButton :continue-instruction-path="continueInstructionPath" />
        <InstructionButton
          :instruction-path="instructionPath"
          :show-instruction-explainer="showInstructionExplainer"
        />
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
</template>

<style scoped>
ion-buttons {
  justify-content: space-evenly;
}
ion-button::part(native) {
  overflow: visible;
}
</style>
