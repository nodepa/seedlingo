import rootStore from '@/common/store/RootStore';
import InstructionsBadge from '@/common/components/InstructionsBadge.vue';
import InstructionsDirective from '@/common/directives/InstructionsDirective';
import Content from '@/Lessons/Content';

// Helpers
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { pause, play } from '@/test-support/MockImplementations';
window.HTMLMediaElement.prototype.pause = pause;
window.HTMLMediaElement.prototype.play = play;

// Item under test
import LessonsMenu from '@/Lessons/components/LessonsMenu.vue';

describe('LessonsMenu', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeAll(() => {
    Content.LessonsMeta = {
      1: {
        name: 'TestLesson1',
        icon: 'TestIcon1',
        audio: 'TestAudio1',
        words: [{ word: 'zero' }, { word: 'one' }],
        newWords: [{ word: 'zero' }, { word: 'one' }],
      },
      2: {
        name: 'TestLesson2',
        icon: 'TestIcon2',
        audio: 'TestAudio2',
        words: [{ word: 'one' }, { word: 'two' }],
        newWords: [{ word: 'two' }],
      },
    };
  });

  beforeEach(() => {
    rootStore.dispatch('resetState');
    wrapper = mount(LessonsMenu, {
      shallow: false,
      global: {
        plugins: [
          rootStore,
          [InstructionsDirective, { Badge: InstructionsBadge }],
        ],
      },
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  // Component has expected elements
  describe('initial state', () => {
    it('renders a list of lesson buttons', () => {
      expect(wrapper.find('[data-test="lesson-list"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="lesson-button-00"]').exists()).toBe(
        false,
      );
      expect(wrapper.find('[data-test="lesson-button-01"]').exists()).toBe(
        true,
      );
      expect(wrapper.find('[data-test="lesson-button-01"]').html()).toContain(
        'TestAudio1',
      );
      expect(wrapper.find('[data-test="lesson-button-02"]').exists()).toBe(
        true,
      );
      expect(wrapper.find('[data-test="lesson-button-03"]').exists()).toBe(
        false,
      );
    });

    it('displays instructions when in instructions mode', async () => {
      expect(wrapper.find('[data-test="lesson-button-01"]').exists()).toBe(
        true,
      );
      expect(
        (wrapper.find('[data-test="lesson-button-01"]').element as HTMLElement)
          .className,
      ).not.toBe('pop-through');
      await rootStore.dispatch('instructionsModeStore/toggleInstructionsMode');
      expect(
        (wrapper.find('[data-test="lesson-button-01"]').element as HTMLElement)
          .className,
      ).toBe('pop-through');
    });
  });
});
