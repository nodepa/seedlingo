import { ref } from 'vue';
import InstructionsBadge from '@/common/components/InstructionsBadge.vue';
import InstructionsDirective from '@/common/directives/InstructionsDirective';
import Content from '@/Content/Content';

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
import UnitsMenu from '@/UnitsMenu/components/UnitsMenu.vue';

// Local standalone state for the directive
const isInstructionsMode = ref(false);
const toggleInstructionsMode = () => {
  isInstructionsMode.value = !isInstructionsMode.value;
};

describe('UnitsMenu', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeAll(() => {
    Content.UnitsMeta = {
      1: {
        name: 'TestUnit',
        icon: 'TestIcon1',
        audio: 'TestAudio1',
        words: [{ word: 'zero' }, { word: 'one' }],
        newWords: [{ word: 'zero' }, { word: 'one' }],
      },
      2: {
        name: 'TestUnit',
        icon: 'TestIcon2',
        audio: 'TestAudio2',
        words: [{ word: 'one' }, { word: 'two' }],
        newWords: [{ word: 'two' }],
      },
    };
  });

  beforeEach(() => {
    isInstructionsMode.value = false;
    localStorage.clear();
    wrapper = mount(UnitsMenu, {
      shallow: false,
      global: {
        plugins: [
          [
            InstructionsDirective,
            {
              Badge: InstructionsBadge,
              isInstructionsMode,
              toggleInstructionsMode,
            },
          ],
        ],
      },
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  // Component has expected elements
  describe('initial state', () => {
    it('renders a list of unit buttons', () => {
      expect(wrapper.find('[data-test="unit-list"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="unit-button-00"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="unit-button-01"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="unit-button-01"]').html()).toContain(
        'TestAudio1',
      );
      expect(wrapper.find('[data-test="unit-button-02"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="unit-button-03"]').exists()).toBe(false);
    });

    it('displays instructions when in instructions mode', async () => {
      expect(wrapper.find('[data-test="unit-button-01"]').exists()).toBe(true);
      expect(
        (wrapper.find('[data-test="unit-button-01"]').element as HTMLElement)
          .className,
      ).not.toBe('pop-through');
      toggleInstructionsMode();
      await wrapper.vm.$nextTick();
      expect(
        (wrapper.find('[data-test="unit-button-01"]').element as HTMLElement)
          .className,
      ).toBe('pop-through');
    });
  });
});
