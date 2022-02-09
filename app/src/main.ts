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
import router from '@/common/router';
import store from '@/common/store/RootStore';
import vuetify from '@/common/plugins/vuetify';

import Badge from './common/components/Badge.vue';
import InstructionDirective from './common/directives/InstructionDirective';
import App from './App.vue';

const app = createApp(App);
app.use(store);
app.use(router);
app.use(vuetify);
app.use(InstructionDirective, { Badge });

if (process.env.NODE_ENV === 'production') {
  const timeSinceNavStart =
    Date.now() - (performance?.timing?.navigationStart || Infinity);
  const minDelay = 2000;
  const delayMountAmount = Math.max(minDelay - timeSinceNavStart, 0);
  setTimeout(() => app.mount('#app'), delayMountAmount);
} else {
  app.mount('#app');
}
