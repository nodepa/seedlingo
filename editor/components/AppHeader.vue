<template>
  <section class="flex text-nowrap items-center">
    <UIcon class="block w-5 h-5 mr-2 align-top" name="i-mdi-beehive-outline" />
    <span>Seedlingo Apiary</span>
    <UHorizontalNavigation class="mb-5" :links="links" />
  </section>
</template>

<script setup lang="ts">
const links = [
  {
    label: 'Home',
    icon: 'i-mdi-home',
    to: '/'
  }, {
    label: 'Here',
    icon: 'i-mdi-home-circle',
    to: '/'
  }, {
    label: 'Origin',
    icon: 'i-mdi-home-account',
    to: '/'
  },
]
</script>