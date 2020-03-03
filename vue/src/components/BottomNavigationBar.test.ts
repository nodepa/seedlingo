import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';

import BottomNavigationBar from '@/components/BottomNavigationBar.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe('BottomNavigationBar.vue', () => {
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
      const homeButton = wrapper.find('[data-test="home-button"]');
      expect(homeButton.exists()).toBe(true);
      expect(homeButton.classes().includes('v-btn--disabled')).toBe(true);
    });
    it('links to home', () => {
      expect(wrapper.find('[data-test="home-button"]').vm.$route.path).toBe(
        '/',
      );
    });
  });

  describe('toggle-instructions-button', () => {
    it('toggles the instructions overlay on multiple clicks', () => {
      const instructionsButton = wrapper.find(
        '[data-test="toggle-instructions-button"]',
      );

      // On first click
      instructionsButton.trigger('click');
      expect(wrapper.emitted('update:showGetInstructionsGraphic')[0][0]).toBe(
        false,
      );
      expect(wrapper.vm.$data.disableHome).toBe(false);
      expect(wrapper.emitted('update:isInstructionsMode')[0][0]).toBe(true);

      // Parent would have updated props like so:
      wrapper.setProps({
        showGetInstructionsGraphic: false,
        isInstructionsMode: true,
      });
      // On second click
      instructionsButton.trigger('click');
      expect(wrapper.emitted('update:showGetInstructionsGraphic').length).toBe(
        1,
      );
      expect(wrapper.vm.$data.disableHome).toBe(false);
      expect(wrapper.emitted('update:isInstructionsMode')[1][0]).toBe(false);

      // Parent would have updated props like so:
      wrapper.setProps({
        showGetInstructionsGraphic: false,
        isInstructionsMode: false,
      });
      // On third click
      instructionsButton.trigger('click');
      expect(wrapper.vm.$data.disableHome).toBe(false);
      expect(wrapper.emitted('update:isInstructionsMode').length).toBe(3);
      expect(wrapper.emitted('update:isInstructionsMode')[2][0]).toBe(true);
    });
  });
});
