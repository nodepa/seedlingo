import { beforeEach, describe, it, expect, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import {
  animate,
  Animation,
  AnimationEffect,
} from '@/test-support/MockImplementations';

import RippleAnimation from '@/common/animations/RippleAnimation.vue';

window.Element.prototype.animate = animate;
window.Animation = Animation;
window.AnimationEffect = AnimationEffect;

describe('RippleAnimation', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(RippleAnimation, { shallowMount: true });
  });

  describe('initial state', () => {
    it('has correct defaults', () => {
      expect(wrapper.vm.$props.playing).toBe(false);
      expect(wrapper.vm.$props.duration).toBe(500);
      expect(wrapper.vm.$props.delay).toBe(200);
      expect(wrapper.vm.$props.iterations).toBe(Infinity);
      expect(wrapper.vm.$props.borderWidth).toBe('4px');
      expect(wrapper.vm.$props.size).toBe('40px');
      expect(wrapper.vm.$props.scale).toBe('4');
      expect(wrapper.vm.$props.borderColor).toBe('rgba(0,0,0,0.3)');
    });
  });

  describe('animation', () => {
    it('animates when `playing`', async () => {
      const spyAnimate = vi.spyOn(window.Element.prototype, 'animate');
      const spyCancel = vi.spyOn(window.Animation.prototype, 'cancel');
      expect(spyAnimate).toBeCalledTimes(0);
      expect(spyCancel).toBeCalledTimes(0);
      await wrapper.setProps({ playing: true });
      expect(spyAnimate).toBeCalledTimes(2);
      expect(spyCancel).toBeCalledTimes(0);
      await wrapper.setProps({ playing: false });
      expect(spyAnimate).toBeCalledTimes(2);
      expect(spyCancel).toBeCalledTimes(2);
    });
  });
});
