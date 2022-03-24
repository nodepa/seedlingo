<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonButton, IonIcon, IonLabel, IonList, IonItem } from '@ionic/vue';
import ContentSpec from '../ContentSpec';
import { LessonMenuItems } from '../LessonMenuTypes';

const lessons = ref<LessonMenuItems | null>(null);
onMounted(() => {
  lessons.value = ContentSpec.getLessonsMenu();
});
</script>

<template>
  <ion-list data-test="lesson-list" lines="none">
    <ion-item v-for="(lesson, order) in lessons" :key="order">
      <div class="justify-center">
        <ion-button
          :data-test="`lesson-button-${String(order).padStart(2, '0')}`"
          v-instruction="lesson.audio"
          :router-link="{ path: `/lesson/${order}` }"
          router-direction="none"
        >
          <ion-label>{{ order }}</ion-label>
          <ion-icon :icon="lesson.icon" />
        </ion-button>
      </div>
    </ion-item>
  </ion-list>
</template>

<style scoped>
ion-item {
  margin: 2rem 0px;
}
.justify-center {
  margin: auto;
}
ion-button {
  margin: 0px;
  min-height: 7rem;
  min-width: 12rem;
  font-size: 2rem;
}
ion-button::part(native) {
  border-radius: 24px;
}
ion-label {
  color: var(--ion-color-secondary) !important;
}
ion-icon {
  font-size: 4rem;
  margin-left: 1rem;
}
</style>
