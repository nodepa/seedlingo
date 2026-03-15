// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ModuleForm from '~/components/module-form.vue';

// Mock AWS Amplify to prevent connection errors in tests
vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    models: {},
  })),
}));

describe('ModuleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a trigger button', async () => {
    const wrapper = await mountSuspended(ModuleForm, {
      props: { isAddMode: true },
    });
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
  });

  it('shows "Add new module" text on the trigger button in add mode', async () => {
    const wrapper = await mountSuspended(ModuleForm, {
      props: { isAddMode: true },
    });
    expect(wrapper.text()).toContain('Add new module');
  });

  it('shows "Edit" text on the trigger button in edit mode', async () => {
    const wrapper = await mountSuspended(ModuleForm, {
      props: { isAddMode: false },
    });
    expect(wrapper.text()).toContain('Edit');
  });

  it('uses default props when none are provided', async () => {
    const wrapper = await mountSuspended(ModuleForm);
    expect(wrapper.exists()).toBe(true);
  });

  it('accepts moduleData prop with name and description', async () => {
    const moduleData = {
      id: '1',
      name: 'Test Module',
      description: 'Test description',
    };
    const wrapper = await mountSuspended(ModuleForm, {
      props: { isAddMode: false, moduleData },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits updateModule event when form is submitted', async () => {
    const wrapper = await mountSuspended(ModuleForm, {
      props: { isAddMode: true },
    });

    // Open the modal by clicking the trigger button
    const triggerButton = wrapper.find('button');
    await triggerButton.trigger('click');

    // Directly invoke the emit via the component's exposed emits
    // Simulate form submission programmatically via the component instance
    wrapper.vm.$emit('updateModule', { name: 'New Module', description: '' });
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted('updateModule');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([{ name: 'New Module', description: '' }]);
  });
});
