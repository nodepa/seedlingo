import { describe, expect, it } from 'vitest';
import { play, pause } from '@/test-support/MockImplementations';
import AudioProvider from '@/Content/AudioProvider';

HTMLMediaElement.prototype.play = play;
HTMLMediaElement.prototype.pause = pause;

describe('AudioProvider', () => {
  describe('.createAudioFromData()', () => {
    it('returns an object with an HTMLAudioElement', () => {
      const audio = AudioProvider.createAudioFromData('');
      expect(audio.el).toBeInstanceOf(HTMLAudioElement);
    });

    it('returns an object with playing set to false initially', () => {
      const audio = AudioProvider.createAudioFromData('');
      expect(audio.playing).toBe(false);
    });

    it('returns an object with play and cancel functions', () => {
      const audio = AudioProvider.createAudioFromData('');
      expect(typeof audio.play).toBe('function');
      expect(typeof audio.cancel).toBe('function');
    });

    it('sets playing to true when the audio element fires onplaying', () => {
      const audio = AudioProvider.createAudioFromData('');
      expect(audio.playing).toBe(false);
      audio.el.onplaying?.(new Event('playing'));
      expect(audio.playing).toBe(true);
    });

    it('sets playing to false when the audio element fires onpause', () => {
      const audio = AudioProvider.createAudioFromData('');
      audio.el.onplaying?.(new Event('playing'));
      expect(audio.playing).toBe(true);
      audio.el.onpause?.(new Event('pause'));
      expect(audio.playing).toBe(false);
    });

    it('sets playing to false when the audio element fires onended', () => {
      const audio = AudioProvider.createAudioFromData('');
      audio.el.onplaying?.(new Event('playing'));
      expect(audio.playing).toBe(true);
      audio.el.onended?.(new Event('ended'));
      expect(audio.playing).toBe(false);
    });

    it('resets currentTime to 0 when play() is called', () => {
      const audio = AudioProvider.createAudioFromData('');
      audio.el.currentTime = 5;
      audio.play();
      expect(audio.el.currentTime).toBe(0);
    });

    it('calls pause on the audio element when cancel() is called', () => {
      const audio = AudioProvider.createAudioFromData('');
      let pauseCalled = false;
      audio.el.pause = () => {
        pauseCalled = true;
      };
      audio.cancel();
      expect(pauseCalled).toBe(true);
    });
  });
});
