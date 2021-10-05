<script setup lang="ts">
import Lessons from '@/Lessons/components/Lessons.vue';
import Footer from '@/Footer/components/Footer.vue';
</script>

<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col>
        <Lessons />
        <Footer />
      </v-col>
    </v-row>
  </v-container>
</template>
