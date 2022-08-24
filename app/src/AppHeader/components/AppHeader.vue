<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { IonHeader, IonImg, IonTitle, IonToolbar } from '@ionic/vue';
import logoUrl from '../../assets/logo/logo.svg';

const branch = __AWS_BRANCH__ || '';
const jobId = __AWS_JOB_ID__ ? __AWS_JOB_ID__.replace(/^0+/, '') : '';

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
        alt="立爱种字 Logo"
        :src="logoUrl"
        @click="toggleDarkTheme"
      />
      <ion-title>
        立爱种字<span
          v-if="branch && jobId && darkTheme"
          class="text-white"
          style="user-select: text"
          >({{ jobId }}@{{ branch }})
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
  background-color: var(--ion-color-primary);
  border-radius: 50%;
}
</style>
