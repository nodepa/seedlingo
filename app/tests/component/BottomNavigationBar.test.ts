// Libraries, plugins, components
import { ref } from 'vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonApp } from '@ionic/vue';
import InstructionsBadge from '@/common/components/InstructionsBadge.vue';
import InstructionsDirective from '@/common/directives/InstructionsDirective';
import HomeView from '@/views/HomeView.vue';
import { useInstructionsMode } from '@/common/composables/useInstructionsMode';
import { useContinueButton } from '@/common/composables/useContinueButton';

// Helpers
import { beforeEach, describe, expect, it } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { animate, pause, play } from '@/test-support/MockImplementations';
window.Element.prototype.animate = animate;
window.HTMLMediaElement.prototype.pause = pause;
window.HTMLMediaElement.prototype.play = play;

// Item under test
import BottomNavigationBar from '@/BottomNavigationBar/components/BottomNavigationBar.vue';
import HomeButton from '@/BottomNavigationBar/components/HomeButton.vue';

// Local standalone state for the directive — separate from composable refs used for assertions
const directiveIsInstructionsMode = ref(false);
const directiveToggleInstructionsMode = () => {
  directiveIsInstructionsMode.value = !directiveIsInstructionsMode.value;
};

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

const homeButton = '[data-test="home-button"]';
const continueButton = '[data-test="continue-button"]';
const toggleInstructionsButton = '[data-test="toggle-instructions-button"]';
const toggleInstructionsOnIcon = '[data-test="toggle-instructions-on-icon"]';
const toggleInstructionsOffIcon = '[data-test="toggle-instructions-off-icon"]';

function mountFunction(
  options: { homeButtonDisabled: boolean } = { homeButtonDisabled: true },
  returnAs: { unwrapped: boolean } = { unwrapped: true },
) {
  const { homeButtonDisabled } = options;

  const wrapper = mount(
    {
      data() {
        return {
          homeButtonDisabled,
          homeButtonInstructions: 'home-instr',
          continueButtonInstructions: 'continue-instr',
          toggleInstructionsButtonInstructions: 'toggle-instr',
          isInstructionsMode: false,
          showInstructionsExplainer: true,
        };
      },
      template: `
          <ion-app>
            <BottomNavigationBar
              :home-button-disabled="homeButtonDisabled"
              :home-button-focused="!isInstructionsMode && !showInstructionsExplainer"
              :home-button-instructions="homeButtonInstructions"
              :continue-button-instructions="continueButtonInstructions"
              :toggle-instructions-button-instructions="toggleInstructionsButtonInstructions"
              :show-instructions-explainer="showInstructionsExplainer"
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
        plugins: [
          IonicVue,
          router,
          [
            InstructionsDirective,
            {
              Badge: InstructionsBadge,
              isInstructionsMode: directiveIsInstructionsMode,
              toggleInstructionsMode: directiveToggleInstructionsMode,
            },
          ],
        ],
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
  const {
    resetInstructionsMode,
    isInstructionsMode,
    showInstructionsExplainer,
  } = useInstructionsMode();
  const { showContinueButton } = useContinueButton();

  beforeEach(() => {
    localStorage.clear();
    directiveIsInstructionsMode.value = false;
    resetInstructionsMode();
    showContinueButton.value = false;
    wrapper = mountFunction();
  });

  // Component has expected elements
  describe('initial state', () => {
    it('renders a go home button and a toggle instructions button', () => {
      expect(wrapper.find(homeButton).exists()).toBe(true);
      expect(wrapper.find(continueButton).exists()).toBe(false);
      expect(wrapper.find(toggleInstructionsButton).exists()).toBe(true);
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
      expect(router.currentRoute.value.path).toBe('/');
    });
  });

  // // Elements have expected behaviour
  describe('toggle-instructions-button', () => {
    it('on first click: hides the "instructions explainer" graphic', async () => {
      expect(showInstructionsExplainer.value).toBe(true);
      await wrapper.find(toggleInstructionsButton).trigger('click');
      expect(showInstructionsExplainer.value).toBe(false);
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

    it('on first click: toggles on instructions mode', async () => {
      expect(isInstructionsMode.value).toBe(false);
      expect(
        wrapper
          .find(toggleInstructionsButton)
          .find(toggleInstructionsOnIcon)
          .exists(),
      ).toBe(true);
      expect(
        wrapper
          .find(toggleInstructionsButton)
          .find(toggleInstructionsOffIcon)
          .exists(),
      ).toBe(false);

      await wrapper.find(toggleInstructionsButton).trigger('click');

      expect(isInstructionsMode.value).toBe(true);
      expect(
        wrapper
          .find(toggleInstructionsButton)
          .find(toggleInstructionsOnIcon)
          .exists(),
      ).toBe(false);
      expect(
        wrapper
          .find(toggleInstructionsButton)
          .find(toggleInstructionsOffIcon)
          .exists(),
      ).toBe(true);
    });

    it('toggles the instructions mode on multiple clicks', async () => {
      // initial state
      expect(showInstructionsExplainer.value).toBe(true);
      expect(isInstructionsMode.value).toBe(false);

      // first click
      await wrapper.find(toggleInstructionsButton).trigger('click');

      // current state
      expect(showInstructionsExplainer.value).toBe(false);
      expect(isInstructionsMode.value).toBe(true);

      // second click
      await wrapper.find(toggleInstructionsButton).trigger('click');

      // current state
      expect(showInstructionsExplainer.value).toBe(false);
      expect(isInstructionsMode.value).toBe(false);

      // third click
      await wrapper.find(toggleInstructionsButton).trigger('click');

      // current state
      expect(showInstructionsExplainer.value).toBe(false);
      expect(isInstructionsMode.value).toBe(true);
    });
  });

  describe('continue-button', () => {
    it('on click: hides itself and toggles state', async () => {
      expect(showContinueButton.value).toBe(false);
      showContinueButton.value = true;
      await wrapper.vm.$nextTick();
      expect(showContinueButton.value).toBe(true);
      await wrapper.find(continueButton).trigger('click');
      expect(showContinueButton.value).toBe(false);
    });
  });
});
