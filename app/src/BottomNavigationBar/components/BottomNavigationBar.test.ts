// Libraries, plugins, components
import { createRouter, createWebHistory } from '@ionic/vue-router';
import store from '@/common/store/RootStore';
import { IonicVue, IonApp } from '@ionic/vue';
import Badge from '@/common/components/Badge.vue';
import InstructionDirective from '@/common/directives/InstructionDirective';
import Home from '@/views/Home.vue';

// Helpers
import { mount, VueWrapper } from '@vue/test-utils';
import { animate, pause, play } from '@/test-support/MockImplementations';
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
        return {
          homeInstructionPath: 'home-instr',
          continueInstructionPath: 'continue-instr',
          instructionPath: 'instr',
          homeButtonDisabled,
          isInstructionMode: false,
          showInstructionExplainer: true,
        };
      },
      template: `
          <ion-app>
            <BottomNavigationBar
              :home-instruction-path="homeInstructionPath"
              :home-button-disabled="homeButtonDisabled"
              :home-button-focused="!isInstructionMode && !showInstructionExplainer"
              :continue-instruction-path="continueInstructionPath"
              :instruction-path="instructionPath"
              :show-instruction-explainer="showInstructionExplainer"
            />
          </ion-app>
        `,
      components: {
        IonApp,
        BottomNavigationBar,
      },
    },
    {
      global: {
        plugins: [IonicVue, router, store, [InstructionDirective, { Badge }]],
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
    });
    it('links to home', () => {
      expect(wrapper.findComponent(HomeButton).vm.$route.path).toBe('/');
    });
  });

  // // Elements have expected behaviour
  describe('toggle-instruction-button', () => {
    it('on first click: hides the "instruction explainer" graphic', async () => {
      expect(wrapper.vm.$store.state.showInstructionExplainer).toBe(true);
      await wrapper.find(toggleInstructionButton).trigger('click');
      expect(wrapper.vm.$store.state.showInstructionExplainer).toBe(false);
    });

    it('on first click: enables the home button', async () => {
      wrapper = mountFunction(
        { homeButtonDisabled: true },
        { unwrapped: false },
      );
      expect(wrapper.findComponent(HomeButton).vm.homeButtonDisabled).toBe(
        true,
      );

      // update the BottomNavigationBar-prop homeButtonDisabled
      await wrapper.setData({ homeButtonDisabled: false });

      expect(wrapper.findComponent(HomeButton).vm.homeButtonDisabled).toBe(
        false,
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
      expect(wrapper.vm.$store.state.showInstructionExplainer).toBe(true);
      expect(wrapper.vm.$store.state.instructionStore.isInstructionMode).toBe(
        false,
      );

      // first click
      await instructionButton.trigger('click');

      // current state
      expect(wrapper.vm.$store.state.showInstructionExplainer).toBe(false);
      expect(wrapper.vm.$store.state.instructionStore.isInstructionMode).toBe(
        true,
      );

      // second click
      await instructionButton.trigger('click');

      // current state
      expect(wrapper.vm.$store.state.showInstructionExplainer).toBe(false);
      expect(wrapper.vm.$store.state.instructionStore.isInstructionMode).toBe(
        false,
      );

      // third click
      await instructionButton.trigger('click');

      // current state
      expect(wrapper.vm.$store.state.showInstructionExplainer).toBe(false);
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
