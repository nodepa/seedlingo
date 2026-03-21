import { beforeEach, describe, expect, it, vi } from 'vitest';
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
      // Advance to AnswerQuestions stage
      await rootStore.dispatch('setShowContinueButton', false);
      await wrapper.vm.$nextTick();

      const question: ComprehensionQuestion = wrapper.vm.exercise.questions[0];
      const playingOption: ComprehensionOption = question.options[0];

      // Simulate an option audio playing
      playingOption.audio!.playing = true;
      const cancelSpy = vi.spyOn(playingOption.audio!, 'cancel');

      wrapper.vm.togglePlayInstructions();

      expect(cancelSpy).toHaveBeenCalled();
    });
  });
});
