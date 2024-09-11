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
import { eye } from 'ionicons/icons';
import WeightLifter from '@/common/icons/WeightLifter.svg';
import Content from '@/Content/Content';

const unitsMeta = ref(Content.UnitsMeta);
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
            <span style="color: var(--ion-color-step-600)">
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
            aria-label="Review the content of this unit"
            :router-link="`/unit/${index}/review`"
            router-direction="forward"
          >
            <ion-icon slot="icon-only" :icon="eye" />
          </ion-button>
          <ion-button
            v-instructions="unitContext.audio"
            size="large"
            :data-test="`unit-button-${String(index).padStart(2, '0')}`"
            aria-label="Practice the content of this unit"
            :router-link="`/unit/${index}`"
            router-direction="forward"
          >
            <ion-icon slot="icon-only" :icon="WeightLifter" />
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
