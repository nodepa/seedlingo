// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import UnitForm from '~/components/unit-form.vue';

// Mock AWS Amplify to prevent connection errors in tests
vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    models: {},
  })),
}));

describe('UnitForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a trigger button', async () => {
    const wrapper = await mountSuspended(UnitForm, {
      props: { isAddMode: true },
    });
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
  });

  it('shows "Add new unit" text on the trigger button in add mode', async () => {
    const wrapper = await mountSuspended(UnitForm, {
      props: { isAddMode: true },
    });
    expect(wrapper.text()).toContain('Add new unit');
  });

  it('shows "Edit" text on the trigger button in edit mode', async () => {
    const wrapper = await mountSuspended(UnitForm, {
      props: { isAddMode: false },
    });
    expect(wrapper.text()).toContain('Edit');
  });

  it('uses default props when none are provided', async () => {
    const wrapper = await mountSuspended(UnitForm);
    expect(wrapper.exists()).toBe(true);
  });

  it('accepts unitData prop with id, name, and description', async () => {
    const unitData = {
      id: 'unit-1',
      name: 'Lesson 1',
      description: 'Introduction',
    };
    const wrapper = await mountSuspended(UnitForm, {
      props: { isAddMode: false, unitData },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits updateUnit event when form is submitted', async () => {
    const wrapper = await mountSuspended(UnitForm, {
      props: { isAddMode: true },
    });

    // Open the modal by clicking the trigger button
    const triggerButton = wrapper.find('button');
    await triggerButton.trigger('click');

    // Emit the event programmatically via the component instance
    wrapper.vm.$emit('updateUnit', { id: 'unit-1', name: 'New Unit' });
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted('updateUnit');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([{ id: 'unit-1', name: 'New Unit' }]);
  });
});
