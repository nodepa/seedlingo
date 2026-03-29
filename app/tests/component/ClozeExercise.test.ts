import { beforeEach, describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { mount, VueWrapper } from '@vue/test-utils';
import { animate, pause, play } from '@/test-support/MockImplementations';
import { useContinueButton } from '@/common/composables/useContinueButton';
import InstructionsBadge from '@/common/components/InstructionsBadge.vue';
import InstructionsDirective from '@/common/directives/InstructionsDirective';
import SingleClozeTestData from '@/Cloze/data/SingleClozeTestData';
import MultiClozeTestData from '@/Cloze/data/MultiClozeTestData';
import type { ClozeOption } from '@/Cloze/ClozeTypes';

import ClozeExercise from '@/Cloze/components/ClozeExercise.vue';

window.Element.prototype.animate = animate;
HTMLMediaElement.prototype.play = play;
HTMLMediaElement.prototype.pause = pause;

// Local standalone state for the directive
const isInstructionsMode = ref(false);
const toggleInstructionsMode = () => {
  isInstructionsMode.value = !isInstructionsMode.value;
};
const directiveOptions = {
  Badge: InstructionsBadge,
  isInstructionsMode,
  toggleInstructionsMode,
};

describe('ClozeExercise', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;
  const { showContinueButton } = useContinueButton();

  beforeEach(async () => {
    showContinueButton.value = false;
    localStorage.clear();
  });

  describe('SingleCloze', () => {
    beforeEach(() => {
      wrapper = mount(ClozeExercise, {
        props: {
          exerciseProp: SingleClozeTestData(),
        },
        global: {
          plugins: [[InstructionsDirective, directiveOptions]],
        },
      });
    });

    describe('initial state', () => {
      it('has the correct clozeType', () => {
        expect(wrapper.vm.exercise.clozeType).toBe('SingleCloze');
      });

      it('has 4 options', () => {
        expect(wrapper.vm.exercise.clozeOptions.length).toBe(4);
      });

      it('has exactly one blank in the cloze text', () => {
        const blanks = wrapper.vm.exercise.clozeText.filter(
          (w: { isBlank: boolean }) => w.isBlank,
        );
        expect(blanks.length).toBe(1);
      });

      it('does not show the continue button initially', () => {
        expect(showContinueButton.value).toBe(false);
      });
    });

    describe('.determineCorrectness()', () => {
      it('marks the correct option with success color and reveals the blank', async () => {
        const correctOption: ClozeOption =
          wrapper.vm.exercise.clozeOptions.find((o: ClozeOption) => o.correct);
        expect(correctOption).toBeDefined();
        wrapper.vm.determineCorrectness(correctOption);
        await wrapper.vm.$nextTick();

        expect(correctOption.color).toBe('success');
        const blank = wrapper.vm.exercise.clozeText.find(
          (w: { isBlank: boolean }) => w.isBlank,
        );
        expect(blank.revealed).toBe(true);
      });

      it('shows the continue button after the correct option is selected', async () => {
        const correctOption: ClozeOption =
          wrapper.vm.exercise.clozeOptions.find((o: ClozeOption) => o.correct);
        wrapper.vm.determineCorrectness(correctOption);
        await wrapper.vm.$nextTick();

        expect(showContinueButton.value).toBe(true);
      });

      it('disables the other options after the correct option is selected', async () => {
        const correctOption: ClozeOption =
          wrapper.vm.exercise.clozeOptions.find((o: ClozeOption) => o.correct);
        wrapper.vm.determineCorrectness(correctOption);
        await wrapper.vm.$nextTick();

        const otherOptions: ClozeOption[] =
          wrapper.vm.exercise.clozeOptions.filter(
            (o: ClozeOption) => o !== correctOption,
          );
        otherOptions.forEach((option) => {
          expect(option.disabled).toBe(true);
        });
      });

      it('buzzes an incorrect option and does not reveal the blank', async () => {
        const incorrectOption: ClozeOption =
          wrapper.vm.exercise.clozeOptions.find((o: ClozeOption) => !o.correct);
        expect(incorrectOption).toBeDefined();
        wrapper.vm.determineCorrectness(incorrectOption);
        await wrapper.vm.$nextTick();

        expect(incorrectOption.buzzing).toBe(true);
        const blank = wrapper.vm.exercise.clozeText.find(
          (w: { isBlank: boolean }) => w.isBlank,
        );
        expect(blank.revealed).toBe(false);
      });

      it('does not show the continue button after an incorrect option is selected', async () => {
        const incorrectOption: ClozeOption =
          wrapper.vm.exercise.clozeOptions.find((o: ClozeOption) => !o.correct);
        wrapper.vm.determineCorrectness(incorrectOption);
        await wrapper.vm.$nextTick();

        expect(showContinueButton.value).toBe(false);
      });
    });
  });

  describe('MultiCloze', () => {
    beforeEach(() => {
      wrapper = mount(ClozeExercise, {
        props: {
          exerciseProp: MultiClozeTestData(),
        },
        global: {
          plugins: [[InstructionsDirective, directiveOptions]],
        },
      });
    });

    describe('initial state', () => {
      it('has the correct clozeType', () => {
        expect(wrapper.vm.exercise.clozeType).toBe('MultiCloze');
      });

      it('has 4 options', () => {
        expect(wrapper.vm.exercise.clozeOptions.length).toBe(4);
      });

      it('has multiple blanks in the cloze text', () => {
        const blanks = wrapper.vm.exercise.clozeText.filter(
          (w: { isBlank: boolean }) => w.isBlank,
        );
        expect(blanks.length).toBeGreaterThan(1);
      });

      it('does not show the continue button initially', () => {
        expect(showContinueButton.value).toBe(false);
      });
    });

    describe('.determineCorrectness()', () => {
      it('reveals the first blank when the matching option is selected', async () => {
        const blanks = wrapper.vm.exercise.clozeText.filter(
          (w: { isBlank: boolean }) => w.isBlank,
        );
        const firstBlankWord = blanks[0].word;
        const matchingOption: ClozeOption =
          wrapper.vm.exercise.clozeOptions.find(
            (o: ClozeOption) => o.word === firstBlankWord,
          );
        expect(matchingOption).toBeDefined();

        wrapper.vm.determineCorrectness(matchingOption);
        await wrapper.vm.$nextTick();

        expect(blanks[0].revealed).toBe(true);
        expect(matchingOption.disabled).toBe(true);
      });

      it('buzzes when a wrong option is selected for the first blank', async () => {
        const blanks = wrapper.vm.exercise.clozeText.filter(
          (w: { isBlank: boolean }) => w.isBlank,
        );
        const firstBlankWord = blanks[0].word;
        const wrongOption: ClozeOption = wrapper.vm.exercise.clozeOptions.find(
          (o: ClozeOption) => o.word !== firstBlankWord,
        );
        expect(wrongOption).toBeDefined();

        wrapper.vm.determineCorrectness(wrongOption);
        await wrapper.vm.$nextTick();

        expect(wrongOption.buzzing).toBe(true);
        expect(blanks[0].revealed).toBe(false);
      });

      it('shows the continue button only after all blanks are revealed', async () => {
        const blanks: Array<{ word: string; isBlank: boolean }> =
          wrapper.vm.exercise.clozeText.filter(
            (w: { isBlank: boolean }) => w.isBlank,
          );

        // Fill all blanks in order
        for (let i = 0; i < blanks.length; i++) {
          const blankWord = blanks[i].word;
          const matchingOption: ClozeOption =
            wrapper.vm.exercise.clozeOptions.find(
              (o: ClozeOption) => o.word === blankWord,
            );
          wrapper.vm.determineCorrectness(matchingOption);
          await wrapper.vm.$nextTick();

          if (i < blanks.length - 1) {
            expect(showContinueButton.value).toBe(false);
          } else {
            expect(showContinueButton.value).toBe(true);
          }
        }
      });
    });
  });
});
