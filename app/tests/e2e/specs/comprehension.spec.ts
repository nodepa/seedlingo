import { test, expect } from '@playwright/test';
import {
  setupAudioSpy,
  setupAnimationSpies,
  setupMatchMediaStub,
  removeServiceWorker,
  skipInstructionsExplainer,
  suppressAbortErrors,
  resetAnimationAnimate,
} from '../helpers';

test.describe('马丽 interacts with the "text comprehension" system', () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const continueButton = '[data-test="continue-button"]';
  const sentenceCard = '[data-test="sentence-card"]';

  test.beforeEach(async ({ page }) => {
    // Avoid dealing with "instructions explainer" side effects.
    await skipInstructionsExplainer(page);
    // Suppress AbortError thrown when audio.play() is interrupted by pause()
    // (e.g. when the user selects an option while another audio is still playing).
    await suppressAbortErrors(page);
  });

  test(
    'Displays the ReadText stage with the comprehension text ' +
      'and a continue button',
    async ({ page }) => {
      // *****
      // * 1 *
      // *****
      // 马丽 sees the comprehension text,
      // -- sees a sentence card with the full text,
      // -- sees the continue button to advance to questions.
      await removeServiceWorker(page);
      await setupAudioSpy(page);
      await setupAnimationSpies(page);
      await setupMatchMediaStub(page);
      await page.goto('/unit/comprehension-test');

      await expect(page.locator(loader)).not.toBeVisible();
      await expect(page.locator(app)).toBeVisible();
      await expect(
        page.locator(instructionsExplainerComponent),
      ).not.toBeAttached();

      // The sentence card should be visible with comprehension text
      await expect(page.locator(sentenceCard)).toBeVisible();
      await expect(page.locator(sentenceCard)).toContainText('我');
      await expect(page.locator(sentenceCard)).toContainText('家里');

      // Continue button should appear immediately in ReadText stage
      await expect(page.locator(continueButton)).toBeAttached();
      await expect(page.locator(continueButton)).toBeVisible();
    },
  );

  test(
    'Advances to AnswerQuestions stage and displays questions with options ' +
      'after clicking the continue button from the ReadText stage',
    async ({ page }) => {
      // *****
      // * 1 *
      // *****
      // 马丽 is on the ReadText stage,
      // -- sees the comprehension text and continue button.
      await removeServiceWorker(page);
      await setupAudioSpy(page);
      await setupAnimationSpies(page);
      await setupMatchMediaStub(page);
      await page.goto('/unit/comprehension-test');

      await expect(page.locator(loader)).not.toBeVisible();
      await expect(page.locator(continueButton)).toBeVisible();

      // *****
      // * 2 *
      // *****
      // 马丽 clicks the continue button,
      // -- sees the first question and answer options.
      await page.locator(continueButton).click();

      // In AnswerQuestions stage, the continue button should not be shown
      // until a correct answer is given
      await expect(page.locator(continueButton)).not.toBeAttached();

      // The sentence card should still be visible
      await expect(page.locator(sentenceCard)).toBeVisible();

      // Question options should be visible
      // Test data Q1: 谁是最小的？ options: [我, 姐姐, 大哥, 小哥]
      await expect(page.locator('[data-test="option-button-1"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-1"]')).toContainText(
        '我',
      );
      await expect(page.locator('[data-test="option-button-2"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-2"]')).toContainText(
        '姐姐',
      );
    },
  );

  test(
    'Selects the correct answer for a comprehension question ' +
      'and shows the continue button',
    async ({ page }) => {
      // *****
      // * 1 *
      // *****
      // 马丽 advances past the ReadText stage.
      await removeServiceWorker(page);
      await setupAudioSpy(page);
      await setupAnimationSpies(page);
      await setupMatchMediaStub(page);
      await page.goto('/unit/comprehension-test');

      await expect(page.locator(loader)).not.toBeVisible();
      await page.locator(continueButton).click();

      // *****
      // * 2 *
      // *****
      // 马丽 answers the first question correctly,
      // -- sees the option turn green,
      // -- sees the continue button appear.

      // Test data Q1: 谁是最小的？ correct answer: 我 (option 1)
      await page.locator('[data-test="option-button-1"]').click();

      // Correct option should turn green
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        /ion-color-success/,
      );

      // Continue button should appear after correct answer
      await expect(page.locator(continueButton)).toBeAttached();
      await expect(page.locator(continueButton)).toBeVisible();
    },
  );

  test(
    'Buzzes an incorrect answer for a comprehension question ' +
      'without showing the continue button',
    async ({ page }) => {
      // *****
      // * 1 *
      // *****
      // 马丽 advances past the ReadText stage.
      await removeServiceWorker(page);
      await setupAudioSpy(page);
      await setupAnimationSpies(page);
      await setupMatchMediaStub(page);
      await page.goto('/unit/comprehension-test');

      await expect(page.locator(loader)).not.toBeVisible();
      await page.locator(continueButton).click();

      // *****
      // * 2 *
      // *****
      // 马丽 answers the first question incorrectly,
      // -- sees the option buzz and become disabled,
      // -- does not see the continue button.

      // Wait for the stage transition to AnswerQuestions to complete and the
      // option buttons to be fully rendered, then reset the spy so that only
      // animations from the incorrect-option click are measured.
      await expect(page.locator('[data-test="option-button-1"]')).toBeVisible();
      await resetAnimationAnimate(page);

      // Test data Q1: 谁是最小的？ incorrect answer: 姐姐 (option 2)
      await page.locator('[data-test="option-button-2"]').click();
      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        /button-disabled/,
      );

      // Incorrect option should buzz (and become disabled).
      // The buzz is a 6-keyframe shake animation; other animations (e.g. audio
      // ripples) may also fire on click, so we check for the buzz specifically
      // rather than enforcing an exact total call count.
      const hasBuzz = await page.evaluate(() => {
        type SpyWindow = Window & {
          __spies?: {
            animateKeyframesList?: unknown[][];
          };
        };
        const spyWindow = window as SpyWindow;
        const keyframesList = spyWindow.__spies?.animateKeyframesList ?? [];
        return keyframesList.some(
          (frames) => Array.isArray(frames) && frames.length === 6,
        );
      });
      expect(hasBuzz).toBe(true);
      await resetAnimationAnimate(page);

      // Continue button should not appear after incorrect answer
      await expect(page.locator(continueButton)).not.toBeAttached();
    },
  );
});
