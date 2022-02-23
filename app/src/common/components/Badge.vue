<script setup lang="ts">
import InstructionIcon from '@/common/icons/InstructionIcon';
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
    <span class="badge">
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path :d="InstructionIcon" />
      </svg>
    </span>
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
}
.badge {
  position: absolute;
  z-index: 130;
  top: 52%;
  left: 52%;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%;
  padding: 1px;
  fill: var(--ion-color-primary-contrast);
  background-color: var(--ion-color-primary);
  box-shadow: 2px 2px 8px var(--ion-text-color);
  box-shadow: 2px 2px 8px var(--ion-color-medium-contrast);
}
</style>
