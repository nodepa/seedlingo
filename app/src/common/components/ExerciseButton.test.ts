// Libraries, plugins, components
import Vue from 'vue';
import Vuetify from 'vuetify';

// Helpers
import { shallowMount, Wrapper } from '@vue/test-utils';
import { animate } from '@/test-support/Overrides';

// Item under test
import ExerciseButton from './ExerciseButton.vue';

window.Element.prototype.animate = animate;

Vue.use(Vuetify);

describe('ExerciseButton', () => {
  let wrapper: Wrapper<Vue>;
  let vuetify: Vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(ExerciseButton, {
      vuetify,
    });
  });

  afterEach(() => {
    wrapper.destroy();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('is a Vue instance', () => {
      expect(wrapper.isVueInstance).toBeTruthy();
    });

    it('has correct defaults', () => {
      expect(wrapper.vm.$data.errorColor).toBe('');
      expect(wrapper.vm.$props.playing).toBe(false);
      expect(wrapper.vm.$props.color).toBe('');
      expect(wrapper.vm.$props.disabled).toBe(false);
      expect(wrapper.vm.$props.height).toBe('100%');
      expect(wrapper.vm.$props.buzzing).toBe(false);
    });

    it('changes color when `buzzing`', async () => {
      await wrapper.setProps({ buzzing: true });
      expect(wrapper.vm.$data.errorColor).toBe(
        wrapper.vm.$vuetify.theme.currentTheme.error,
      );
    });

    it('animates when `buzzing`', async () => {
      const spyAnimate = jest.spyOn(window.Element.prototype, 'animate');
      expect(spyAnimate).toBeCalledTimes(0);
      await wrapper.setProps({ buzzing: true });
      expect(spyAnimate).toBeCalledTimes(1);
    });
  });
});
