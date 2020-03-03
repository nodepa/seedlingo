import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

const vm = new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
});

// Delay mounting until min 2000 millis after page load initiation
// Fallback to max if performance.timing.navigationStart undefined
const timeSinceNavStart =
  Date.now() - (performance?.timing?.navigationStart || Infinity);
const minDelay = process.env.NODE_ENV === 'production' ? 2000 : 0;
const delayMountAmount = Math.max(minDelay - timeSinceNavStart, 0);
setTimeout(() => vm.$mount('#app'), delayMountAmount);
