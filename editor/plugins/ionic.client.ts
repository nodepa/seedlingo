import { IonicVue } from '@ionic/vue';
// Ionic's CSS files are intentionally NOT imported globally here.
// Only core.css was ever used, and the CSS custom properties it sets on :root
// (--ion-background-color, --ion-text-color, etc.) are only needed inside the
// exercise preview pane. They are defined locally on .exercise-host in
// editor/pages/units/[id].vue so that zero Ionic styles leak into the rest of
// the editor UI.

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(IonicVue);

  // v-instructions is an accessibility/onboarding directive used in the app.
  // Register it as a no-op so Vue doesn't warn about an unknown directive.
  nuxtApp.vueApp.directive('instructions', {});
});
