import { test, expect } from '@playwright/test';
import {
  setupAudioSpy,
  setupAnimationSpies,
  setupMatchMediaStub,
  removeServiceWorker,
  skipInstructionsExplainer,
  expectAudioPlayCount,
  expectAnimationPlayCount,
  expectAnimationAnimateCount,
  resetAudioPlay,
  resetAnimationPlay,
  resetAnimationAnimate,
} from '../helpers';

test.describe('马丽 interacts with the "cloze" system', () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const continueButton = '[data-test="continue-button"]';
  const sentenceCard = '[data-test="sentence-card"]';
  const sentenceBlank = '[data-test="sentence-word-3"]';
  const transparentBackground = 'rgba(0, 0, 0, 0)';

  test.beforeEach(async ({ page }) => {
    // Avoid dealing with "instructions explainer" side effects.
    await skipInstructionsExplainer(page);
  });

  test(
    'Displays the single-cloze screen with ' +
      'a sentence with a blank for a missing word and 4 "word" cards',
    async ({ page }) => {
      // *****
      // * 1 *
      // *****
      // 马丽 sees a sentence with a blank for a missing word,
      // -- sees a list of words from the same unit,
      //    of which 1 word is the missing word, and
      // -- sees 3 words that are unsuitable substitutes.
      await removeServiceWorker(page);
      await setupAudioSpy(page);
      await setupAnimationSpies(page);
      await setupMatchMediaStub(page);
      await page.goto('/unit/single-cloze-test');

      await expect(page.locator(loader)).not.toBeVisible();
      await expect(page.locator(app)).toBeVisible();
      await expect(
        page.locator(instructionsExplainerComponent),
      ).not.toBeAttached();

      // Expected test-data:
      // 0: option1 术
      // 1: option2 两 (correct option)
      // 2: option3 二
      // 3: option4 五减二
      await expect(page.locator('[data-test="option-button-1"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-1"]')).toContainText(
        '术',
      );
      await expect(page.locator('[data-test="option-button-2"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-2"]')).toContainText(
        '两',
      );
      await expect(page.locator('[data-test="option-button-3"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-3"]')).toContainText(
        '二',
      );
      await expect(page.locator('[data-test="option-button-4"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-4"]')).toContainText(
        '五减二',
      );
      await expect(page.locator(sentenceCard)).toBeVisible();
      await expect(page.locator(sentenceCard)).toContainText(
        '我有 个弟弟，不过没有别的兄弟姐妹。',
      );
      await expect(page.locator(continueButton)).not.toBeAttached();

      // *****
      // * 2 *
      // *****
      // 马丽 taps an incorrect word, and
      // -- sees the word turn red, buzz and become inactive.
      await expectAudioPlayCount(page, 0);
      await expectAnimationPlayCount(page, 0);
      await expectAnimationAnimateCount(page, 0);
      await page.locator('[data-test="option-button-1"]').click();
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        /ion-color-danger/,
      );
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        /button-disabled/,
      );

      // 1 item audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 1 button buzz
      await expectAnimationAnimateCount(page, 3);
      await resetAnimationAnimate(page);

      // *****
      // * 3 *
      // *****
      // 马丽 taps the correct word,
      // -- sees the blank space reveal the correct character,
      //    on a green background
      // -- sees all selectable options become disabled, and
      // -- sees the continue button become visible.
      await page.locator('[data-test="option-button-2"]').click();
      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        /ion-color-success/,
      );
      await expect(
        page.locator('[data-test="option-button-2"]'),
      ).not.toHaveClass(/button-disabled/);
      await expect(page.locator(sentenceCard)).toContainText(
        '我有两个弟弟，不过没有别的兄弟姐妹。',
      );
      await expect(page.locator(sentenceBlank)).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        /button-disabled/,
      );
      await expect(page.locator('[data-test="option-button-3"]')).toHaveClass(
        /button-disabled/,
      );
      await expect(page.locator('[data-test="option-button-4"]')).toHaveClass(
        /button-disabled/,
      );
      await expect(page.locator(continueButton)).toBeVisible();

      // 1 item audio plays
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played + 1 continue pulse
      await expectAnimationPlayCount(page, 3);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 1 continue pulse, 0 buzz
      await expectAnimationAnimateCount(page, 3);
      await resetAnimationAnimate(page);
    },
  );

  test(
    'Displays the multi-cloze screen with ' +
      'a sentence with four blanks for missing words and 4 "word" cards',
    async ({ page }) => {
      // Test sentence: 我[有][两]个弟弟，不过[没有]别的[兄弟姐妹]。

      // *****
      // * 1 *
      // *****
      // 马丽 sees a sentence with four blanks for missing words,
      // -- sees a "list" of words matching the number of blanks in the sentence.
      await removeServiceWorker(page);
      await setupAudioSpy(page);
      await setupAnimationSpies(page);
      await setupMatchMediaStub(page);
      await page.goto('/unit/multi-cloze-test');

      await expect(page.locator(loader)).not.toBeVisible();
      await expect(page.locator(app)).toBeVisible();
      await expect(
        page.locator(instructionsExplainerComponent),
      ).not.toBeAttached();

      // Expected test-data:
      // 0: option1 兄弟姐妹
      // 1: option2 两
      // 2: option3 没有
      // 3: option4 有
      await expect(page.locator('[data-test="option-button-1"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-1"]')).toContainText(
        '兄弟姐妹',
      );
      await expect(page.locator('[data-test="option-button-2"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-2"]')).toContainText(
        '两',
      );
      await expect(page.locator('[data-test="option-button-3"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-3"]')).toContainText(
        '没有',
      );
      await expect(page.locator('[data-test="option-button-4"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-4"]')).toContainText(
        '有',
      );
      await expect(page.locator(sentenceCard)).toBeVisible();
      await expect(page.locator(sentenceCard)).toContainText(
        '我 个弟弟，不过 别的 。',
      );
      await expect(page.locator(continueButton)).not.toBeAttached();

      // *****
      // * 2 *
      // *****
      // 马丽 does not hear auto-played audio of the sentence.

      // 0 item audio plays
      await expectAudioPlayCount(page, 0);
      // 0 audio ripples played, 0 buzz
      await expectAnimationPlayCount(page, 0);
      // 0 audio ripples created, 0 buzz
      await expectAnimationAnimateCount(page, 0);

      // *****
      // * 3 *
      // *****
      // 马丽 taps the *incorrect* option for the first blank, and
      // -- sees the word turn red and buzz
      // -- hears the word's audio
      // -- sees the word return to original state.
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        /ion-color-primary/,
      );
      await expect(
        page.locator('[data-test="option-button-1"]'),
      ).not.toHaveClass(/ion-color-danger/);

      expect(
        await page
          .locator('[data-test="option-button-1"]')
          .getAttribute('color'),
      ).toBe('primary');

      await page.locator('[data-test="option-button-1"]').click();
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        /ion-color-danger/,
      );
      expect(
        await page
          .locator('[data-test="option-button-1"]')
          .getAttribute('color'),
      ).toBe('danger');

      // item returns to normal
      await expect(
        page.locator('[data-test="option-button-1"]'),
      ).not.toHaveClass(/button-disabled/);
      await expect(
        page.locator('[data-test="option-button-1"]'),
      ).not.toHaveClass(/ion-color-danger/);
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        /ion-color-primary/,
      );

      // 1 audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 1 buzz
      await expectAnimationAnimateCount(page, 3);
      await resetAnimationAnimate(page);

      // *****
      // * 4 *
      // *****
      // 马丽 taps a *correct* option for the first blank, and
      // -- sees the word button become disabled (no buzz)
      // -- sees the first blank in the sentence reveal the word in green
      // -- hears the word's audio
      await page.locator('[data-test="option-button-4"]').click();
      await expect(page.locator('[data-test="option-button-4"]')).toHaveClass(
        /button-disabled/,
      );
      await expect(page.locator('[data-test="sentence-word-2"]')).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(page.locator('[data-test="sentence-word-2"]')).toContainText(
        '有',
      );

      // 1 audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 0 buzz
      await expectAnimationAnimateCount(page, 2);
      await resetAnimationAnimate(page);

      // *****
      // * 5 *
      // *****
      // Test sentence: 我[有][两]个弟弟，不过[没有]别的[兄弟姐妹]。
      // 马丽 taps elements of the sentence
      // -- hears a non-blank word's audio
      // -- hears a revealed blank-word's audio
      // -- hears a unrevealed blank's corresponding audio
      // -- hears no audio for punctuation

      // non-blank word
      await expect(page.locator('[data-test="sentence-word-1"]')).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(page.locator('[data-test="sentence-word-1"]')).toContainText(
        '我',
      );
      await page.locator('[data-test="sentence-word-1"]').click();
      // 1 audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 0 buzz
      await expectAnimationAnimateCount(page, 2);
      await resetAnimationAnimate(page);

      // revealed blank-word
      await expect(page.locator('[data-test="sentence-word-2"]')).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(page.locator('[data-test="sentence-word-2"]')).toContainText(
        '有',
      );
      await page.locator('[data-test="sentence-word-2"]').click();
      // 1 audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 0 buzz
      await expectAnimationAnimateCount(page, 2);
      await resetAnimationAnimate(page);

      // unrevealed blank plays no audio until revealed
      await expect(page.locator('[data-test="sentence-word-3"]')).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(
        page.locator('[data-test="sentence-word-3"]'),
      ).not.toContainText('两');
      await page.locator('[data-test="sentence-word-3"]').click();
      // 0 audio played
      await expectAudioPlayCount(page, 0);
      // 0 audio ripples played
      await expectAnimationPlayCount(page, 0);
      // 0 audio ripples created + 0 buzz
      await expectAnimationAnimateCount(page, 0);

      // no audio for punctuation
      await expect(page.locator('[data-test="sentence-word-5"]')).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(
        page.locator('[data-test="sentence-word-5-punctuation"]'),
      ).toContainText('，');
      await page.locator('[data-test="sentence-word-5-punctuation"]').click();
      await expect(
        page
          .locator('[data-test="sentence-word-5-punctuation"]')
          .locator('.ripple'),
      ).toHaveCount(0);
      // 0 audio played
      await expectAudioPlayCount(page, 0);
      // 0 audio ripples played
      await expectAnimationPlayCount(page, 0);
      // 0 audio ripples created + 0 buzz
      await expectAnimationAnimateCount(page, 0);

      // *****
      // * 6 *
      // *****
      // 马丽 taps the *correct* option for the second blank, and
      // -- sees the word button become disabled (no buzz)
      // -- sees the second blank in the sentence reveal the word in green
      // -- hears the word's audio
      await expect(page.locator('[data-test="sentence-word-3"]')).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(
        page.locator('[data-test="sentence-word-3"]'),
      ).not.toContainText('两');
      await page.locator('[data-test="option-button-2"]').click();
      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        /button-disabled/,
      );
      await expect(page.locator('[data-test="sentence-word-3"]')).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(page.locator('[data-test="sentence-word-3"]')).toContainText(
        '两',
      );

      // 1 audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 0 buzz
      await expectAnimationAnimateCount(page, 2);
      await resetAnimationAnimate(page);

      // *****
      // * 7 *
      // *****
      // 马丽 taps the *correct* option for the third blank, and
      // -- sees the word button become disabled (no buzz)
      // -- sees the third blank in the sentence reveal the word in green
      // -- hears the word's audio
      await expect(page.locator('[data-test="sentence-word-8"]')).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(
        page.locator('[data-test="sentence-word-8"]'),
      ).not.toContainText('没有');
      await page.locator('[data-test="option-button-3"]').click();
      await expect(page.locator('[data-test="option-button-3"]')).toHaveClass(
        /button-disabled/,
      );
      await expect(page.locator('[data-test="sentence-word-8"]')).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(page.locator('[data-test="sentence-word-8"]')).toContainText(
        '没有',
      );

      // 1 audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 0 buzz
      await expectAnimationAnimateCount(page, 2);
      await resetAnimationAnimate(page);

      // *****
      // * 8 *
      // *****
      // 马丽 taps the *correct* option for the last blank, and
      // -- sees the word button become disabled (no buzz)
      // -- sees the last blank in the sentence reveal the word in green
      // -- hears the word's audio
      // -- sees the continue button visible and flashing
      await expect(page.locator('[data-test="sentence-word-10"]')).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(
        page.locator('[data-test="sentence-word-10"]'),
      ).not.toContainText('兄弟姐妹');
      await page.locator('[data-test="option-button-1"]').click();
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        /button-disabled/,
      );
      await expect(page.locator('[data-test="sentence-word-10"]')).toHaveCSS(
        'background-color',
        transparentBackground,
      );
      await expect(
        page.locator('[data-test="sentence-word-10"]'),
      ).toContainText('兄弟姐妹');
      await expect(page.locator(continueButton)).toBeVisible();

      // 1 audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played + 1 continue pulse
      await expectAnimationPlayCount(page, 3);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 0 buzz + 1 continue pulse
      await expectAnimationAnimateCount(page, 3);
      await resetAnimationAnimate(page);
    },
  );
});
