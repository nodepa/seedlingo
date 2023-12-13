<script setup lang="ts">
import { ExerciseAudio } from '@/common/types/ExerciseAudioType';
import Instructor from '@/common/icons/HoneyBee.svg';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import { computed, ref } from 'vue';

interface Props {
  audio?: ExerciseAudio;
  text?: string;
  centered?: boolean;
  sizeWhenQuiet?: number;
  sizeWhenSpeaking?: number;
}
withDefaults(defineProps<Props>(), {
  audio: undefined,
  text: undefined,
  centered: false,
  sizeWhenQuiet: 48,
  sizeWhenSpeaking: 164,
});
defineEmits(['click']);
const card = ref();
const cardHeight = computed(() => {
  return +getComputedStyle(card.value).height.replace('px', '');
});
</script>
<template>
  <div>
    <!-- Honeybee icon -->
    <button
      :style="{
        position: 'relative',
        zIndex: 1,
        left: centered
          ? `calc(50% - ${
              audio?.playing ? sizeWhenSpeaking / 2 : sizeWhenQuiet / 2
            }px)`
          : '0px',
        width: audio?.playing ? `${sizeWhenSpeaking}px` : `${sizeWhenQuiet}px`,
        height: `${audio?.playing ? sizeWhenSpeaking : sizeWhenQuiet}px`,
        transition: '1s ease-in-out',
        color: 'var(--ion-card-background)',
        backgroundColor: 'var(--ion-color-card)',
        border: '2px solid var(--ion-color-primary)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }"
      @click="$emit('click')"
    >
      <ion-icon
        :icon="Instructor"
        style="width: 80%; height: 80%; transition: 1s ease-in-out"
        aria-hidden="false"
      />
      <RippleAnimation :playing="audio?.playing" />
    </button>
    <!-- Honeybee text -->
    <div
      :style="{
        width: '100%',
        height: audio?.playing ? `${cardHeight}px` : '0px',
        marginTop: '-20px',
        scale: audio?.playing ? 1 : 0,
        translate: centered
          ? undefined
          : audio?.playing
            ? '0% 0%'
            : 'calc(-50% - 10px) calc(-50% - 10px)',
        transition: '1s ease-in-out',
      }"
    >
      <ion-card ref="card" @click="$emit('click')">
        <ion-card-content style="font-size: 1rem; line-height: normal">
          <span>{{ text }} </span>
        </ion-card-content>
      </ion-card>
    </div>
  </div>
</template>
