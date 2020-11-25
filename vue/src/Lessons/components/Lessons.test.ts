// Libraries, plugins, components
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import store from '@/store';
import Badge from '@/common/components/Badge.vue';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import InstructionDirective from '@/common/directives/InstructionDirective';

// Helpers
import { createLocalVue, Wrapper, shallowMount } from '@vue/test-utils';
import { pause, play } from '@/test_helpers/FunctionOverrides';

// Item under test
import Lessons from './Lessons.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(InstructionDirective, { Badge, Animation: RippleAnimation });

window.HTMLMediaElement.prototype.pause = pause;
window.HTMLMediaElement.prototype.play = play;

describe('Lessons.vue (shallow)', () => {
  let vuetify: Vuetify;
  let wrapper: Wrapper<Vue>;

  beforeEach(() => {
    store.dispatch('instructionsStore/resetState');
    vuetify = new Vuetify();
    wrapper = shallowMount(Lessons, {
      localVue,
      vuetify,
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

    it('renders a list of lesson buttons', () => {
      expect(wrapper.find('[data-test="lessons-list"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="lesson-button"]').exists()).toBe(true);
    });

    it('displays instructions when in instructions mode', async () => {
      expect(
        wrapper.find('[data-test="lesson-button"]').element.style.zIndex,
      ).not.toBe('4');
      await wrapper.vm.$store.dispatch(
        'instructionsStore/toggleInstructionsMode',
      );
      expect(
        wrapper.find('[data-test="lesson-button"]').element.style.zIndex,
      ).toBe('4');
    });
  });
});
