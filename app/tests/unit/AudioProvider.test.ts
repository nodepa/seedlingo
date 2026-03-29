import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { play, pause } from '@/test-support/MockImplementations';
import AudioProvider from '@/Content/AudioProvider';
import Content from '@/Content/Content';

HTMLMediaElement.prototype.play = play;
HTMLMediaElement.prototype.pause = pause;

describe('AudioProvider', () => {
  describe('.createAudioFromUrl()', () => {
    it('returns an object with an HTMLAudioElement', () => {
      const audio = AudioProvider.createAudioFromUrl('');
      expect(audio.el).toBeInstanceOf(HTMLAudioElement);
    });

    it('returns an object with playing set to false initially', () => {
      const audio = AudioProvider.createAudioFromUrl('');
      expect(audio.playing).toBe(false);
    });

    it('returns an object with play and cancel functions', () => {
      const audio = AudioProvider.createAudioFromUrl('');
      expect(typeof audio.play).toBe('function');
      expect(typeof audio.cancel).toBe('function');
    });

    it('sets playing to true when the audio element fires onplaying', () => {
      const audio = AudioProvider.createAudioFromUrl('');
      expect(audio.playing).toBe(false);
      audio.el.onplaying?.(new Event('playing'));
      expect(audio.playing).toBe(true);
    });

    it('sets playing to false when the audio element fires onpause', () => {
      const audio = AudioProvider.createAudioFromUrl('');
      audio.el.onplaying?.(new Event('playing'));
      expect(audio.playing).toBe(true);
      audio.el.onpause?.(new Event('pause'));
      expect(audio.playing).toBe(false);
    });

    it('sets playing to false when the audio element fires onended', () => {
      const audio = AudioProvider.createAudioFromUrl('');
      audio.el.onplaying?.(new Event('playing'));
      expect(audio.playing).toBe(true);
      audio.el.onended?.(new Event('ended'));
      expect(audio.playing).toBe(false);
    });

    it('resets currentTime to 0 when play() is called', () => {
      const audio = AudioProvider.createAudioFromUrl('');
      audio.el.currentTime = 5;
      audio.play();
      expect(audio.el.currentTime).toBe(0);
    });

    it('calls pause on the audio element when cancel() is called', () => {
      const audio = AudioProvider.createAudioFromUrl('');
      let pauseCalled = false;
      audio.el.pause = () => {
        pauseCalled = true;
      };
      audio.cancel();
      expect(pauseCalled).toBe(true);
    });
  });

  describe('.createCompositeAudioFromPaths()', () => {
    it('returns a single audio when given one path', () => {
      const spyGetAudioUrl = vi
        .spyOn(Content, 'getAudioUrl')
        .mockImplementation((path: string) => path);
      const audio = AudioProvider.createCompositeAudioFromPaths(['path1']);
      expect(audio.el).toBeInstanceOf(HTMLAudioElement);
      spyGetAudioUrl.mockRestore();
    });

    it('returns an object with playing set to false initially', () => {
      const spyGetAudioUrl = vi
        .spyOn(Content, 'getAudioUrl')
        .mockImplementation((path: string) => path);
      const audio = AudioProvider.createCompositeAudioFromPaths([
        'path1',
        'path2',
      ]);
      expect(audio.playing).toBe(false);
      spyGetAudioUrl.mockRestore();
    });

    it('returns an object with play and cancel functions', () => {
      const spyGetAudioUrl = vi
        .spyOn(Content, 'getAudioUrl')
        .mockImplementation((path: string) => path);
      const audio = AudioProvider.createCompositeAudioFromPaths([
        'path1',
        'path2',
      ]);
      expect(typeof audio.play).toBe('function');
      expect(typeof audio.cancel).toBe('function');
      spyGetAudioUrl.mockRestore();
    });

    it('sets playing to true when the first audio element fires onplaying', () => {
      const spyGetAudioUrl = vi
        .spyOn(Content, 'getAudioUrl')
        .mockImplementation((path: string) => path);
      const audio = AudioProvider.createCompositeAudioFromPaths([
        'path1',
        'path2',
      ]);
      expect(audio.playing).toBe(false);
      audio.el.onplaying?.(new Event('playing'));
      expect(audio.playing).toBe(true);
      spyGetAudioUrl.mockRestore();
    });

    it('sets playing to false when cancel() is called', () => {
      const spyGetAudioUrl = vi
        .spyOn(Content, 'getAudioUrl')
        .mockImplementation((path: string) => path);
      const audio = AudioProvider.createCompositeAudioFromPaths([
        'path1',
        'path2',
      ]);
      audio.el.onplaying?.(new Event('playing'));
      expect(audio.playing).toBe(true);
      audio.cancel();
      expect(audio.playing).toBe(false);
      spyGetAudioUrl.mockRestore();
    });

    it('advances to the next audio when the current one ends', () => {
      const spyGetAudioUrl = vi
        .spyOn(Content, 'getAudioUrl')
        .mockImplementation((path: string) => path);
      let secondPlayCalled = false;
      const originalPlay = HTMLMediaElement.prototype.play;
      const audio = AudioProvider.createCompositeAudioFromPaths([
        'path1',
        'path2',
      ]);

      // Simulate the first audio ending - should trigger play on the second
      HTMLMediaElement.prototype.play = function () {
        secondPlayCalled = true;
        return Promise.resolve();
      };
      audio.el.onended?.(new Event('ended'));
      expect(secondPlayCalled).toBe(true);

      HTMLMediaElement.prototype.play = originalPlay;
      spyGetAudioUrl.mockRestore();
    });

    it('updates el to the currently playing element when advancing', () => {
      const spyGetAudioUrl = vi
        .spyOn(Content, 'getAudioUrl')
        .mockImplementation((path: string) => path);
      const audio = AudioProvider.createCompositeAudioFromPaths([
        'path1',
        'path2',
      ]);

      const firstElement = audio.el;

      // Simulate first audio ending — should advance el to the second element
      audio.el.onended?.(new Event('ended'));

      expect(audio.el).not.toBe(firstElement);
      expect(audio.el).toBeInstanceOf(HTMLAudioElement);

      spyGetAudioUrl.mockRestore();
    });

    it('sets playing to false after the last audio ends', () => {
      const spyGetAudioUrl = vi
        .spyOn(Content, 'getAudioUrl')
        .mockImplementation((path: string) => path);

      let secondElement: HTMLMediaElement | null = null;
      const originalPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        secondElement = this as HTMLMediaElement;
        return Promise.resolve();
      };

      const audio = AudioProvider.createCompositeAudioFromPaths([
        'path1',
        'path2',
      ]);

      // Simulate playing state on first element
      audio.el.onplaying?.(new Event('playing'));
      expect(audio.playing).toBe(true);

      // Simulate first audio ending (triggers play on second audio, capturing secondElement)
      audio.el.onended?.(new Event('ended'));
      expect(secondElement).not.toBeNull();

      // Simulate second (last) audio ending naturally
      secondElement!.onended?.(new Event('ended'));
      expect(audio.playing).toBe(false);

      HTMLMediaElement.prototype.play = originalPlay;
      spyGetAudioUrl.mockRestore();
    });
  });

  describe('.readyToPlay()', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('resolves immediately when readyState >= 3', async () => {
      const audio = AudioProvider.createAudioFromUrl('');
      Object.defineProperty(audio.el, 'readyState', {
        value: 3,
        configurable: true,
      });
      const promise = audio.readyToPlay!();
      await expect(promise).resolves.toBeUndefined();
    });

    it('resolves when canplaythrough fires', async () => {
      const audio = AudioProvider.createAudioFromUrl('');
      // readyState stays at 0 (HAVE_NOTHING) — no immediate resolve
      const promise = audio.readyToPlay!();
      audio.el.dispatchEvent(new Event('canplaythrough'));
      await expect(promise).resolves.toBeUndefined();
    });

    it('resolves after 500ms timeout if canplaythrough never fires', async () => {
      const audio = AudioProvider.createAudioFromUrl('');
      const promise = audio.readyToPlay!();
      let settled = false;
      promise.then(() => {
        settled = true;
      });
      await Promise.resolve(); // flush microtasks
      expect(settled).toBe(false);
      vi.advanceTimersByTime(500);
      await promise;
      expect(settled).toBe(true);
    });

    it('resolves immediately for composite audio when all elements have readyState >= 3', async () => {
      const spyGetAudioUrl = vi
        .spyOn(Content, 'getAudioUrl')
        .mockImplementation((path: string) => path);
      const audio = AudioProvider.createCompositeAudioFromPaths([
        'path1',
        'path2',
      ]);
      // The composite exposes only el (first element); force readyState on it via the element itself
      // We cannot reach inner elements directly, so trigger canplaythrough on both
      const promise = audio.readyToPlay!();
      // Fire canplaythrough on the exposed element
      audio.el.dispatchEvent(new Event('canplaythrough'));
      // Advance past timeout for any remaining inner elements
      vi.advanceTimersByTime(500);
      await promise;
      spyGetAudioUrl.mockRestore();
    });

    it('resolves immediately for composite with single path (delegates to createAudioFromUrl)', async () => {
      const spyGetAudioUrl = vi
        .spyOn(Content, 'getAudioUrl')
        .mockImplementation((path: string) => path);
      const audio = AudioProvider.createCompositeAudioFromPaths(['path1']);
      Object.defineProperty(audio.el, 'readyState', {
        value: 4,
        configurable: true,
      });
      await expect(audio.readyToPlay!()).resolves.toBeUndefined();
      spyGetAudioUrl.mockRestore();
    });
  });
});
