import { reactive } from 'vue';
import { IonicVue } from '@ionic/vue';
// Ionic's CSS files are intentionally NOT imported globally here.
// Only core.css was ever used, and the CSS custom properties it sets on :root
// (--ion-background-color, --ion-text-color, etc.) are only needed inside the
// exercise preview pane. They are defined locally on .exercise-host in
// editor/pages/units/[id].vue so that zero Ionic styles leak into the rest of
// the editor UI.

// The Vuex storeKey is the string "store". useStore() in the app components
// is literally inject("store"), so we can provide any object at that key
// without installing Vuex at all.
const STORE_KEY = 'store';

// Reactive state shared between the plugin (provider) and the unit detail
// page (consumer). Export it so the page can watch showContinueButton.
export const exerciseStore = reactive({
  showContinueButton: false,
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(IonicVue);

  // Provide a minimal store-shaped object so MultipleChoiceExercise.vue's
  // useStore().dispatch('setShowContinueButton', value) call works.
  nuxtApp.vueApp.provide(STORE_KEY, {
    dispatch(_action: string, value: unknown) {
      if (_action === 'setShowContinueButton') {
        exerciseStore.showContinueButton = value as boolean;
      }
    },
  });

  // v-instructions is an accessibility/onboarding directive used in the app.
  // Register it as a no-op so Vue doesn't warn about an unknown directive.
  nuxtApp.vueApp.directive('instructions', {});
});
