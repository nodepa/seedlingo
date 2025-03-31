<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { home, homeSharp } from 'ionicons/icons';
import { useStore } from 'vuex';

const store = useStore();
interface Props {
  homeButtonInstructions: string;
  homeButtonDisabled?: boolean;
  homeButtonFocused?: boolean;
}
withDefaults(defineProps<Props>(), {
  homeButtonDisabled: false,
  homeButtonFocused: false,
});
</script>

<template>
  <ion-button
    v-instructions="homeButtonInstructions"
    data-test="home-button"
    aria-label="Show list of units"
    :disabled="homeButtonDisabled"
    router-link="/"
    router-direction="root"
    @click="store.dispatch('setShowContinueButton', false)"
  >
    <ion-icon
      :md="homeSharp"
      :ios="home"
      :color="homeButtonFocused ? 'primary' : 'medium'"
      aria-hidden="false"
    />
  </ion-button>
</template>

<style scoped>
ion-button {
  min-height: 3.5rem;
  min-width: 6rem;
}
ion-icon {
  font-size: 2rem;
}
</style>
