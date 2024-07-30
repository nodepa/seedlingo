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
import Content from '@/Content/Content';

const unitsMeta = ref(Content.UnitsMeta);

const eye = Content.getIcon('mdiEye');
const weightLifter = Content.getIcon('mdiWeightLifter');
</script>

<template>
  <ion-list data-test="unit-list" lines="none">
    <ion-item
      v-for="(unitContext, index) in unitsMeta"
      :key="index"
      :data-test="`unit-${String(index).padStart(2, '0')}`"
    >
      <ion-card class="margin-auto" style="width: 18rem">
        <ion-card-header>
          <ion-card-title
            class="center-content align-vertical"
            style="display: flex; flex-direction: column"
          >
            <ion-icon :icon="unitContext.icon" />
            <span style="color: var(--ion-color-step-400)">
              {{ unitContext.name }}
            </span>
          </ion-card-title>
        </ion-card-header>
        <ion-card-content class="center-content">
          <ion-button
            v-if="unitContext.newWords.length > 0"
            v-instructions="unitContext.audio"
            size="large"
            :data-test="`unit-review-button-${String(index).padStart(2, '0')}`"
            :router-link="{ path: `/unit/${index}/review` }"
            router-direction="forward"
          >
            <ion-icon slot="icon-only" :icon="eye" />
          </ion-button>
          <ion-button
            v-instructions="unitContext.audio"
            size="large"
            :data-test="`unit-button-${String(index).padStart(2, '0')}`"
            :router-link="{ path: `/unit/${index}` }"
            router-direction="forward"
          >
            <ion-icon slot="icon-only" :icon="weightLifter" />
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-item>
  </ion-list>
</template>

<style>
.ion-page {
  background-color: var(--ion-background-color);
}
</style>

<style scoped>
.margin-auto {
  margin: 10px auto;
}
.center-content {
  display: flex;
  justify-content: center;
  text-align: center;
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
