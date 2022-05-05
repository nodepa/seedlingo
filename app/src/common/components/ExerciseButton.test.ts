// Helpers
import { mount, VueWrapper } from '@vue/test-utils';
import { animate } from '@/test-support/MockImplementations';
window.Element.prototype.animate = animate;

// Item under test
import ExerciseButton from './ExerciseButton.vue';

describe('ExerciseButton', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(ExerciseButton);
  });

  describe('initial state', () => {
    it('has correct defaults', () => {
      expect(wrapper.element.classList).not.toContain('ion-color-danger');
      expect(wrapper.vm.$props.playing).toBe(false);
      expect(wrapper.vm.$props.color).toBe('');
      expect(wrapper.vm.$props.disabled).toBe(false);
      expect(wrapper.vm.$props.buzzing).toBe(false);
    });

    // it('changes color when `buzzing`', async () => {
    //   expect(wrapper.element.classList).not.toContain('ion-color-danger');
    //   await wrapper.setProps({ buzzing: true });
    //   expect(wrapper.element.classList).toContain('ion-color-danger');
    // });

    it('animates when `buzzing`', async () => {
      const spyAnimate = jest.spyOn(window.Element.prototype, 'animate');
      expect(spyAnimate).toBeCalledTimes(0);
      await wrapper.setProps({ buzzing: true });
      expect(spyAnimate).toBeCalledTimes(1);
      jest.restoreAllMocks();
    });
  });
});
