import { test, expect } from '@playwright/test';
import {
  setupAudioSpy,
  setupAnimationSpies,
  setupMatchMediaStub,
  skipInstructionsExplainer,
  expectAudioPlayCount,
  expectAnimationPlayCount,
  expectAnimationAnimateCount,
  resetAudioPlay,
  resetAnimationPlay,
  resetAnimationAnimate,
} from '../helpers';

test.describe('马丽 interacts with the "review" system', () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const continueButton = '[data-test="continue-button"]';

  test.beforeEach(async ({ page }) => {
    // Avoid dealing with "instructions explainer" side effects.
    await skipInstructionsExplainer(page);
  });

  test('Displays the review screen with a word and the corresponding symbol', async ({
    page,
  }) => {
    // *****
    // * 1 *
    // *****
    // 马丽
    // -- sees a symbol representing the word
    // -- sees the word itself
    // -- hears the pronunciation of the word
    await setupAudioSpy(page);
    await setupAnimationSpies(page);
    await setupMatchMediaStub(page);
    await page.goto('/unit/1/review');

    await expect(page.locator(loader)).not.toBeVisible();
    await expect(page.locator(app)).toBeVisible();
    await expect(
      page.locator(instructionsExplainerComponent),
    ).not.toBeAttached();
    await expect(page.locator('[data-test="review-picture"]')).toBeAttached();
    await expect(page.locator('[data-test="review-picture"]')).toBeVisible();
    await expect(page.locator('[data-test="review-word"]')).toBeVisible();
    await expect(page.locator('[data-test="review-word"]')).toContainText(
      /一|one/,
    );
    await expect(page.locator(continueButton)).toBeAttached();
    await expect(page.locator(continueButton)).toBeVisible();

    // 1 word audio played
    await expectAudioPlayCount(page, 1);
    await resetAudioPlay(page);
    // 2 audio ripples created + 1 continue button pulse
    await expectAnimationAnimateCount(page, 3);
    await resetAnimationAnimate(page);
    // 2 audio ripples played + 1 continue button pulse
    await expectAnimationPlayCount(page, 3);
    await resetAnimationPlay(page);

    // *****
    // * 2 *
    // *****
    // 马丽 taps the word button, and
    // -- hears the pronunciation of the word again
    await expectAudioPlayCount(page, 0);
    await expectAnimationPlayCount(page, 0);
    await expectAnimationAnimateCount(page, 0);
    await page.locator('[data-test="review-word"]').click();
    // 1 word audio played
    await expectAudioPlayCount(page, 1);
    await resetAudioPlay(page);
    // 2 audio ripples created
    await expectAnimationAnimateCount(page, 2);
    await resetAnimationAnimate(page);
    // 2 audio ripples played
    await expectAnimationPlayCount(page, 2);
    await resetAnimationPlay(page);

    // *****
    // * 3 *
    // *****
    // 马丽 taps the continue button, and
    // -- sees a new icon and word
    // -- hears the pronunciation of the new word
    await expectAudioPlayCount(page, 0);
    await expectAnimationPlayCount(page, 0);
    await expectAnimationAnimateCount(page, 0);
    await page.locator(continueButton).click();
    await expect(page.locator('[data-test="review-word"]')).toBeVisible();
    await expect(page.locator('[data-test="review-word"]')).toContainText(
      /二|two/,
    );
    // 1 word audio played
    await expectAudioPlayCount(page, 1);
    await resetAudioPlay(page);
    // 2 audio ripples created
    await expectAnimationAnimateCount(page, 2);
    await resetAnimationAnimate(page);
    // 2 audio ripples played
    await expectAnimationPlayCount(page, 2);
    await resetAnimationPlay(page);
    await expect(page.locator(continueButton)).toBeAttached();
    await expect(page.locator(continueButton)).toBeVisible();
  });
});
