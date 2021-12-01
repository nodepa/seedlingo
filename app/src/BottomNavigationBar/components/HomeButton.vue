<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { mdiHome } from '@mdi/js';
import ContentConfig from '@/Lessons/ContentSpec';

interface Props {
  homeButtonDisabled?: boolean;
}
withDefaults(defineProps<Props>(), {
  homeButtonDisabled: false,
});

const homeInstructionPath: ComputedRef<string> = computed(() => {
  return ContentConfig.getInstructionPathFor('homeButton');
});
</script>

<template>
  <v-btn
    exact
    icon
    :to="{ name: 'Home' }"
    data-test="home-button"
    :disabled="homeButtonDisabled"
    v-instruction="homeInstructionPath"
  >
    <v-icon :icon="mdiHome" size="3rem" color="primary" aria-hidden="false" />
  </v-btn>
</template>

<style>
.v-bottom-navigation .v-btn.v-btn--disabled {
  filter: grayscale(1);
}
</style>
