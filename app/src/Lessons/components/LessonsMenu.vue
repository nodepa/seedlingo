<script setup lang="ts">
/* eslint-disable vue/no-deprecated-slot-attribute */
import { ref } from 'vue';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonIcon,
  IonList,
  IonItem,
} from '@ionic/vue';
import Content from '../Content';

const lessonsMeta = ref(Content.LessonsMeta);

const eye = Content.getIcon('mdiEye');
const weightLifter = Content.getIcon('mdiWeightLifter');
</script>

<template>
  <ion-list data-test="lesson-list" lines="none">
    <ion-item
      :data-test="`lesson-${String(index).padStart(2, '0')}`"
      v-for="(lessonContext, index) in lessonsMeta"
      :key="index"
    >
      <ion-card class="margin-auto">
        <ion-card-header>
          <ion-card-title class="center-content align-vertical">
            <ion-icon :icon="lessonContext.icon" />
          </ion-card-title>
        </ion-card-header>
        <ion-card-content class="center-content">
          <ion-button
            v-if="lessonContext.newWords.length > 0"
            size="large"
            :data-test="`lesson-review-button-${String(index).padStart(
              2,
              '0',
            )}`"
            v-instructions="lessonContext.audio"
            :router-link="{ path: `/lesson/${index}/review` }"
            router-direction="none"
          >
            <ion-icon slot="icon-only" :icon="eye" />
          </ion-button>
          <ion-button
            size="large"
            :data-test="`lesson-button-${String(index).padStart(2, '0')}`"
            v-instructions="lessonContext.audio"
            :router-link="{ path: `/lesson/${index}` }"
            router-direction="none"
          >
            <ion-icon slot="icon-only" :icon="weightLifter" />
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-item>
  </ion-list>
</template>

<style scoped>
.margin-auto {
  margin: 10px auto;
}
.center-content {
  display: flex;
  justify-content: center;
}
.align-vertical {
  align-items: center;
}
ion-button {
  margin: 0rem 1rem;
}
ion-icon {
  font-size: 4rem;
}
ion-button ion-icon {
  font-size: 2.5rem;
}
</style>
