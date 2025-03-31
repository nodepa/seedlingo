<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue';
import { IonHeader, IonImg, IonTitle, IonToolbar } from '@ionic/vue';
import logoUrl from '@/assets/logo/logo-col.svg';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const appInfo = ref();
if (Capacitor.isNativePlatform()) {
  CapacitorApp.getInfo().then((info) => (appInfo.value = info));
}
const appVersion = computed(() => {
  if (appInfo.value) {
    return `v${appInfo.value.version}_${appInfo.value.build}`;
  } else if (__APP_VERSION__) {
    let v = `v${__APP_VERSION__}`;
    if (__AWS_JOB_ID__) {
      v += `_${__AWS_JOB_ID__}`;
    }
    if (__AWS_BRANCH__) {
      v += ` (${__AWS_BRANCH__})`;
    }
    return v;
  } else {
    return 'NA';
  }
});

const darkTheme: Ref<boolean> = ref(false);
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    darkTheme.value = e.matches;
    document.body.classList.toggle('dark', darkTheme.value);
  });
onMounted(() => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toggleDarkTheme();
  }
});
const toggleDarkTheme = () => {
  darkTheme.value = !darkTheme.value;
  document.body.classList.toggle('dark', darkTheme.value);
};
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-img
        class="ion-float-start"
        data-test="toggle"
        alt="Seedlingo Logo"
        :src="logoUrl"
        @click="toggleDarkTheme"
      />
      <ion-title>
        Seedlingo
        <span
          v-if="appVersion && darkTheme"
          class="text-white"
          style="user-select: text"
        >
          {{ appVersion }}
        </span>
      </ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<style scoped>
ion-img {
  height: 2rem;
  width: 2rem;
  display: inline-block;
  vertical-align: bottom;
  margin: 0px 8px;
}
</style>
