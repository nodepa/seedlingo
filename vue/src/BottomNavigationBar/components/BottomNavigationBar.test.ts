import Vue from 'vue';
import { createLocalVue, Wrapper, mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import store from '@/store';
import InstructionDirective from '@/common/directives/InstructionDirective';

import BottomNavigationBar from './BottomNavigationBar.vue';

window.HTMLMediaElement.prototype.play = (): Promise<void> => {
  return new Promise(() => {
    /* do nothing */
  });
};
window.HTMLMediaElement.prototype.pause = (): void => {
  /* do nothing */
};

Vue.use(Vuetify);

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
localVue.use(InstructionDirective);
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

describe('BottomNavigationBar.vue (deep)', () => {
  let vuetify: typeof Vuetify;
  let wrapper: Wrapper<Vue>;

  beforeEach(() => {
    store.dispatch('instructionsStore/resetState');
    vuetify = new Vuetify();
    wrapper = mount(BottomNavigationBar, {
      localVue,
      router,
      vuetify,
      propsData: {
        showGetInstructionsGraphic: true,
      },
      store,
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
      expect(wrapper.find(homeButton).props().isHomeButtonDisabled).toBe(true);
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
      wrapper.find(toggleInstructionsButton).trigger('click');
      expect(
        wrapper.emitted('update:showGetInstructionsGraphic'),
      ).toStrictEqual([[false]]);
    });

    it('on first click: enables the home button', () => {
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(true);
      wrapper.find(toggleInstructionsButton).trigger('click');
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(false);
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
        wrapper
          .find(toggleInstructionsButton)
          .find(instructionsIcon)
          .exists(),
      ).toBe(false);
      expect(wrapper.vm.$store.state.instructionsStore.isInstructionsMode).toBe(
        true,
      );
    });

    it('toggles the instructions overlay on multiple clicks', () => {
      const instructionsButton = wrapper.find(toggleInstructionsButton);

      // initial state
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(true);
      expect(wrapper.vm.$props.showGetInstructionsGraphic).toBe(true);
      expect(wrapper.vm.$store.state.instructionsStore.isInstructionsMode).toBe(
        false,
      );

      // first click
      instructionsButton.trigger('click');

      // parent updates props like so:
      wrapper.setProps({
        showGetInstructionsGraphic: false,
      });
      instructionsButton.setProps({
        showGetInstructionsGraphic: false,
      });

      // current state
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(false);
      expect(wrapper.vm.$props.showGetInstructionsGraphic).toBe(false);
      expect(wrapper.vm.$store.state.instructionsStore.isInstructionsMode).toBe(
        true,
      );

      // second click
      instructionsButton.trigger('click');

      // parent updates props like so:
      wrapper.setProps({
        isInstructionsMode: false,
      });

      // current state
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(false);
      expect(wrapper.vm.$props.showGetInstructionsGraphic).toBe(false);
      expect(wrapper.vm.$store.state.instructionsStore.isInstructionsMode).toBe(
        false,
      );

      // third click
      instructionsButton.trigger('click');

      // parent updates props like so:
      wrapper.setProps({
        isInstructionsMode: true,
      });

      // current state
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(false);
      expect(wrapper.vm.$props.showGetInstructionsGraphic).toBe(false);
      expect(wrapper.vm.$store.state.instructionsStore.isInstructionsMode).toBe(
        true,
      );

      // showGetInstructionsGraphic has only been emitted once
      expect(
        wrapper.emitted('update:showGetInstructionsGraphic'),
      ).toStrictEqual([[false]]);
    });
  });
});
