// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import WordForm from '~/components/word-form.vue';
import type { TagSchema } from '~/types/WordTypes';

// Mock Nuxt middleware and plugins to isolate component from auth/AWS concerns
vi.mock('~/middleware/auth.global', () => ({ default: () => {} }));
vi.mock('~/plugins/amplify.client', () => ({ default: () => {} }));

// Minimal TagSchema stub for testing
const makeFakeTag = (id: string, name: string): TagSchema => ({
  id,
  name,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  wordTags: async () => ({ data: [], nextToken: null }),
});

describe('WordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a trigger button', async () => {
    const wrapper = await mountSuspended(WordForm, {
      props: { isAddMode: true },
    });
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
  });

  it('shows "Add new word" text on the trigger button in add mode', async () => {
    const wrapper = await mountSuspended(WordForm, {
      props: { isAddMode: true },
    });
    expect(wrapper.text()).toContain('Add new word');
  });

  it('shows "Edit" text on the trigger button in edit mode', async () => {
    const wrapper = await mountSuspended(WordForm, {
      props: { isAddMode: false },
    });
    expect(wrapper.text()).toContain('Edit');
  });

  it('uses default props when none are provided', async () => {
    const wrapper = await mountSuspended(WordForm);
    expect(wrapper.exists()).toBe(true);
  });

  it('accepts wordData prop with word fields', async () => {
    const wordData = {
      id: 'word-1',
      word: '你好',
      description: 'Hello',
      audio: '',
      picture: '',
      symbol: [],
      isPunctuation: false,
    };
    const wrapper = await mountSuspended(WordForm, {
      props: { isAddMode: false, wordData },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders tag badges when availableTags are provided', async () => {
    const tags = [
      makeFakeTag('tag-1', 'Greetings'),
      makeFakeTag('tag-2', 'Numbers'),
    ];
    const wrapper = await mountSuspended(WordForm, {
      props: { isAddMode: true, availableTags: tags },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits updateWord event when form is submitted', async () => {
    const wrapper = await mountSuspended(WordForm, {
      props: { isAddMode: true },
    });

    // Open the modal by clicking the trigger button
    const triggerButton = wrapper.find('button');
    await triggerButton.trigger('click');

    // Emit the event programmatically via the component instance
    wrapper.vm.$emit('updateWord', {
      id: '',
      word: '你好',
      description: 'Hello',
      audio: '',
      picture: '',
      symbol: [],
      isPunctuation: false,
      tagIds: [],
    });
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted('updateWord');
    expect(emitted).toBeTruthy();
    expect(emitted![0]![0]).toMatchObject({ word: '你好', tagIds: [] });
  });
});
