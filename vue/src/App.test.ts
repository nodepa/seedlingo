// Libraries, plugins, components
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import store from '@/store';
import Badge from '@/common/components/Badge.vue';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import InstructionDirective from '@/common/directives/InstructionDirective';

// Helpers
import { createLocalVue, mount } from '@vue/test-utils';
import { animate } from '@/testHelpers/FunctionOverrides';

// Item under test
import App from '@/App.vue';

window.Element.prototype.animate = animate;

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
localVue.use(InstructionDirective, {
  Badge,
  Animation: RippleAnimation,
});
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
    },
  ],
});

describe('App.vue', () => {
  let vuetify: typeof Vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it(
    'renders instructions, ' +
      'then awaits user response, ' +
      'then renders router-view',
    async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        vuetify,
        stubs: ['router-view'],
        store,
      });

      // Initially, the get-instructions graphic is shown
      expect(
        wrapper.find('[data-test="get-instructions-component"]').exists(),
      ).toBe(true);
      // Then, the user clicks the toggle-instructions button
      await wrapper
        .find('[data-test="toggle-instructions-button"]')
        .trigger('click');
      // Then, the router view is shown
      expect(wrapper.find('router-view-stub').exists()).toBe(true);
    },
  );

  it('renders bottom nav bar', () => {
    const wrapper = mount(App, {
      localVue,
      router,
      vuetify,
      store,
    });

    expect(wrapper.find('.v-bottom-navigation').exists()).toBe(true);
  });
});
