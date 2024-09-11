import { beforeEach, describe, expect, it } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { animate, pause, play } from '@/test-support/MockImplementations';
import rootStore from '@/common/store/RootStore';
import InstructionsBadge from '@/common/components/InstructionsBadge.vue';
import InstructionsDirective from '@/common/directives/InstructionsDirective';
import getTestData from '@/MultipleChoice/data/MultipleChoiceTestData';
import type { MultipleChoiceItem } from '@/MultipleChoice/MultipleChoiceTypes';

import MultipleChoiceExercise from '@/MultipleChoice/components/MultipleChoiceExercise.vue';
import AudioProvider from '@/Content/AudioProvider';

window.Element.prototype.animate = animate;
HTMLMediaElement.prototype.play = play;
HTMLMediaElement.prototype.pause = pause;

describe('MultipleChoiceExercise', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(MultipleChoiceExercise, {
      // shallow: true,
      props: {
        exerciseProp: getTestData(),
      },
      global: {
        plugins: [
          rootStore,
          [InstructionsDirective, { Badge: InstructionsBadge }],
        ],
      },
    });
  });

  describe('initial state', () => {
    it('has correct defaults', () => {
      expect(wrapper.vm.exerciseProp.itemUnderTestAudio).toBeDefined();
      expect(wrapper.vm.exerciseProp.itemUnderTestAudioPlaying).toBe(false);
      expect(wrapper.vm.exerciseProp.iconToMatch).toBeUndefined();
      expect(wrapper.vm.exerciseProp.pictureToMatch).toBeDefined();
      expect(wrapper.vm.exerciseProp.explanationToMatch).toBeUndefined();
      expect(wrapper.vm.exerciseProp.options.length).toBe(4);
    });
  });

  describe('.determineCorrectness()', () => {
    it('handles correct and incorrect options', async () => {
      const option1: MultipleChoiceItem = {
        word: 'someWord',
        audio: AudioProvider.createAudioFromData(''),
        correct: false,
        disabled: false,
        playing: false,
      };
      wrapper.vm.determineCorrectness(option1);
      expect(option1.color).toBeUndefined();
      expect(option1.disabled).toBe(true);

      const option2: MultipleChoiceItem = {
        word: 'someWord',
        audio: AudioProvider.createAudioFromData(''),
        correct: true,
        disabled: false,
        playing: false,
      };

      wrapper.vm.determineCorrectness(option2);
      expect(option2.color).toBe('success');
      expect(option2.disabled).toBe(false);
    });
  });

  describe('.getSpacing()', () => {
    it('returns correct spacing class names', () => {
      // getSpacing(itemCount, index)
      expect(wrapper.vm.getSpacing(0, 0)).toBe('');
      expect(wrapper.vm.getSpacing(1, 0)).toBe('');
      expect(wrapper.vm.getSpacing(2, 0)).toBe('margin-right: -1rem');
      expect(wrapper.vm.getSpacing(2, 1)).toBe('margin-left: -1rem');
      expect(wrapper.vm.getSpacing(3, 1)).toBe(
        'margin-right: -1rem;margin-left: -1rem',
      );
    });
  });
});
