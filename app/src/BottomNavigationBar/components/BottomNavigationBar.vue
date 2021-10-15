<script setup lang="ts">
import HomeButton from './HomeButton.vue';
import ContinueButton from './ContinueButton.vue';
import InstructionButton from './InstructionButton.vue';

defineProps<{ homeButtonDisabled: boolean }>();
</script>

<template>
  <v-bottom-navigation app grow height="74" data-test="bottom-navigation-bar">
    <HomeButton :home-button-disabled="homeButtonDisabled" />
    <ContinueButton />
    <InstructionButton />
  </v-bottom-navigation>
</template>

<style>
.v-bottom-navigation .v-btn {
  filter: grayscale(0);
}
</style>
