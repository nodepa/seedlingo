<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { createAnimation, Animation } from '@ionic/vue';

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
  delay: 200,
  iterations: Infinity,
  borderWidth: '4px',
  size: '40px',
  scale: '3',
  borderColor: 'rgba(0,0,0,0.3)',
});

const ripple = ref<HTMLElement>();
const rippleDelayed = ref<HTMLElement>();
let animation: Animation, animationDelayed: Animation;

const zIndex = computed(() => (props.playing ? 140 : -10));

watch(
  () => props.playing,
  (playing: boolean): void => {
    updatePlaying(playing);
  },
);
onMounted(() => {
  updatePlaying(props.playing);
});
function updatePlaying(playing: boolean): void {
  if (animation && animationDelayed) {
    if (playing) {
      animation.play();
      animationDelayed.play();
    } else {
      animation.stop();
      animationDelayed.stop();
    }
  } else {
    if (!!playing && ripple.value && rippleDelayed.value) {
      animation = createAnimation()
        .addElement(ripple.value)
        .delay(0)
        .duration(props.duration)
        .iterations(props.iterations)
        .fromTo('opacity', 1, 0)
        .fromTo(
          'transform',
          'scale(1, 1)',
          `scale(${props.scale}, ${props.scale})`,
        );
      animation.play();
      animationDelayed = createAnimation()
        .addElement(rippleDelayed.value)
        .delay(props.delay)
        .duration(props.duration)
        .iterations(props.iterations)
        .fromTo('opacity', '1', '0')
        .fromTo(
          'transform',
          'scale(1, 1)',
          `scale(${props.scale}, ${props.scale})`,
        );
      animationDelayed.play();
    }
  }
}
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
  <span
    ref="rippleDelayed"
    class="ripple"
    :style="{
      height: size,
      width: size,
      borderWidth,
      borderColor,
    }"
  />
</template>

<style scoped>
.ripple {
  position: absolute;
  z-index: v-bind(zIndex);
  top: calc(50% - v-bind(size) / 2);
  left: calc(50% - v-bind(size) / 2);
  height: v-bind(size);
  width: v-bind(size);
  border-width: v-bind(borderWidth);
  border-color: v-bind(borderColor);
  opacity: 0;
  border-style: solid;
  border-radius: 100%;
  pointer-events: none;
}
</style>
