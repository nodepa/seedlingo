// Libraries, plugins, components
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import store from '@/store';
import Badge from '@/common/components/Badge.vue';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import InstructionDirective from '@/common/directives/InstructionDirective';

// Helpers
import { animate, pause, play } from '@/test-support/FunctionOverrides';

// Item under test
import BottomNavigationBar from './BottomNavigationBar.vue';

window.Element.prototype.animate = animate;
window.HTMLMediaElement.prototype.pause = pause;
window.HTMLMediaElement.prototype.play = play;

Vue.use(Vuetify);

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

const homeButton = '[data-test="home-button"]';
const toggleInstructionsButton = '[data-test="toggle-instructions-button"]';
const instructionsIcon = '[data-test="instructions-icon"]';
const instructionsCloseIcon = '[data-test="instructions-close-icon"]';
const bottomNavigationBar = '[data-test="bottom-navigation-bar"]';

describe('BottomNavigationBar.vue (deep)', () => {
  let wrapper: Wrapper<Vue>;
  let vuetify: Vuetify;

  beforeEach(() => {
    store.dispatch('instructionsStore/resetState');
    vuetify = new Vuetify();
    wrapper = mount(BottomNavigationBar, {
      localVue,
      router,
      vuetify,
      store,
      propsData: {
        initiateHomeButtonDisabled: true,
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  // Component has expected elements
  describe('initial state', () => {
    it('is a Vue instance', () => {
      expect(wrapper.isVueInstance).toBeTruthy();
    });

    it('renders a go home button and a toggle instructions button', () => {
      expect(wrapper.find(homeButton).exists()).toBe(true);
      expect(wrapper.find(toggleInstructionsButton).exists()).toBe(true);
    });
  });

  // Elements have initial states
  describe('home-button', () => {
    it('is disabled on first load', () => {
      expect(
        wrapper.find(bottomNavigationBar).props().initiateHomeButtonDisabled,
      ).toBe(true);
      expect(
        wrapper.find(bottomNavigationBar).vm.$data.homeButtonDisabled,
      ).toBe(true);
      expect(wrapper.find(homeButton).props().homeButtonDisabled).toBe(true);
      expect(
        wrapper.find(homeButton).element.classList.contains('v-btn--disabled'),
      ).toBe(true);
    });
    it('links to home', () => {
      expect(wrapper.find(homeButton).vm.$route.path).toBe('/');
    });
  });

  // Elements have expected behaviour
  describe('toggle-instructions-button', () => {
    it('on first click: hides the "get instructions" graphic', () => {
      expect(
        wrapper.vm.$store.state.instructionsStore.showGetInstructionsGraphic,
      ).toBe(true);
      wrapper.find(toggleInstructionsButton).trigger('click');
      expect(
        wrapper.vm.$store.state.instructionsStore.showGetInstructionsGraphic,
      ).toBe(false);
    });

    it('on first click: enables the home button', async () => {
      expect(wrapper.vm.$data.homeButtonDisabled).toBe(true);
      await wrapper.find(toggleInstructionsButton).trigger('click');
      expect(wrapper.vm.$data.homeButtonDisabled).toBe(false);
    });

    it('on first click: toggles on instructions mode', async () => {
      await wrapper.find(toggleInstructionsButton).trigger('click');
      expect(
        wrapper
          .find(toggleInstructionsButton)
          .find(instructionsCloseIcon)
          .exists(),
      ).toBe(true);
      expect(
        wrapper.find(toggleInstructionsButton).find(instructionsIcon).exists(),
      ).toBe(false);
      expect(wrapper.vm.$store.state.instructionsStore.isInstructionsMode).toBe(
        true,
      );
    });

    it('toggles the instructions overlay on multiple clicks', () => {
      const instructionsButton = wrapper.find(toggleInstructionsButton);

      // initial state
      expect(wrapper.vm.$data.homeButtonDisabled).toBe(true);
      expect(
        wrapper.vm.$store.state.instructionsStore.showGetInstructionsGraphic,
      ).toBe(true);
      expect(wrapper.vm.$store.state.instructionsStore.isInstructionsMode).toBe(
        false,
      );
      expect(instructionsButton.emitted('update:homeButtonDisabled')).toBe(
        undefined,
      );

      // first click
      instructionsButton.trigger('click');

      // current state
      expect(wrapper.vm.$data.homeButtonDisabled).toBe(false);
      expect(
        wrapper.vm.$store.state.instructionsStore.showGetInstructionsGraphic,
      ).toBe(false);
      expect(wrapper.vm.$store.state.instructionsStore.isInstructionsMode).toBe(
        true,
      );
      expect(
        instructionsButton.emitted('update:homeButtonDisabled')?.length,
      ).toBe(1);

      // second click
      instructionsButton.trigger('click');

      // current state
      expect(wrapper.vm.$data.homeButtonDisabled).toBe(false);
      expect(
        wrapper.vm.$store.state.instructionsStore.showGetInstructionsGraphic,
      ).toBe(false);
      expect(wrapper.vm.$store.state.instructionsStore.isInstructionsMode).toBe(
        false,
      );
      expect(
        instructionsButton.emitted('update:homeButtonDisabled')?.length,
      ).toBe(2);

      // third click
      instructionsButton.trigger('click');

      // current state
      expect(wrapper.vm.$data.homeButtonDisabled).toBe(false);
      expect(
        wrapper.vm.$store.state.instructionsStore.showGetInstructionsGraphic,
      ).toBe(false);
      expect(wrapper.vm.$store.state.instructionsStore.isInstructionsMode).toBe(
        true,
      );
      expect(
        instructionsButton.emitted('update:homeButtonDisabled')?.length,
      ).toBe(3);
    });
  });

  describe('continue-button', () => {
    it('on click: hides itself and toggles state', async () => {
      expect(wrapper.vm.$store.state.showContinueButton).toBe(false);
      await wrapper.vm.$store.commit('showContinueButton', true);
      expect(wrapper.vm.$store.state.showContinueButton).toBe(true);
      const continueButton = '[data-test="continue-button"]';
      wrapper.find(continueButton).trigger('click');
      expect(wrapper.vm.$store.state.showContinueButton).toBe(false);
    });
  });
});
