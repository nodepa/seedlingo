<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
useHeadSafe({
  title: appConfig.title
})
useSeoMeta({
  title: appConfig.title,
  ogTitle: appConfig.title,
  description: 'Content editor for Seedlingo.',
  ogDescription: 'Content editor for Seedlingo.',
})
</script>