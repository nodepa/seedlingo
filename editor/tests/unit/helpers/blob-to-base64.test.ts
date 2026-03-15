// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { blobToBase64 } from '../../../helpers/blob-to-base64';

describe('blobToBase64', () => {
  it('resolves with a string', async () => {
    const blob = new Blob(['test content'], { type: 'text/plain' });
    const result = await blobToBase64(blob);
    expect(typeof result).toBe('string');
  });

  it('produces a data URL with the correct MIME type prefix', async () => {
    const blob = new Blob(['Hello, World!'], { type: 'text/plain' });
    const result = await blobToBase64(blob);
    expect(result).toMatch(/^data:text\/plain;base64,/);
  });

  it('correctly encodes blob content as base64', async () => {
    const text = 'test';
    const blob = new Blob([text], { type: 'text/plain' });
    const result = (await blobToBase64(blob)) as string;
    // Extract the base64 part and decode it
    const base64Part = result.split(',')[1]!;
    const decoded = atob(base64Part);
    expect(decoded).toBe(text);
  });

  it('handles an empty blob', async () => {
    const blob = new Blob([], { type: 'text/plain' });
    const result = await blobToBase64(blob);
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^data:text\/plain;base64,/);
  });

  it('handles binary data', async () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const result = await blobToBase64(blob);
    expect(result).toMatch(/^data:application\/octet-stream;base64,/);
  });
});
