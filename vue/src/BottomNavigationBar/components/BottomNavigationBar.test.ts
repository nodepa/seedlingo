import { shallowMount, mount, createLocalVue, Wrapper } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';

import BottomNavigationBar from './BottomNavigationBar.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe('BottomNavigationBar.vue (shallow)', () => {
  let vuetify: typeof Vuetify;
  let wrapper: Wrapper<Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    // wrapper = mount(BottomNavigationBar, {
    wrapper = shallowMount(BottomNavigationBar, {
      localVue,
      router,
      vuetify,
      propsData: {
        showGetInstructionsGraphic: true,
        isInstructionsMode: false,
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
      expect(wrapper.find('[data-test="home-button"]').exists()).toBe(true);
      expect(
        wrapper.find('[data-test="toggle-instructions-button"]').exists(),
      ).toBe(true);
    });
  });

  // Elements have initial states
  describe('home-button', () => {
    it('is disabled on first load', () => {
      expect(wrapper.find('[data-test="home-button"]').props().disabled).toBe(
        true,
      );
    });
    it('links to home', () => {
      expect(wrapper.find('[data-test="home-button"]').vm.$route.path).toBe(
        '/',
      );
    });
  });
});

describe('BottomNavigationBar.vue (deep)', () => {
  let vuetify: typeof Vuetify;
  let wrapper: Wrapper<Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(BottomNavigationBar, {
      localVue,
      router,
      vuetify,
      propsData: {
        showGetInstructionsGraphic: true,
        isInstructionsMode: false,
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  // Elements have expected behaviour
  describe('toggle-instructions-button', () => {
    it('on first click: hides the "get instructions" graphic', () => {
      wrapper.find('[data-test="toggle-instructions-button"]').trigger('click');
      expect(
        wrapper.emitted('update:showGetInstructionsGraphic'),
      ).toStrictEqual([[false]]);
    });

    it('on first click: enables the home button', () => {
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(true);
      wrapper.find('[data-test="toggle-instructions-button"]').trigger('click');
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(false);
    });

    it('on first click: toggles on instructions mode', () => {
      wrapper.find('[data-test="toggle-instructions-button"]').trigger('click');
      expect(wrapper.emitted('update:isInstructionsMode')).toStrictEqual([
        [true],
      ]);
    });

    it('toggles the instructions overlay on multiple clicks', () => {
      const instructionsButton = wrapper.find(
        '[data-test="toggle-instructions-button"]',
      );

      // initial state
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(true);
      expect(wrapper.vm.$props.showGetInstructionsGraphic).toBe(true);
      expect(wrapper.vm.$props.isInstructionsMode).toBe(false);

      // first click
      instructionsButton.trigger('click');

      // parent updates props like so:
      wrapper.setProps({
        showGetInstructionsGraphic: false,
        isInstructionsMode: true,
      });

      // current state
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(false);
      expect(wrapper.vm.$props.showGetInstructionsGraphic).toBe(false);
      expect(wrapper.vm.$props.isInstructionsMode).toBe(true);

      // second click
      instructionsButton.trigger('click');

      // parent updates props like so:
      wrapper.setProps({
        isInstructionsMode: false,
      });

      // current state
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(false);
      expect(wrapper.vm.$props.showGetInstructionsGraphic).toBe(false);
      expect(wrapper.vm.$props.isInstructionsMode).toBe(false);

      // third click
      instructionsButton.trigger('click');

      // parent updates props like so:
      wrapper.setProps({
        isInstructionsMode: true,
      });

      // current state
      expect(wrapper.vm.$data.isHomeButtonDisabled).toBe(false);
      expect(wrapper.vm.$props.showGetInstructionsGraphic).toBe(false);
      expect(wrapper.vm.$props.isInstructionsMode).toBe(true);

      // showGetInstructionsGraphic has only been emitted once
      expect(
        wrapper.emitted('update:showGetInstructionsGraphic'),
      ).toStrictEqual([[false]]);

      // isInstructionsMode has been emitted trice toggling true/false
      expect(wrapper.emitted('update:isInstructionsMode')).toStrictEqual([
        [true],
        [false],
        [true],
      ]);
    });
  });
});
