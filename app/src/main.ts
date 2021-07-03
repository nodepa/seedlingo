import Vue from 'vue';
import Badge from '@/common/components/Badge.vue';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import vuetify from './common/plugins/vuetify';
import router from './router';
import store from './store';
import './registerServiceWorker';
import App from './App.vue';
import InstructionDirective from './common/directives/InstructionDirective';
import ContentConfig from './Lessons/ContentConfig';

// Use custom directive v-instruction to add instructions audio
Vue.use(InstructionDirective, {
  Badge,
  Animation: RippleAnimation,
});
Vue.config.productionTip = false;

const vm = new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
});

ContentConfig.getLessons().then(() => {
  // Delay mounting until min 2000 millis after page load initiation
  // Fallback to max if performance.timing.navigationStart undefined
  const timeSinceNavStart =
    Date.now() - (performance?.timing?.navigationStart || Infinity);
  const minDelay = process.env.NODE_ENV === 'production' ? 3000 : 2000;
  const delayMountAmount = Math.max(minDelay - timeSinceNavStart, 0);
  setTimeout(() => vm.$mount('#app'), delayMountAmount);
});
