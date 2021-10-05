<script setup lang="ts">
import logoUrl from '@/assets/logo/logo-col.svg';
</script>

<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col cols="10">
        <v-img
          class="mx-auto"
          alt="立爱种字 Logo"
          :src="logoUrl"
          width="10rem"
          height="10rem"
        />
        <h1>立爱种字</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="10" class="text-left">
        <p>
          立爱种字 is a literacy education tool that was originally developed by
          idea of - and for the benefit of -
          <a href="https://liaieducation.com">Li Ai Education</a>
          as part of a research project aiming to empower rural citizens.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
svg {
  max-width: 50vmin;
}
</style>
