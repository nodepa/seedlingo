<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import logoUrl from '@/assets/logo/logo.svg';
import BottomNavigationBar from '@/BottomNavigationBar/components/BottomNavigationBar.vue';
import GetInstruction from '@/Instruction/components/GetInstruction.vue';
import InstructionOverlay from '@/Instruction/components/InstructionOverlay.vue';

const route = useRoute();
const store = useStore();

const branch = ref(process.env.VUE_APP_BRANCH);
const jobId = ref(
  process.env.VUE_APP_JOB_ID
    ? (process.env.VUE_APP_JOB_ID as string).replace(/^0+/, '')
    : '',
);

const showGetInstructionGraphic = computed(
  () =>
    route.name?.toString() === 'Home' && store.state.showGetInstructionGraphic,
);

const isInstructionMode = computed(() => {
  return store.state.instructionStore.isInstructionMode;
});

interface Props {
  theme?: string;
}
const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
});
const theme = ref(props.theme);
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};
</script>

<template>
  <v-app data-test="app" :theme="theme">
    <v-app-bar app style="z-index: 5">
      <div class="d-flex align-center">
        <v-img
          alt="立爱种字 Logo"
          class="shrink mr-2 bg-primary rounded-pill"
          transition="scale-transition"
          :src="logoUrl"
          width="40"
          height="40"
          @click="toggleTheme"
        />
        <span class="shrink mt-1" min-width="100" width="100">立爱种字</span>
        <span
          class="caption text-white"
          v-if="branch && jobId && theme == 'dark'"
          >({{ branch }}/{{ jobId }})
        </span>
      </div>
    </v-app-bar>

    <v-main>
      <InstructionOverlay v-if="isInstructionMode" />
      <GetInstruction v-if="showGetInstructionGraphic" />
      <router-view v-if="!showGetInstructionGraphic" />
    </v-main>

    <BottomNavigationBar
      :home-button-disabled="showGetInstructionGraphic"
      style="z-index: 5"
    />
  </v-app>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  user-select: none;
  overflow-x: hidden;
}
a {
  text-decoration: none;
}
.v-icon__svg {
  width: inherit;
}
</style>
