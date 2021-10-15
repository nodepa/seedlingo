// Libraries, plugins, components
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/common/store/RootStore';
import Badge from '@/common/components/Badge.vue';
import InstructionDirective from '@/common/directives/InstructionDirective';
import Home from '@/views/Home.vue';

// Helpers
import { mount, VueWrapper } from '@vue/test-utils';
import vuetify from '@/test-support/VuetifyInstance';
import { animate, pause, play } from '@/test-support/Overrides';
window.Element.prototype.animate = animate;
window.HTMLMediaElement.prototype.pause = pause;
window.HTMLMediaElement.prototype.play = play;

// Item under test
import BottomNavigationBar from './BottomNavigationBar.vue';
import HomeButton from './HomeButton.vue';

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

const homeButton = '[data-test="home-button"]';
const continueButton = '[data-test="continue-button"]';
const toggleInstructionButton = '[data-test="toggle-instruction-button"]';
const instructionIcon = '[data-test="instruction-icon"]';
const instructionCloseIcon = '[data-test="instruction-close-icon"]';

function mountFunction(
  options: { homeButtonDisabled: boolean } = { homeButtonDisabled: true },
  returnAs: { unwrapped: boolean } = { unwrapped: true },
) {
  const { homeButtonDisabled } = options;

  const wrapper = mount(
    {
      data() {
        return { homeButtonDisabled };
      },
      template: `
          <VLayout>
            <BottomNavigationBar :home-button-disabled=homeButtonDisabled />
          </VLayout>
        `,
      components: {
        BottomNavigationBar,
      },
    },
    {
      global: {
        plugins: [router, store, vuetify, [InstructionDirective, { Badge }]],
      },
    },
  );

  if (returnAs.unwrapped) {
    return wrapper.findComponent(BottomNavigationBar);
  } else {
    return wrapper;
  }
}

describe('BottomNavigationBar.vue', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    store.dispatch('resetState');
    wrapper = mountFunction();
  });

  // Component has expected elements
  describe('initial state', () => {
    it('renders a go home button and a toggle instruction button', () => {
      expect(wrapper.find(homeButton).exists()).toBe(true);
      expect(wrapper.find(continueButton).exists()).toBe(false);
      expect(wrapper.find(toggleInstructionButton).exists()).toBe(true);
    });
  });

  // Elements have initial states
  describe('home-button', () => {
    it('is disabled on first load', () => {
      expect(wrapper.vm.homeButtonDisabled).toBe(true);
      expect(wrapper.findComponent(HomeButton).vm.homeButtonDisabled).toBe(
        true,
      );
      expect(
        wrapper.find(homeButton).element.classList.contains('v-btn--disabled'),
      ).toBe(true);
    });
    it('links to home', () => {
      expect(wrapper.findComponent(HomeButton).vm.$route.path).toBe('/');
    });
  });

  // // Elements have expected behaviour
  describe('toggle-instruction-button', () => {
    it('on first click: hides the "get instruction" graphic', async () => {
      expect(wrapper.vm.$store.state.showGetInstructionGraphic).toBe(true);
      await wrapper.find(toggleInstructionButton).trigger('click');
      expect(wrapper.vm.$store.state.showGetInstructionGraphic).toBe(false);
    });

    it('on first click: enables the home button', async () => {
      wrapper = mountFunction(
        { homeButtonDisabled: true },
        { unwrapped: false },
      );
      expect(wrapper.findComponent(HomeButton).vm.homeButtonDisabled).toBe(
        true,
      );
      expect(wrapper.find(homeButton).element.classList).toContain(
        'v-btn--disabled',
      );

      // update the BottomNavigationBar-prop homeButtonDisabled
      await wrapper.setData({ homeButtonDisabled: false });

      expect(wrapper.findComponent(HomeButton).vm.homeButtonDisabled).toBe(
        false,
      );
      expect(wrapper.find(homeButton).element.classList).not.toContain(
        'v-btn--disabled',
      );
    });

    it('on first click: toggles on instruction mode', async () => {
      expect(wrapper.vm.$store.state.instructionStore.isInstructionMode).toBe(
        false,
      );
      expect(
        wrapper.find(toggleInstructionButton).find(instructionIcon).exists(),
      ).toBe(true);
      expect(
        wrapper
          .find(toggleInstructionButton)
          .find(instructionCloseIcon)
          .exists(),
      ).toBe(false);

      await wrapper.find(toggleInstructionButton).trigger('click');

      expect(wrapper.vm.$store.state.instructionStore.isInstructionMode).toBe(
        true,
      );
      expect(
        wrapper.find(toggleInstructionButton).find(instructionIcon).exists(),
      ).toBe(false);
      expect(
        wrapper
          .find(toggleInstructionButton)
          .find(instructionCloseIcon)
          .exists(),
      ).toBe(true);
    });

    it('toggles the instruction overlay on multiple clicks', async () => {
      const instructionButton = wrapper.find(toggleInstructionButton);

      // initial state
      expect(wrapper.vm.$store.state.showGetInstructionGraphic).toBe(true);
      expect(wrapper.vm.$store.state.instructionStore.isInstructionMode).toBe(
        false,
      );

      // first click
      await instructionButton.trigger('click');

      // current state
      expect(wrapper.vm.$store.state.showGetInstructionGraphic).toBe(false);
      expect(wrapper.vm.$store.state.instructionStore.isInstructionMode).toBe(
        true,
      );

      // second click
      await instructionButton.trigger('click');

      // current state
      expect(wrapper.vm.$store.state.showGetInstructionGraphic).toBe(false);
      expect(wrapper.vm.$store.state.instructionStore.isInstructionMode).toBe(
        false,
      );

      // third click
      await instructionButton.trigger('click');

      // current state
      expect(wrapper.vm.$store.state.showGetInstructionGraphic).toBe(false);
      expect(wrapper.vm.$store.state.instructionStore.isInstructionMode).toBe(
        true,
      );
    });
  });

  describe('continue-button', () => {
    it('on click: hides itself and toggles state', async () => {
      expect(wrapper.vm.$store.state.showContinueButton).toBe(false);
      await wrapper.vm.$store.dispatch('setShowContinueButton', true);
      expect(wrapper.vm.$store.state.showContinueButton).toBe(true);
      await wrapper.find(continueButton).trigger('click');
      expect(wrapper.vm.$store.state.showContinueButton).toBe(false);
    });
  });
});
