// Helpers
import { shallowMount, VueWrapper } from '@vue/test-utils';
import vuetify from '@/test-support/VuetifyInstance';
import { Animation, animate } from '@/test-support/Overrides';
window.Animation = Animation;
window.Element.prototype.animate = animate;

// Item under test
import RippleAnimation from './RippleAnimation.vue';

describe('RippleAnimation', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = shallowMount(RippleAnimation, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  describe('initial state', () => {
    it('has correct defaults', () => {
      expect(wrapper.vm.$props.playing).toBe(false);
      expect(wrapper.vm.$props.duration).toBe(500);
      expect(wrapper.vm.$props.delay).toBe(0);
      expect(wrapper.vm.$props.iterations).toBe(Infinity);
      expect(wrapper.vm.$props.borderWidth).toBe('4px');
      expect(wrapper.vm.$props.size).toBe('40px');
      expect(wrapper.vm.$props.scale).toBe('4');
      expect(wrapper.vm.$props.borderColor).toBe('rgba(0,0,0,0.3)');
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
      jest.restoreAllMocks();
    });
  });
});
