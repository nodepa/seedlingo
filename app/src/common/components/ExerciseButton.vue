<script setup lang="ts">
import { ComponentPublicInstance, ref, watch } from 'vue';
import { IonButton } from '@ionic/vue';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';

interface Props {
  playing?: boolean;
  color?: string;
  disabled?: boolean;
  buzzing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  playing: false,
  color: '',
  disabled: false,
  buzzing: false,
});

const emit = defineEmits<{
  (event: 'update:buzzing', buzzing: boolean): void;
  (event: 'click'): void;
}>();

watch(
  () => props.buzzing,
  (buzzing: boolean) => {
    if (buzzing) {
      playAnimation();
    }
  },
);

const button = ref<ComponentPublicInstance | null>(null);

let animation: Animation;
function playAnimation(): void {
  if (animation) {
    animation.play();
  } else {
    const keyFrames = [
      { transform: 'translate(0px, 0px)' },
      { transform: 'translate(-3px, 2px)' },
      { transform: 'translate(2px, 2px)' },
      { transform: 'translate(0px, -2px)' },
      { transform: 'translate(-2px, 3px)' },
      { transform: 'translate(0px, 0px)' },
    ];
    animation = button.value?.$el.animate(keyFrames, {
      duration: 200,
      iterations: 2,
      easing: 'ease-in-out',
    });

    animation.onfinish = () => {
      emit('update:buzzing', false);
    };
  }
}
</script>

<template>
  <ion-button
    ref="button"
    aria-label="An exercise button with a clue to solve the current problem"
    :disabled="disabled"
    :color="buzzing ? 'danger' : color"
    @click="$emit('click')"
  >
    <slot />
    <RippleAnimation :playing="playing" />
  </ion-button>
</template>

<style scoped>
ion-button {
  margin: 0px;
  text-transform: none;
}
.button-disabled::part(native) {
  color: var(--ion-color-tint);
  background-color: var(--ion-color-contrast);
}
</style>
