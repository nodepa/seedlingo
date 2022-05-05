// Libraries, plugins, components
import { createRouter, createWebHistory } from '@ionic/vue-router';
import rootStore from '@/common/store/RootStore';
import { IonicVue, IonRouterOutlet } from '@ionic/vue';
import InstructionsBadge from '@/common/components/InstructionsBadge.vue';
import InstructionsDirective from '@/common/directives/InstructionsDirective';
import HomeView from '@/views/HomeView.vue';

// Helpers
import { mount } from '@vue/test-utils';
import { matchMedia, play } from './test-support/MockImplementations';
HTMLMediaElement.prototype.play = play;
window.matchMedia = matchMedia;

// Item under test
import App from './App.vue';
import AppHeader from '@/AppHeader/components/AppHeader.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
  ],
});

describe('App', () => {
  it('renders bottom nav bar', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          IonicVue,
          router,
          rootStore,
          [InstructionsDirective, { Badge: InstructionsBadge }],
        ],
      },
    });

    expect(wrapper.find('[data-test="bottom-navigation-bar"').exists()).toBe(
      true,
    );
  });

  it(
    'renders instructions explainer, ' +
      'then awaits user response, ' +
      'then renders router-view',
    async () => {
      const wrapper = mount(App, {
        global: {
          plugins: [
            IonicVue,
            router,
            rootStore,
            [InstructionsDirective, { Badge: InstructionsBadge }],
          ],
        },
      });

      expect(wrapper.findComponent(IonRouterOutlet).exists()).toBe(false);
      expect(
        wrapper.find('[data-test="instructions-explainer-component"]').exists(),
      ).toBe(true);

      await wrapper
        .find('[data-test="toggle-instructions-button"]')
        .trigger('click');

      expect(wrapper.findComponent(IonRouterOutlet).exists()).toBe(true);
      expect(
        wrapper.find('[data-test="instructions-explainer-component"]').exists(),
      ).toBe(false);
    },
  );

  it('shows jobId and branch when available', async () => {
    const branch = 'seedling-main-branch-value';
    const paddedId = '0000009999900';
    const trimmedId = paddedId.replace(/^0+/, '');
    process.env.VUE_APP_BRANCH = branch;
    process.env.VUE_APP_JOB_ID = paddedId;

    const wrapper = mount(App, {
      global: {
        plugins: [
          IonicVue,
          router,
          rootStore,
          [InstructionsDirective, { Badge: InstructionsBadge }],
        ],
      },
    });

    await wrapper.get('[data-test="toggle"]').trigger('click');
    expect(wrapper.get('[data-test="app"]').html()).toContain(branch);
    expect(wrapper.get('[data-test="app"]').html()).not.toContain(paddedId);
    expect(wrapper.get('[data-test="app"]').html()).toContain(trimmedId);
  });

  it('toggles light/dark theme', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          IonicVue,
          router,
          rootStore,
          [InstructionsDirective, { Badge: InstructionsBadge }],
        ],
      },
    });

    expect(wrapper.findComponent(AppHeader).vm.darkTheme).toBe(false);
    wrapper.get('[data-test="toggle"]').trigger('click');

    expect(wrapper.findComponent(AppHeader).vm.darkTheme).toBe(true);

    wrapper.findComponent(AppHeader).vm.toggleDarkTheme();

    expect(wrapper.findComponent(AppHeader).vm.darkTheme).toBe(false);
  });
});
