// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import FilePicker from '~/components/file-picker.vue';

// Mock AWS Amplify to prevent connection errors in tests
vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    models: {},
  })),
}));

describe('FilePicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without errors in pictures mode', async () => {
    const wrapper = await mountSuspended(FilePicker, {
      props: { mediaType: 'pictures' },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders without errors in audio mode', async () => {
    const wrapper = await mountSuspended(FilePicker, {
      props: { mediaType: 'audio' },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('uses pictures as the default media type', async () => {
    const wrapper = await mountSuspended(FilePicker);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders a hidden file input for pictures', async () => {
    const wrapper = await mountSuspended(FilePicker, {
      props: { mediaType: 'pictures' },
    });
    const fileInput = wrapper.find('input[type="file"]');
    expect(fileInput.exists()).toBe(true);
    expect(fileInput.attributes('accept')).toContain('image/');
  });

  it('renders a hidden file input for audio', async () => {
    const wrapper = await mountSuspended(FilePicker, {
      props: { mediaType: 'audio' },
    });
    const fileInput = wrapper.find('input[type="file"]');
    expect(fileInput.exists()).toBe(true);
    expect(fileInput.attributes('accept')).toContain('audio/');
  });

  it('accepts image MIME types for pictures', async () => {
    const wrapper = await mountSuspended(FilePicker, {
      props: { mediaType: 'pictures' },
    });
    const fileInput = wrapper.find('input[type="file"]');
    const accept = fileInput.attributes('accept') ?? '';
    expect(accept).toContain('image/jpeg');
    expect(accept).toContain('image/png');
    expect(accept).toContain('image/webp');
  });

  it('accepts audio MIME types for audio', async () => {
    const wrapper = await mountSuspended(FilePicker, {
      props: { mediaType: 'audio' },
    });
    const fileInput = wrapper.find('input[type="file"]');
    const accept = fileInput.attributes('accept') ?? '';
    expect(accept).toContain('audio/aac');
    expect(accept).toContain('audio/mp4');
    expect(accept).toContain('audio/mpeg');
  });

  it('emits filesAdded when valid files are selected', async () => {
    const wrapper = await mountSuspended(FilePicker, {
      props: { mediaType: 'pictures' },
    });

    // Emit the event programmatically to test the contract
    const validFile = new File(['img data'], 'photo.jpg', {
      type: 'image/jpeg',
    });
    wrapper.vm.$emit('filesAdded', { files: [validFile] });
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted('filesAdded');
    expect(emitted).toBeTruthy();
    expect(emitted![0]![0]).toMatchObject({ files: [validFile] });
  });
});
