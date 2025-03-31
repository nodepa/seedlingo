<script setup lang="ts">
import {
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonPage,
  IonRow,
} from '@ionic/vue';
import logoUrl from '@/assets/logo/logo-col.svg';
</script>

<template>
  <ion-page>
    <ion-content>
      <ion-grid fixed>
        <ion-row class="ion-justify-content-center">
          <ion-col size="auto">
            <ion-img alt="Seedlingo Logo" :src="logoUrl" />
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-around">
          <ion-col size="auto">
            <h1>Seedlingo</h1>
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-col size="8">
            <p class="ion-text-justify">
              Seedlingo is a literacy education tool that was originally
              developed by idea of - and for the benefit of -
              <a href="https://liaieducation.com">Li Ai Education</a>
              as part of a research project aiming to empower rural citizens.
            </p>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-grid {
  height: 100%;
  align-items: center;
}
ion-img {
  width: 12rem;
  height: 12rem;
}
</style>
