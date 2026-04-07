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
      captureOnLocalhost: true,
      autoCapturePageviews: false,
      outboundLinks: true,
    },
    settings: {
      enableAutoPageviews: true,
    },
  }),
);

function waitForAssets(): Promise<void> {
  // In non-prod or without SW support, resolve immediately
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    return Promise.resolve();
  }

  // If the SW already controls this page, assets are cached from a prior run
  if (navigator.serviceWorker.controller) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    // 30s timeout — long enough for slow connections to finish pre-caching
    const timeout = setTimeout(resolve, 30_000);

    // BroadcastChannel works during the SW install phase even before the SW
    // controls this page (unlike navigator.serviceWorker.addEventListener('message')).
    const bc = new BroadcastChannel('sw-cache-progress');
    bc.addEventListener('message', function handler(event: MessageEvent) {
      if (
        event.data &&
        event.data.type === 'CACHE_PROGRESS' &&
        event.data.loaded >= event.data.total
      ) {
        clearTimeout(timeout);
        bc.removeEventListener('message', handler);
        bc.close();
        resolve();
      }
    });
  });
}

Promise.all([router.isReady(), waitForAssets()]).then(() => app.mount('#app'));
