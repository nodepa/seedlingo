import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';

import App from '@/App.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

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
    });

    expect(wrapper.find('.v-bottom-navigation').exists()).toBe(true);
  });
});
