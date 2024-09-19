<script setup lang="ts">
import ToggleInstructionsOnIcon from '@/common/icons/ToggleInstructionsOnIcon.svg?raw';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import { Ref, ref } from 'vue';

interface Props {
  playing?: Ref<boolean>;
}
const props = withDefaults(defineProps<Props>(), {
  playing: () => ref(false),
});

const playing = ref(props.playing);
</script>

<template>
  <span class="badge-container">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <button
      class="badge"
      aria-label="Play instruction"
      v-html="ToggleInstructionsOnIcon"
    />
    <RippleAnimation :playing="playing" />
  </span>
</template>

<style>
.badge-container {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  font-size: 1rem;
}
.badge {
  position: absolute;
  z-index: 130;
  top: 52%;
  left: 52%;
  width: 2.5rem;
  height: 2.5rem;
  padding: 1px;
  padding-top: 2px;
  border: 2px solid var(--ion-color-primary-contrast);
  border-radius: 100%;
  fill: var(--ion-color-primary-contrast);
  background-color: var(--ion-color-primary);
  box-shadow: 3px 3px 12px var(--ion-color-medium-contrast);
}
</style>
