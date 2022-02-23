<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { IonApp, IonContent, IonRouterOutlet } from '@ionic/vue';
import Header from '@/Header/components/Header.vue';
import BottomNavigationBar from '@/BottomNavigationBar/components/BottomNavigationBar.vue';
import InstructionExplainer from '@/Instruction/components/InstructionExplainer.vue';
import InstructionOverlay from '@/Instruction/components/InstructionOverlay.vue';
import ContentConfig from '@/Lessons/ContentSpec';

const route = useRoute();
const store = useStore();

const showInstructionExplainer = computed(
  () =>
    route.name?.toString() === 'Home' && store.state.showInstructionExplainer,
);

const isInstructionMode = computed(() => {
  return store.state.instructionStore.isInstructionMode;
});

const welcomeInstructionPath: ComputedRef<string> = computed(() => {
  return ContentConfig.getInstructionPathFor('welcome');
});

const homeInstructionPath: ComputedRef<string> = computed(() => {
  return ContentConfig.getInstructionPathFor('homeButton');
});

const continueInstructionPath: ComputedRef<string> = computed(() => {
  return ContentConfig.getInstructionPathFor('continueButton');
});

const instructionPath: ComputedRef<string> = computed(() => {
  return ContentConfig.getInstructionPathFor('instructionButton');
});
</script>

<template>
  <ion-app data-test="app">
    <Header />
    <ion-content>
      <InstructionExplainer
        v-if="showInstructionExplainer"
        :welcome-instruction-path="welcomeInstructionPath"
      />
      <ion-router-outlet v-else />
      <InstructionOverlay v-if="isInstructionMode" />
    </ion-content>
    <BottomNavigationBar
      :home-instruction-path="homeInstructionPath"
      :home-button-disabled="showInstructionExplainer"
      :home-button-focused="!isInstructionMode && !showInstructionExplainer"
      :continue-instruction-path="continueInstructionPath"
      :instruction-path="instructionPath"
      :show-instruction-explainer="showInstructionExplainer"
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
Below are stacking fixes for v-instruction directive:
https://developer.mozilla.org/en-US/docs/Web/CSS/contain
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
The CSS property `contain` creates a new stacking context
when `contain` has the value `layout` or `paint` (or `strict` or `content`).
The composite value `strict` -> `size layout paint`.
The composite value `content` -> `layout paint`
A child element in a new stacking context can not stack in front of a parent
element of the new stacking context regardless of how high the `z-index` value.
Ionic uses 'contain' extensively.  We need to reset 'contain' to allow the
v-instruction directive to force elements with instructions attached to pop
through/stack over the v-instruction backdrop/InstructionOverlay to display as
highlighted elements inviting interaction (vs elements that do not carry
instructions and do not pop through and therefore do not invite interaction)
Ionic's use of z-index on certain elements can also create a local stacking
context (see Mozilla's "The stacking context" ref above).
iOS Safari/WebKit also creates a new stacking context for
-webkit-overflow-scrolling.
*/
::part(scroll) {
  /*Ionic> -webkit-overflow-scrolling: touch; z-index: 0 */
  -webkit-overflow-scrolling: initial;
  z-index: auto;
}
ion-router-outlet {
  /*Ionic> contain: size layout style; z-index: 0 */
  contain: size style;
  z-index: auto;
}
.ion-page {
  /*Ionic> contain: layout size style; z-index: 100/101 */
  contain: size style;
  z-index: auto !important;
}
ion-list {
  /*Ionic> contain: content (-> layout paint) */
  contain: initial;
}
ion-item::part(native) {
  /*Ionic> z-index: 1 */
  z-index: auto;
}
</style>
