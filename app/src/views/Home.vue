<script setup lang="ts">
import Lessons from '@/Lessons/components/Lessons.vue';
import FooterSection from '@/FooterSection/components/FooterSection.vue';
</script>

<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col>
        <Lessons />
        <FooterSection />
      </v-col>
    </v-row>
  </v-container>
</template>
