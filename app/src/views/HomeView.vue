<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import LessonsMenu from '../Lessons/components/LessonsMenu.vue';
import FooterLinks from '../FooterLinks/components/FooterLinks.vue';
</script>

<template>
  <ion-page>
    <ion-content>
      <LessonsMenu />
      <FooterLinks />
    </ion-content>
  </ion-page>
</template>
