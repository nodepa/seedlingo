<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  playing?: boolean;
  duration?: number;
  delay?: number;
  iterations?: number;
  borderWidth?: string;
  size?: string;
  scale?: string;
  borderColor?: string;
}
const props = withDefaults(defineProps<Props>(), {
  playing: false,
  duration: 500,
  delay: 0,
  iterations: Infinity,
  borderWidth: '4px',
  size: '40px',
  scale: '4',
  borderColor: 'rgba(0,0,0,0.3)',
});

const ripple = ref<HTMLElement | null>(null);
let animation: Animation | undefined;
const keyFrames = [
  { opacity: '1', transform: 'scale(1, 1)' },
  {
    opacity: '0',
    transform: `scale(${props.scale}, ${props.scale})`,
  },
];

watch(
  () => props.playing,
  (playing: boolean): void => {
    if (playing) {
      if (animation) {
        animation.play();
      } else {
        animation = ripple.value?.animate(keyFrames, {
          delay: props.delay,
          duration: props.duration,
          iterations: props.iterations,
        });
      }
    } else {
      animation?.cancel();
    }
  },
);
</script>

<template>
  <span
    ref="ripple"
    class="ripple"
    :style="{
      height: size,
      width: size,
      borderWidth,
      borderColor,
    }"
  />
</template>

<style>
.ripple {
  z-index: 10;
  opacity: 0;
  border-style: solid;
  border-radius: 100%;
  position: absolute;
  top: calc(50% - v-bind(size) / 2);
  left: calc(50% - v-bind(size) / 2);
}
</style>
