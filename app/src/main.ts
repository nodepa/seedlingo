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
import store from '@/common/store/RootStore';
import { createPlausible } from '@/common/plugins/PlausibleAnalytics';

const app = createApp(App);
app.use(IonicVue);
app.use(store);
app.use(router);
app.use(InstructionsDirective, { Badge });
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
    const timeout = setTimeout(resolve, 8000);

    navigator.serviceWorker.addEventListener(
      'message',
      function handler(event: MessageEvent) {
        if (
          event.data &&
          event.data.type === 'CACHE_PROGRESS' &&
          event.data.loaded >= event.data.total
        ) {
          clearTimeout(timeout);
          navigator.serviceWorker.removeEventListener('message', handler);
          resolve();
        }
      },
    );
  });
}

Promise.all([router.isReady(), waitForAssets()]).then(() => app.mount('#app'));
