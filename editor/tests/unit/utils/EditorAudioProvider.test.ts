// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { createAudioFromBase64 } from '../../../utils/EditorAudioProvider';

// Minimal valid base64 MP3 (just enough bytes for the Audio constructor to
// accept without throwing; actual playback is not exercised in unit tests).
const FAKE_BASE64 = 'AAAA';

describe('createAudioFromBase64', () => {
  describe('silent stub (no audio data)', () => {
    it('returns an ExerciseAudio with playing = false', () => {
      const audio = createAudioFromBase64(null);
      expect(audio.playing).toBe(false);
    });

    it('play() is a no-op and does not change playing', () => {
      const audio = createAudioFromBase64(undefined);
      audio.play();
      expect(audio.playing).toBe(false);
    });

    it('cancel() is a no-op and does not change playing', () => {
      const audio = createAudioFromBase64('');
      audio.cancel();
      expect(audio.playing).toBe(false);
    });

    it('el is an HTMLAudioElement', () => {
      const audio = createAudioFromBase64(null);
      expect(audio.el).toBeInstanceOf(HTMLAudioElement);
    });
  });

  describe('real audio (base64 data provided)', () => {
    it('returns an ExerciseAudio with playing = false initially', () => {
      const audio = createAudioFromBase64(FAKE_BASE64);
      expect(audio.playing).toBe(false);
    });

    it('el src is set to a data URI with the correct prefix', () => {
      const audio = createAudioFromBase64(FAKE_BASE64);
      expect(audio.el.src).toContain('data:audio/mpeg;base64,');
      expect(audio.el.src).toContain(FAKE_BASE64);
    });

    it('el is an HTMLAudioElement', () => {
      const audio = createAudioFromBase64(FAKE_BASE64);
      expect(audio.el).toBeInstanceOf(HTMLAudioElement);
    });

    it('sets playing = true when the "play" DOM event fires', () => {
      const audio = createAudioFromBase64(FAKE_BASE64);
      audio.el.dispatchEvent(new Event('play'));
      expect(audio.playing).toBe(true);
    });

    it('sets playing = false when the "ended" DOM event fires', () => {
      const audio = createAudioFromBase64(FAKE_BASE64);
      audio.el.dispatchEvent(new Event('play'));
      audio.el.dispatchEvent(new Event('ended'));
      expect(audio.playing).toBe(false);
    });

    it('sets playing = false when the "pause" DOM event fires', () => {
      const audio = createAudioFromBase64(FAKE_BASE64);
      audio.el.dispatchEvent(new Event('play'));
      audio.el.dispatchEvent(new Event('pause'));
      expect(audio.playing).toBe(false);
    });

    it('cancel() pauses the element and sets playing = false', () => {
      const audio = createAudioFromBase64(FAKE_BASE64);
      const pauseSpy = vi.spyOn(audio.el, 'pause');
      audio.el.dispatchEvent(new Event('play'));
      expect(audio.playing).toBe(true);

      audio.cancel();

      expect(pauseSpy).toHaveBeenCalled();
      expect(audio.el.currentTime).toBe(0);
      expect(audio.playing).toBe(false);
    });

    it('play() calls el.play() when not already playing', () => {
      const audio = createAudioFromBase64(FAKE_BASE64);
      const playSpy = vi.spyOn(audio.el, 'play').mockResolvedValue(undefined);

      audio.play();

      expect(playSpy).toHaveBeenCalled();
    });

    it('play() is a no-op when already playing', () => {
      const audio = createAudioFromBase64(FAKE_BASE64);
      const playSpy = vi.spyOn(audio.el, 'play').mockResolvedValue(undefined);

      audio.el.dispatchEvent(new Event('play')); // set playing = true
      audio.play();

      expect(playSpy).not.toHaveBeenCalled();
    });

    it('play() silently handles a rejected el.play() promise', async () => {
      const audio = createAudioFromBase64(FAKE_BASE64);
      vi.spyOn(audio.el, 'play').mockRejectedValue(
        new Error('NotAllowedError'),
      );

      // Should not throw
      audio.play();

      // Let the rejection handler run
      await Promise.resolve();
      expect(audio.playing).toBe(false);
    });
  });
});
