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
    <span class="badge bg-primary white-text text-button">
      <svg
        class="v-icon__svg"
        viewBox="0 0 24 24"
        role="img"
        aria-hidden="true"
      >
        <path :d="InstructionIcon" />
      </svg>
    </span>
    <RippleAnimation :playing="playing" />
    <RippleAnimation :delay="200" :playing="playing" />
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
  border-radius: 100%;
  padding: 2px;
  z-index: 5;
  top: 52%;
  left: 52%;
  width: 3em;
  height: 3em;
}
</style>
