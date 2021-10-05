// Libraries, plugins, components
import store from '@/common/store/RootStore';
import Badge from '@/common/components/Badge.vue';
import InstructionDirective from '@/common/directives/InstructionDirective';
import ContentConfig from '@/Lessons/ContentConfig';

// Helpers
import { mount, VueWrapper } from '@vue/test-utils';
import vuetify from '@/test-support/VuetifyInstance';
import { pause, play } from '@/test-support/Overrides';
window.HTMLMediaElement.prototype.pause = pause;
window.HTMLMediaElement.prototype.play = play;

// Item under test
import Lessons from './Lessons.vue';

describe('Lessons.vue (shallow)', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeAll(() => {
    jest.spyOn(ContentConfig, 'getLessonsMenu').mockImplementation(() => {
      return {
        1: { name: 'TestLesson1', icon: 'TestIcon1', audio: 'TestAudio1' },
        2: { name: 'TestLesson2', icon: 'TestIcon2', audio: 'TestAudio2' },
      };
    });
  });

  beforeEach(() => {
    store.dispatch('resetState');
    wrapper = mount(Lessons, {
      // shallow: true,
      global: {
        // plugins: [store, vuetify],
        plugins: [store, vuetify, [InstructionDirective, { Badge }]],
      },
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // Component has expected elements
  describe('initial state', () => {
    it('renders a list of lesson buttons', () => {
      expect(wrapper.find('[data-test="lessons-list"]').exists()).toBe(true);
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

    it('displays instructions when in instruction mode', async () => {
      expect(wrapper.find('[data-test="lesson-button-01"]').exists()).toBe(
        true,
      );
      expect(
        (wrapper.find('[data-test="lesson-button-01"]').element as HTMLElement)
          .style.zIndex,
      ).not.toBe('4');
      await wrapper.vm.$store.dispatch(
        'instructionStore/toggleInstructionMode',
      );
      expect(
        (wrapper.find('[data-test="lesson-button-01"]').element as HTMLElement)
          .style.zIndex,
      ).toBe('4');
    });
  });
});
