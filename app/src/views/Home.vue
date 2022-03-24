<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import Lessons from '@/Lessons/components/Lessons.vue';
import FooterSection from '@/FooterSection/components/FooterSection.vue';
</script>

<template>
  <ion-page>
    <ion-content>
      <Lessons />
      <FooterSection />
    </ion-content>
  </ion-page>
</template>
