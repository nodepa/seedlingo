<script setup lang="ts">
import HomeButton from './HomeButton.vue';
import ContinueButton from './ContinueButton.vue';
import ToggleInstructionsButton from './ToggleInstructionsButton.vue';
import { IonButtons, IonFooter, IonToolbar } from '@ionic/vue';

defineProps<{
  continueButtonInstructions: string;
  homeButtonInstructions: string;
  toggleInstructionsButtonInstructions: string;
  homeButtonDisabled?: boolean;
  homeButtonFocused?: boolean;
  showInstructionsExplainer?: boolean;
}>();
</script>

<template>
  <ion-footer>
    <ion-toolbar data-test="bottom-navigation-bar">
      <ion-buttons>
        <HomeButton
          :home-button-disabled="homeButtonDisabled"
          :home-button-focused="homeButtonFocused"
          :home-button-instructions="homeButtonInstructions"
        />
        <ContinueButton
          :continue-button-instructions="continueButtonInstructions"
        />
        <ToggleInstructionsButton
          :toggle-instructions-button-instructions="
            toggleInstructionsButtonInstructions
          "
          :show-instructions-explainer="showInstructionsExplainer"
        />
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
</template>

<style scoped>
ion-buttons {
  justify-content: space-evenly;
}
</style>
