import { isPlatform } from '@ionic/vue';
if (isPlatform('capacitor')) {
  // eslint-disable-next-line no-console
  console.log('Capacitor - native wrapped webview');
} else {
  // eslint-disable-next-line no-console
  console.log('Webapp/PWA - standalone browser');
  import('@/registerServiceWorker');
}

import { createApp } from 'vue';

import { IonicVue } from '@ionic/vue';
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

import Badge from './common/components/Badge.vue';
import InstructionDirective from './common/directives/InstructionDirective';
import App from './App.vue';
import router from '@/common/router';
import store from '@/common/store/RootStore';

const app = createApp(App);
app.use(IonicVue);
app.use(store);
app.use(router);
app.use(InstructionDirective, { Badge });

if (process.env.NODE_ENV === 'production') {
  const timeSinceNavStart =
    Date.now() - (performance?.timing?.navigationStart || Infinity);
  const minDelay = 2000;
  const delayMountAmount = Math.max(minDelay - timeSinceNavStart, 0);
  setTimeout(() => app.mount('#app'), delayMountAmount);
} else {
  router.isReady().then(() => app.mount('#app'));
}
