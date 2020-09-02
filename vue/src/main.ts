import Vue from 'vue';
import vuetify from './common/plugins/vuetify';
import router from './router';
import store from './store';
import './registerServiceWorker';
import App from './App.vue';
import InstructionDirective from './common/directives/InstructionDirective';

// Use custom directive v-instruction to add instructions audio
Vue.use(InstructionDirective);
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
const minDelay = process.env.NODE_ENV === 'production' ? 2000 : 100;
const delayMountAmount = Math.max(minDelay - timeSinceNavStart, 100);
setTimeout(() => vm.$mount('#app'), delayMountAmount);
