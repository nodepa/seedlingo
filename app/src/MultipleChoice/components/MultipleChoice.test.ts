// Libraries, plugins, components
import store from '@/common/store/RootStore';
import Badge from '@/common/components/Badge.vue';
import InstructionsDirective from '@/common/directives/InstructionsDirective';

// Helpers
import { mount, VueWrapper } from '@vue/test-utils';
import getTestData from '@/MultipleChoice/data/MultipleChoiceTestData';
import { animate, pause, play } from '@/test-support/MockImplementations';
window.Element.prototype.animate = animate;
HTMLMediaElement.prototype.play = play;
HTMLMediaElement.prototype.pause = pause;

// Item under test
import MultipleChoice from './MultipleChoice.vue';
import { MultipleChoiceItem } from '../MultipleChoiceTypes';

describe('MultipleChoice', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(MultipleChoice, {
      // shallow: true,
      props: {
        exerciseProp: getTestData(),
      },
      global: {
        plugins: [store, [InstructionsDirective, { Badge }]],
      },
    });
  });

  describe('initial state', () => {
    it('has correct defaults', () => {
      expect(wrapper.vm.exerciseProp.itemUnderTestAudio).toBeDefined();
      expect(wrapper.vm.exerciseProp.itemUnderTestAudioPlaying).toBe(false);
      expect(wrapper.vm.exerciseProp.iconToMatch).toBeDefined();
      expect(wrapper.vm.exerciseProp.explanationToMatch).toBeUndefined();
      expect(wrapper.vm.exerciseProp.options.length).toBe(4);
    });
  });

  describe('.determineCorrectness()', () => {
    it('handles correct and incorrect options', async () => {
      const option: MultipleChoiceItem = {
        word: 'someWord',
        audio: new Audio(),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      };
      wrapper.vm.determineCorrectness(option);
      expect(option.color).toBeUndefined();
      expect(option.buzzing).toBe(true);
      option.correct = true;
      option.buzzing = false;

      wrapper.vm.determineCorrectness(option);
      expect(option.color).toBe('success');
      expect(option.buzzing).toBe(false);
    });
  });

  describe('.getSpacing()', () => {
    it('returns correct spacing class names', () => {
      // getSpacing(itemCount, index)
      expect(wrapper.vm.getSpacing(0, 0)).toBe('');
      expect(wrapper.vm.getSpacing(1, 0)).toBe('');
      expect(wrapper.vm.getSpacing(2, 0)).toBe('margin-right: -16px');
      expect(wrapper.vm.getSpacing(2, 1)).toBe('margin-left: -16px');
      expect(wrapper.vm.getSpacing(3, 1)).toBe(
        'margin-right: -16px;margin-left: -16px',
      );
    });
  });
});
