<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { IonApp, IonContent, IonRouterOutlet } from '@ionic/vue';

import AppHeader from '@/AppHeader/components/AppHeader.vue';
import BottomNavigationBar from '@/BottomNavigationBar/components/BottomNavigationBar.vue';
import InstructionsExplainer from '@/Instructions/components/InstructionsExplainer.vue';
import InstructionsOverlay from '@/Instructions/components/InstructionsOverlay.vue';
import Content from '@/Content/Content';

const route = useRoute();
const store = useStore();

const showInstructionsExplainer = computed(
  () =>
    route.name?.toString() === 'Home' && store.state.showInstructionsExplainer,
);

const isInstructionsMode = computed(() => {
  return store.state.instructionsModeStore.isInstructionsMode;
});

const welcomeInstructions: ComputedRef<string> = computed(() => {
  return Content.getInstructionsAudio('welcome');
});

const homeButtonInstructions: ComputedRef<string> = computed(() => {
  return Content.getInstructionsAudio('homeButton');
});

const continueButtonInstructions: ComputedRef<string> = computed(() => {
  return Content.getInstructionsAudio('continueButton');
});

const toggleInstructionsButtonInstructions: ComputedRef<string> = computed(
  () => {
    return Content.getInstructionsAudio('toggleInstructionsButton');
  },
);
</script>

<template>
  <ion-app data-test="app">
    <AppHeader />
    <ion-content :force-overscroll="false">
      <InstructionsExplainer
        v-if="showInstructionsExplainer"
        :welcome-instructions-path="welcomeInstructions"
      />
      <ion-router-outlet v-else />
      <InstructionsOverlay v-if="isInstructionsMode" />
    </ion-content>
    <BottomNavigationBar
      :home-button-instructions="homeButtonInstructions"
      :home-button-disabled="showInstructionsExplainer"
      :home-button-focused="!isInstructionsMode && !showInstructionsExplainer"
      :continue-button-instructions="continueButtonInstructions"
      :toggle-instructions-button-instructions="
        toggleInstructionsButtonInstructions
      "
      :show-instructions-explainer="showInstructionsExplainer"
    />
  </ion-app>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  user-select: none;
}
a {
  text-decoration: none;
}

/*
Below are stacking fixes for v-instructions directive:
https://developer.mozilla.org/en-US/docs/Web/CSS/contain
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
The CSS property `contain` creates a new stacking context
when `contain` has the value `layout` or `paint` (or `content` or `strict`).
The composite value `content` -> `layout paint`
The composite value `strict` -> `layout paint size`.
A child element in a new stacking context can not stack in front of a parent
element of the new stacking context regardless of how high the `z-index` value.
Ionic uses 'contain' extensively.  We need to reset 'contain' to allow the
v-instructions directive to force elements with instructions attached to pop
through/stack over the v-instructions backdrop/InstructionsOverlay to display as
highlighted elements inviting interaction (vs elements that do not carry
instructions and do not pop through and therefore do not invite interaction)
Ionic's use of z-index on certain elements can also create a local stacking
context (see Mozilla's "The stacking context" ref above).
iOS Safari/WebKit also creates a new stacking context for
-webkit-overflow-scrolling.
*/
::part(scroll) {
  /* Ionic> -webkit-overflow-scrolling: touch; z-index: 0 */
  -webkit-overflow-scrolling: initial;
  z-index: auto;
}
ion-router-outlet {
  /* Ionic> contain: size layout style; z-index: 0 */
  contain: size style;
  z-index: auto;
}
.ion-page {
  /* Ionic> contain: layout size style; z-index: 100/101 */
  contain: size style;
  z-index: auto !important;
}
ion-list {
  /* Ionic> contain: content (-> layout paint) */
  contain: initial;
}
ion-item::part(native) {
  /* Ionic> z-index: 1 */
  z-index: auto;
}
ion-card {
  /* Ionic> transform: translateZ(0px) */
  contain: none;
  transform: inherit;
}

/* Global Styles */
ion-grid {
  --ion-grid-column-padding: 8px;
}
</style>
