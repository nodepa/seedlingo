<script setup lang="ts">
import ContentConfig from '@/Lessons/ContentConfig';
import GetInstructionGraphic from './GetInstructionGraphic.vue';
import { computed, ComputedRef } from 'vue';

const welcomeInstructionPath: ComputedRef<string> = computed(() => {
  return ContentConfig.getInstructionPathFor('welcome');
});
</script>

<template>
  <v-container data-test="get-instruction-component" style="height: 100%" fluid>
    <v-row align="center" justify="center" style="height: 100%">
      <v-col>
        <GetInstructionGraphic class="get-instruction-graphic" />
        <audio autoplay :src="welcomeInstructionPath" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.get-instruction-graphic {
  height: 70vh;
  max-width: 100%;
}

.get-instruction-graphic g {
  animation: touch 3s linear infinite;
}

@keyframes touch {
  0%,
  20%,
  40% {
    transform: translate(0px, 0px);
  }

  24%,
  36% {
    transform: translate(-100px, 40px);
  }
}
</style>
