<template>
  <section class="w-[60%]">
    <UCard>
      <template #header>
        <div class="h-8 bg-slate-800" />
      </template>
      <div class="h-32 bg-slate-800" />
      <template #footer>
        <div class="h-8 bg-slate-800" />
      </template>
    </UCard>
    <h1 class="">Hi there</h1>
    <p>Welcome to Seedlingo Apiary, the content editor for Seedlingo</p>
  </section>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<style />