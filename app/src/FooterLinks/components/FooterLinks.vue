<script setup lang="ts">
import { IonButton, IonCol, IonFooter, IonGrid, IonRow } from '@ionic/vue';
</script>

<template>
  <ion-footer>
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="auto">
          <ion-button router-link="/privacy" router-direction="forward">
            Privacy policy
          </ion-button>
        </ion-col>
      </ion-row>
      <ion-row class="ion-justify-content-center">
        <ion-col size="auto" class="ion-text-center">
          <p>&copy; 2019-2024</p>
          <p>
            <a target="_blank" href="https://liaieducation.com"
              >Li Ai Education
            </a>
          </p>
          <p><a target="_blank" href="https://nodepa.org">Nodepa</a></p>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-footer>
</template>

<style scoped>
ion-footer {
  margin-top: 2rem;
  padding-top: 1rem;
}
p {
  margin-block-start: 0.5rem;
  margin-block-end: 0.5rem;
}
</style>
