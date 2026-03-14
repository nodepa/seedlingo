import { describe, expect, it } from 'vitest';
import calcFontSize from '@/common/utils/CalcFontSize';

describe('calcFontSize()', () => {
  describe('without shrinkThreshold', () => {
    it('returns clamp with max size for a single short character', () => {
      // stepSize = (2.5 - 1) / 10 = 0.15
      // longestWord = '二' (length 1)
      // middle = maxSize + stepSize - 1 * stepSize = 2.5 + 0.15 - 0.15 = 2.5
      const result = calcFontSize(2.5, 1, 10, 'rem', '二');
      expect(result).toBe('clamp(1rem, 2.5rem, 2.5rem)');
    });

    it('returns clamp with reduced middle value for longer words', () => {
      // stepSize = (2.5 - 1) / 10 = 0.15
      // longestWord = 'hello' (length 5)
      // middle = 2.5 + 0.15 - 5 * 0.15 = 2.5 + 0.15 - 0.75 = 1.9
      const result = calcFontSize(2.5, 1, 10, 'rem', 'hello');
      expect(result).toBe('clamp(1rem, 1.9rem, 2.5rem)');
    });

    it('uses the longest word when text has multiple words separated by spaces', () => {
      // longestWord = 'longer' (length 6)
      // stepSize = (2.5 - 1) / 10 = 0.15
      // middle = 2.5 + 0.15 - 6 * 0.15 = 1.75
      const result = calcFontSize(2.5, 1, 10, 'rem', 'a longer text');
      expect(result).toBe('clamp(1rem, 1.75rem, 2.5rem)');
    });

    it('splits on hyphens as well as spaces', () => {
      // longestWord = 'longest' (length 7)
      // stepSize = (2.5 - 1) / 10 = 0.15
      // middle = 2.5 + 0.15 - 7 * 0.15 ≈ 1.6 (floating-point)
      const result = calcFontSize(2.5, 1, 10, 'rem', 'a-longest-word');
      expect(result).toMatch(/^clamp\(1rem, 1\.5999[^,]+rem, 2\.5rem\)$/);
    });

    it('supports different units', () => {
      // stepSize = (20 - 10) / 10 = 1
      // longestWord = 'hi' (length 2)
      // middle = 20 + 1 - 2 * 1 = 19
      const result = calcFontSize(20, 10, 10, 'px', 'hi');
      expect(result).toBe('clamp(10px, 19px, 20px)');
    });
  });

  describe('with shrinkThreshold', () => {
    it('returns plain maxSize when word is at or below threshold', () => {
      // longestWord = 'ab' (length 2), threshold = 3
      // 3 < 2 is false => return maxSize + unit
      const result = calcFontSize(2.5, 1, 10, 'rem', 'ab', 3);
      expect(result).toBe('2.5rem');
    });

    it('returns plain maxSize when word length equals threshold', () => {
      // longestWord = 'abc' (length 3), threshold = 3
      // 3 < 3 is false => return maxSize + unit
      const result = calcFontSize(2.5, 1, 10, 'rem', 'abc', 3);
      expect(result).toBe('2.5rem');
    });

    it('returns clamp when word is longer than threshold', () => {
      // longestWord = 'abcde' (length 5), threshold = 3
      // stepSize = (2.5 - 1) / 10 = 0.15
      // middle = 2.5 - (5 - 3) * 0.15 = 2.5 - 0.3 = 2.2
      const result = calcFontSize(2.5, 1, 10, 'rem', 'abcde', 3);
      expect(result).toBe('clamp(1rem, 2.2rem, 2.5rem)');
    });

    it('uses the longest word when text has multiple words with a threshold', () => {
      // longestWord = 'longest' (length 7), threshold = 5
      // stepSize = (2.5 - 1) / 10 = 0.15
      // middle = 2.5 - (7 - 5) * 0.15 = 2.5 - 0.3 = 2.2
      const result = calcFontSize(2.5, 1, 10, 'rem', 'a longest word', 5);
      expect(result).toBe('clamp(1rem, 2.2rem, 2.5rem)');
    });
  });
});
