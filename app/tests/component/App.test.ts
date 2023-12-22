// Libraries, plugins, components
import rootStore from '@/common/store/RootStore';
import { IonicVue, IonRouterOutlet } from '@ionic/vue';
import InstructionsBadge from '@/common/components/InstructionsBadge.vue';
import InstructionsDirective from '@/common/directives/InstructionsDirective';

// Helpers
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { matchMedia, play } from '@/test-support/MockImplementations';
HTMLMediaElement.prototype.play = play;
window.matchMedia = matchMedia;

// Item under test
import App from '@/App.vue';
import AppHeader from '@/AppHeader/components/AppHeader.vue';

// Mock useRoute() used in App.vue
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    name: 'Home',
  })),
}));

/* eslint-disable @typescript-eslint/no-explicit-any */
let wrapper: VueWrapper<any>;
describe('App', () => {
  beforeEach(async () => {
    wrapper = mount(App, {
      global: {
        plugins: [
          IonicVue,
          rootStore,
          [InstructionsDirective, { Badge: InstructionsBadge }],
        ],
        stubs: ['IonRouterOutlet'],
      },
    });
  });

  it('renders bottom nav bar', () => {
    expect(wrapper.find('[data-test="bottom-navigation-bar"]').exists()).toBe(
      true,
    );
  });

  it(
    'renders instructions explainer, ' +
      'then awaits user response, ' +
      'then renders router-view',
    async () => {
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
    const branch = 'seedlingo-main-branch-value';
    const paddedId = '0000009999900';
    const trimmedId = paddedId.replace(/^0+/, '');

    (window as any).__AWS_BRANCH__ = branch;
    (window as any).__AWS_JOB_ID__ = trimmedId;

    wrapper = mount(App, {
      global: {
        plugins: [
          IonicVue,
          rootStore,
          [InstructionsDirective, { Badge: InstructionsBadge }],
        ],
        stubs: ['IonRouterOutlet'],
      },
    });

    await wrapper.get('[data-test="toggle"]').trigger('click');
    expect(wrapper.get('[data-test="app"]').html()).toContain(branch);
    expect(wrapper.get('[data-test="app"]').html()).not.toContain(paddedId);
    expect(wrapper.get('[data-test="app"]').html()).toContain(trimmedId);
  });

  it('toggles light/dark theme', async () => {
    expect((wrapper.findComponent(AppHeader).vm as any).darkTheme).toBe(false);
    await wrapper.get('[data-test="toggle"]').trigger('click');

    expect((wrapper.findComponent(AppHeader).vm as any).darkTheme).toBe(true);

    (wrapper.findComponent(AppHeader).vm as any).toggleDarkTheme();

    expect((wrapper.findComponent(AppHeader).vm as any).darkTheme).toBe(false);
  });
});
