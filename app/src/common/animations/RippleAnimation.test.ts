// Libraries, plugins, components
import Vue from 'vue';
import Vuetify from 'vuetify';

// Helpers
import { shallowMount, Wrapper } from '@vue/test-utils';
import { Animation, animate } from '@/test-support/Overrides';

// Item under test
import RippleAnimation from './RippleAnimation.vue';

window.Animation = Animation;
window.Element.prototype.animate = animate;

Vue.use(Vuetify);

describe('RippleAnimation', () => {
  let wrapper: Wrapper<Vue>;
  let vuetify: Vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(RippleAnimation, {
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
      expect(wrapper.vm.$props.playing).toBe(false);
      expect(wrapper.vm.$props.duration).toBe(500);
      expect(wrapper.vm.$props.delay).toBe(0);
      expect(wrapper.vm.$props.iterations).toBe(Infinity);
      expect(wrapper.vm.$props.borderWidth).toBe('4px');
      expect(wrapper.vm.$props.size).toBe('40px');
      expect(wrapper.vm.$props.scale).toBe('4');
      expect(wrapper.vm.$props.borderColor).toBe('rgba(0,0,0,0.2)');
    });

    it('animates when `playing`', async () => {
      const spyAnimate = jest.spyOn(window.Element.prototype, 'animate');
      const spyCancel = jest.spyOn(Animation.prototype, 'cancel');
      expect(spyAnimate).toBeCalledTimes(0);
      await wrapper.setProps({ playing: true });
      expect(spyAnimate).toBeCalledTimes(1);
      await wrapper.setProps({ playing: false });
      expect(spyAnimate).toBeCalledTimes(1);
      expect(spyCancel).toBeCalledTimes(1);
    });
  });
});
