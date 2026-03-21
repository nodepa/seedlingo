import { test, expect } from '@playwright/test';
import {
  setupAudioSpy,
  setupMatchMediaStub,
  suppressAbortErrors,
  expectAudioPlayCount,
  resetAudioPlay,
} from '../helpers';

test.describe('马丽 interacts with the "instructions" system', () => {
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const instructionsOverlay = '[data-test="instructions-overlay"]';
  const homeButton = '[data-test="home-button"]';
  const toggleInstructionsButton = '[data-test="toggle-instructions-button"]';

  test.beforeEach(async ({ page }) => {
    // Suppress AbortError thrown when audio.play() is interrupted by pause()
    // (e.g. when instructions audio is playing and the user clicks the toggle button).
    await suppressAbortErrors(page);
  });

  test(
    'Displays the instructions mode with audio elements,' +
      'overlay and background shading',
    async ({ page }) => {
      // 马丽 arrives at the instructions overlay
      await setupAudioSpy(page);
      await setupMatchMediaStub(page);
      await page.goto('/');

      await expect(page.locator(instructionsOverlay)).not.toBeAttached();
      await expect(page.locator(instructionsExplainerComponent)).toBeVisible();
      await page.locator(toggleInstructionsButton).click();
      await expect(
        page.locator(instructionsExplainerComponent),
      ).not.toBeAttached();
      await expect(page.locator(instructionsOverlay)).toBeAttached();
      await expect(page.locator(homeButton)).not.toHaveClass(/button-disabled/);
      await expect(page.locator(homeButton).locator('.badge')).toBeAttached();
      await expect(page.locator(homeButton).locator('.badge')).toBeVisible();

      // 1 audio played on first load
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      await page.locator(homeButton).click();
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);

      await page.locator(toggleInstructionsButton).click();
      await expect(page.locator(instructionsOverlay)).not.toBeAttached();
      await expect(
        page.locator(homeButton).locator('.badge'),
      ).not.toBeAttached();

      await page.locator(toggleInstructionsButton).click();
      await expect(page.locator(instructionsOverlay)).toBeAttached();
    },
  );
});
