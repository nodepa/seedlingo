// Libraries, plugins, components
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/common/store/RootStore';
import Badge from '@/common/components/Badge.vue';
import InstructionDirective from '@/common/directives/InstructionDirective';
import Home from '@/views/Home.vue';

// Helpers
import { mount } from '@vue/test-utils';
import vuetify from '@/test-support/VuetifyInstance';
import { animate, play } from './test-support/Overrides';
window.Element.prototype.animate = animate;
HTMLMediaElement.prototype.play = play;

// Item under test
import App from './App.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
  ],
});

describe('App.vue', () => {
  it('renders bottom nav bar', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, store, vuetify, [InstructionDirective, { Badge }]],
        stubs: ['router-view'],
      },
    });

    expect(wrapper.find('[data-test="bottom-navigation-bar"').exists()).toBe(
      true,
    );
  });

  it(
    'renders instruction, ' +
      'then awaits user response, ' +
      'then renders router-view',
    async () => {
      const wrapper = mount(App, {
        global: {
          plugins: [router, store, vuetify, [InstructionDirective, { Badge }]],
          stubs: ['router-view'],
        },
      });

      expect(wrapper.find('router-view-stub').exists()).toBe(false);
      expect(
        wrapper.find('[data-test="get-instruction-component"]').exists(),
      ).toBe(true);

      await wrapper
        .find('[data-test="toggle-instruction-button"]')
        .trigger('click');

      expect(wrapper.find('router-view-stub').exists()).toBe(true);
      expect(
        wrapper.find('[data-test="get-instruction-component"]').exists(),
      ).toBe(false);
    },
  );

  it('shows jobId and branch when available', () => {
    const branch = 'seedling-main-branch-value';
    const paddedId = '0000009999900';
    const trimmedId = paddedId.replace(/^0+/, '');
    process.env.VUE_APP_BRANCH = branch;
    process.env.VUE_APP_JOB_ID = paddedId;

    const wrapper = mount(App, {
      global: {
        plugins: [router, store, vuetify, [InstructionDirective, { Badge }]],
        stubs: ['router-view'],
      },
      props: {
        theme: 'dark',
      },
    });

    expect(wrapper.get('[data-test="app"').html()).toContain(branch);
    expect(wrapper.get('[data-test="app"').html()).not.toContain(paddedId);
    expect(wrapper.get('[data-test="app"').html()).toContain(trimmedId);
  });
});
