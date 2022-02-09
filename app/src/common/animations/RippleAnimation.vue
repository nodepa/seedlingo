<script setup lang="ts">
import { computed, ref, watch } from 'vue';

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

const zIndex = computed(() => (props.playing ? 10 : -10));

watch(
  () => props.playing,
  (playing: boolean): void => {
    if (animation) {
      if (playing) {
        animation.play();
      } else {
        animation.cancel();
      }
    } else {
      if (!!playing && ripple.value) {
        animation = ripple.value.animate(keyFrames, {
          delay: props.delay,
          duration: props.duration,
          iterations: props.iterations,
        });
      }
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
  z-index: v-bind(zIndex);
  opacity: 0;
  border-style: solid;
  border-radius: 100%;
  position: absolute;
  top: calc(50% - v-bind(size) / 2);
  left: calc(50% - v-bind(size) / 2);
}
</style>
