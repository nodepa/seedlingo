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
          ? 'en.seedlingo.app'
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
  const timeSinceNavStart =
    Date.now() - (performance?.timing?.navigationStart || Infinity);
  const minDelay = 2000;
  const delayMountAmount = Math.max(minDelay - timeSinceNavStart, 0);
  setTimeout(() => app.mount('#app'), delayMountAmount);
} else {
  router.isReady().then(() => app.mount('#app'));
}
