// Helpers
import { mount, VueWrapper } from '@vue/test-utils';
import vuetify from '@/test-support/VuetifyInstance';
import { animate } from '@/test-support/Overrides';
window.Element.prototype.animate = animate;

// Item under test
import ExerciseButton from './ExerciseButton.vue';

describe('ExerciseButton', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(ExerciseButton, {
      shallow: true,
      global: {
        plugins: [vuetify],
      },
    });
  });

  describe('initial state', () => {
    it('has correct defaults', () => {
      expect(wrapper.element.classList).not.toContain('bg-error');
      expect(wrapper.vm.$props.playing).toBe(false);
      expect(wrapper.vm.$props.color).toBe('');
      expect(wrapper.vm.$props.disabled).toBe(false);
      expect(wrapper.vm.$props.height).toBe('100%');
      expect(wrapper.vm.$props.buzzing).toBe(false);
    });

    it('changes color when `buzzing`', async () => {
      expect(wrapper.element.classList).not.toContain('bg-error');
      await wrapper.setProps({ buzzing: true });
      expect(wrapper.element.classList).toContain('bg-error');
    });

    it('animates when `buzzing`', async () => {
      const spyAnimate = jest.spyOn(window.Element.prototype, 'animate');
      expect(spyAnimate).toBeCalledTimes(0);
      await wrapper.setProps({ buzzing: true });
      expect(spyAnimate).toBeCalledTimes(1);
      jest.restoreAllMocks();
    });
  });
});
