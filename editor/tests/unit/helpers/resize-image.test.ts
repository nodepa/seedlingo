// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { resizeImage } from '../../../helpers/resize-image';

describe('resizeImage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns non-image files unchanged', async () => {
    const file = new File(['text content'], 'document.txt', {
      type: 'text/plain',
    });
    const result = await resizeImage(file, 1);
    expect(result).toBe(file);
  });

  it('returns PDF files unchanged', async () => {
    const content = new Uint8Array(100);
    const file = new File([content], 'document.pdf', {
      type: 'application/pdf',
    });
    const result = await resizeImage(file, 1);
    expect(result).toBe(file);
  });

  it('returns small image files without resizing', async () => {
    // 500 bytes - well under 1 MB limit
    const smallContent = new Uint8Array(500);
    const file = new File([smallContent], 'small.jpg', { type: 'image/jpeg' });
    const result = await resizeImage(file, 1);
    expect(result).toBe(file);
  });

  it('returns image files under a custom size limit unchanged', async () => {
    // 200 bytes - under 0.5 MB limit
    const content = new Uint8Array(200);
    const file = new File([content], 'tiny.png', { type: 'image/png' });
    const result = await resizeImage(file, 0.5);
    expect(result).toBe(file);
  });

  it('uses the default 1 MB limit when no limit is specified', async () => {
    const content = new Uint8Array(500);
    const file = new File([content], 'image.png', { type: 'image/png' });
    const result = await resizeImage(file);
    expect(result).toBe(file);
  });

  it('rejects when FileReader fails to read the file', async () => {
    const largeContent = new Uint8Array(2 * 1024 * 1024); // 2 MB
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });

    const originalFileReader = globalThis.FileReader;

    // Mock FileReader to immediately trigger onerror
    class MockFileReader {
      onload: ((e: ProgressEvent<FileReader>) => void) | null = null;
      onerror: ((e: ProgressEvent<FileReader>) => void) | null = null;
      readAsDataURL(_blob: Blob) {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror({} as ProgressEvent<FileReader>);
          }
        }, 0);
      }
    }

    (globalThis as Record<string, unknown>).FileReader = MockFileReader;

    await expect(resizeImage(file, 1)).rejects.toThrow('Failed to read file');

    (globalThis as Record<string, unknown>).FileReader = originalFileReader;
  });

  it('rejects when the image fails to load', async () => {
    const largeContent = new Uint8Array(2 * 1024 * 1024); // 2 MB
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });

    const originalFileReader = globalThis.FileReader;
    const originalImage = globalThis.Image;

    // Mock Image to immediately trigger onerror
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_value: string) {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror();
          }
        }, 0);
      }
    }

    // Mock FileReader to trigger onload with a fake data URL
    class MockFileReader {
      onload: ((e: ProgressEvent<FileReader>) => void) | null = null;
      onerror: ((e: ProgressEvent<FileReader>) => void) | null = null;
      readAsDataURL(_blob: Blob) {
        (globalThis as Record<string, unknown>).Image = MockImage;
        setTimeout(() => {
          if (this.onload) {
            this.onload({
              target: { result: 'data:image/jpeg;base64,mockdata' },
            } as unknown as ProgressEvent<FileReader>);
          }
        }, 0);
      }
    }

    (globalThis as Record<string, unknown>).FileReader = MockFileReader;

    await expect(resizeImage(file, 1)).rejects.toThrow('Failed to load image');

    (globalThis as Record<string, unknown>).FileReader = originalFileReader;
    (globalThis as Record<string, unknown>).Image = originalImage;
  });
});
