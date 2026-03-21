import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue } from '@ionic/vue';
import { animate, pause, play } from '@/test-support/MockImplementations';
import rootStore from '@/common/store/RootStore';
import InstructionsBadge from '@/common/components/InstructionsBadge.vue';
import InstructionsDirective from '@/common/directives/InstructionsDirective';
import ComprehensionTestData from '@/Comprehension/data/ComprehensionTestData';
import type {
  ComprehensionOption,
  ComprehensionQuestion,
} from '@/Comprehension/ComprehensionTypes';

import ComprehensionExercise from '@/Comprehension/components/ComprehensionExercise.vue';

window.Element.prototype.animate = animate;
HTMLMediaElement.prototype.play = play;
HTMLMediaElement.prototype.pause = pause;

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', name: 'Home', component: { template: '<div/>' } }],
});

/**
 * Advances the component from ReadText to AnswerQuestions (first question,
 * index 0) by waiting for the initial mount watchers to settle, then
 * triggering a true to false transition on showContinueButton.
 */
async function advanceToAnswerQuestions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapper: VueWrapper<any>,
): Promise<void> {
  // Allow onMounted + currentStage watcher to dispatch setShowContinueButton(true)
  await wrapper.vm.$nextTick();
  // Ensure the state is true before we fire the Continue click
  await rootStore.dispatch('setShowContinueButton', true);
  await wrapper.vm.$nextTick();
  // Simulate clicking Continue: true to false triggers the showContinueButton watcher
  await rootStore.dispatch('setShowContinueButton', false);
  await wrapper.vm.$nextTick();
}

describe('ComprehensionExercise', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeEach(async () => {
    await rootStore.dispatch('resetState');
    localStorage.clear();
    wrapper = mount(ComprehensionExercise, {
      props: {
        exerciseProp: ComprehensionTestData(),
      },
      global: {
        plugins: [
          IonicVue,
          router,
          rootStore,
          [InstructionsDirective, { Badge: InstructionsBadge }],
        ],
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('.playOptionAudio()', () => {
    it('cancels playing questionAudio before playing the option audio', () => {
      const question: ComprehensionQuestion = wrapper.vm.exercise.questions[0];
      const option: ComprehensionOption = question.options[0];

      // Simulate questionAudio playing
      question.questionAudio!.playing = true;
      const cancelSpy = vi.spyOn(question.questionAudio!, 'cancel');

      wrapper.vm.playOptionAudio(option);

      expect(cancelSpy).toHaveBeenCalled();
    });

    it('cancels playing option audio before playing new option audio', () => {
      const question: ComprehensionQuestion = wrapper.vm.exercise.questions[0];
      const playingOption: ComprehensionOption = question.options[0];
      const newOption: ComprehensionOption = question.options[1];

      // Simulate an option already playing
      playingOption.audio!.playing = true;
      const cancelSpy = vi.spyOn(playingOption.audio!, 'cancel');

      wrapper.vm.playOptionAudio(newOption);

      expect(cancelSpy).toHaveBeenCalled();
    });
  });

  describe('.togglePlayInstructions()', () => {
    it('cancels playing option audio before playing questionAudio', async () => {
      // Allow initial mounted/watchers to run, then advance to AnswerQuestions
      // stage by triggering a true to false transition.
      await advanceToAnswerQuestions(wrapper);

      // Confirm we are now in the AnswerQuestions stage
      expect(wrapper.vm.currentQuestion).toBeGreaterThanOrEqual(0);

      const question: ComprehensionQuestion = wrapper.vm.exercise.questions[0];
      const playingOption: ComprehensionOption = question.options[0];

      // Simulate an option audio playing
      playingOption.audio!.playing = true;
      const cancelSpy = vi.spyOn(playingOption.audio!, 'cancel');

      wrapper.vm.togglePlayInstructions();

      expect(cancelSpy).toHaveBeenCalled();
    });
  });

  describe('.cancelCurrentQuestionAudio()', () => {
    it('cancels questionAudio and all option audio for the current question', async () => {
      await advanceToAnswerQuestions(wrapper);

      const totalQuestions: number = wrapper.vm.exercise.questions.length;

      // Jump directly to the last question.
      wrapper.vm.currentQuestion = totalQuestions - 1;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.currentQuestion).toBe(totalQuestions - 1);

      const lastQuestion: ComprehensionQuestion =
        wrapper.vm.exercise.questions[totalQuestions - 1];
      const questionCancelSpy = vi.spyOn(lastQuestion.questionAudio!, 'cancel');
      const optionCancelSpy = vi.spyOn(
        lastQuestion.options[0].audio!,
        'cancel',
      );

      wrapper.vm.cancelCurrentQuestionAudio();

      expect(questionCancelSpy).toHaveBeenCalled();
      expect(optionCancelSpy).toHaveBeenCalled();
    });
  });

  describe('Continue button (showContinueButton watcher)', () => {
    it('cancels questionAudio when clicking Continue on a mid-sequence question', async () => {
      await advanceToAnswerQuestions(wrapper);

      expect(wrapper.vm.currentQuestion).toBeGreaterThanOrEqual(0);

      const question: ComprehensionQuestion = wrapper.vm.exercise.questions[0];
      question.questionAudio!.playing = true;
      const cancelSpy = vi.spyOn(question.questionAudio!, 'cancel');

      // Trigger Continue (true to false advances to the next question)
      await rootStore.dispatch('setShowContinueButton', true);
      await wrapper.vm.$nextTick();
      await rootStore.dispatch('setShowContinueButton', false);
      await wrapper.vm.$nextTick();

      expect(cancelSpy).toHaveBeenCalled();
    });

    it('advances past AnswerQuestions when Continue is clicked on the last question', async () => {
      await advanceToAnswerQuestions(wrapper);

      const totalQuestions: number = wrapper.vm.exercise.questions.length;

      // Jump directly to the last question.
      wrapper.vm.currentQuestion = totalQuestions - 1;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.currentQuestion).toBe(totalQuestions - 1);
      expect(wrapper.vm.currentStage).toBe(1); // STAGE.AnswerQuestions

      // Trigger Continue -- this hits the "last question -> advance stage" else branch.
      await rootStore.dispatch('setShowContinueButton', true);
      await wrapper.vm.$nextTick();
      await rootStore.dispatch('setShowContinueButton', false);
      await wrapper.vm.$nextTick();

      // Stage should have advanced past AnswerQuestions (1) to FocusNewWords (2).
      expect(wrapper.vm.currentStage).toBeGreaterThan(1);
    });
  });
});
