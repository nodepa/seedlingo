import { createApp } from 'vue';
import { IonicVue, isPlatform } from '@ionic/vue';
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import '@/common/styles/theme.scss';

import Badge from '@/common/components/InstructionsBadge.vue';
import InstructionsDirective from '@/common/directives/InstructionsDirective';
import App from '@/App.vue';
import router from '@/common/router';
import { createPlausible } from '@/common/plugins/PlausibleAnalytics';
import { useInstructionsMode } from '@/common/composables/useInstructionsMode';

const app = createApp(App);
const { isInstructionsMode, toggleInstructionsMode } = useInstructionsMode();
app.use(IonicVue);
app.use(router);
app.use(InstructionsDirective, {
  Badge,
  isInstructionsMode,
  toggleInstructionsMode,
});
app.use(
  createPlausible({
    init: {
      domain:
        __AWS_BRANCH__ === 'main' || isPlatform('capacitor')
          ? 'seedlingo.app'
          : 'test.seedlingo.app',
      trackLocalhost: true,
    },
    settings: {
      enableAutoPageviews: true,
      enableAutoOutboundTracking: true,
    },
  }),
);

if (import.meta.env.PROD) {
  // Make sure the splash screen is displayed for at least a minimum delay,
  // but expect general loading times, too,
  // which should count towards the total splash display time
  const timeSinceNavStart =
    Date.now() - (performance?.timing?.navigationStart || Infinity);
  const minDelay = 2000;
  const delayMountAmount = Math.max(minDelay - timeSinceNavStart, 0);
  const splashDelay = new Promise<void>((resolve) =>
    setTimeout(resolve, delayMountAmount),
  );
  Promise.all([router.isReady(), splashDelay]).then(() => app.mount('#app'));
} else {
  router.isReady().then(() => app.mount('#app'));
}
