<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import UnitsMenu from '@/UnitsMenu/components/UnitsMenu.vue';
import FooterLinks from '@/FooterLinks/components/FooterLinks.vue';
</script>

<template>
  <ion-page>
    <ion-content>
      <UnitsMenu />
      <FooterLinks />
    </ion-content>
  </ion-page>
</template>
