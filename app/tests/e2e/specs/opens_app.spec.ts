import { test, expect } from '@playwright/test';
import {
  setupAnimationSpies,
  setupMatchMediaStub,
  expectAnimationPlayCount,
  expectAnimationAnimateCount,
  resetAnimationPlay,
  resetAnimationAnimate,
} from '../helpers';

test.describe("马丽 opens the app to the home screen's list of units", () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const instructionsOverlay = '[data-test="instructions-overlay"]';
  const homeButton = '[data-test="home-button"]';
  const toggleInstructionsButton = '[data-test="toggle-instructions-button"]';
  const unitsList = '[data-test="unit-list"]';

  test(
    'Displays start-up splash animation, ' +
      'then "introductions explainer" graphic, ' +
      'then units list',
    async ({ page }) => {
      await setupAnimationSpies(page);
      await setupMatchMediaStub(page);
      await page.goto('/');

      // Once Seedlingo is ready, a screen with an animation indicating the
      // expectation that 马丽 should tap an interactive icon is displayed.
      await expect(page.locator(loader)).not.toBeVisible();
      await expect(page.locator(app)).toBeVisible();
      await expect(page.locator(instructionsExplainerComponent)).toBeVisible();
      await expect(page.locator(homeButton)).toHaveClass(/button-disabled/);

      // The "toggle instructions" button pulses to invite interaction.
      await expect(page.locator(toggleInstructionsButton)).toBeVisible();
      // 1 toggle instructions button pulse played
      await expectAnimationPlayCount(page, 1);
      await resetAnimationPlay(page);
      // 1 toggle instructions button pulse created
      await expectAnimationAnimateCount(page, 1);
      await resetAnimationAnimate(page);

      // A short auto-played audio clip invites 马丽 to tap the "toggle
      // instructions" button.
      await page.waitForTimeout(400);
      const isPausedExplainer = await page
        .locator(`${instructionsExplainerComponent} audio`)
        .evaluate((el: HTMLAudioElement) => el.paused);
      expect(isPausedExplainer).toBe(false);

      // When 马丽 taps the icon, an overlay highlighting elements with
      // attached instructions is displayed over the Home screen.
      await expect(page.locator(instructionsOverlay)).not.toBeAttached();
      await page.locator(toggleInstructionsButton).click();
      await expect(
        page.locator(instructionsExplainerComponent),
      ).not.toBeAttached();
      await expect(page.locator(homeButton)).not.toHaveClass(/button-disabled/);
      await expect(page.locator(instructionsOverlay)).toBeAttached();
      await expect(page.locator(unitsList)).toBeAttached();

      // An audio clip plays explaining how tapping the icon is the way to get
      // help or instructions throughout Seedlingo.
      const isPausedToggle = await page
        .locator(`${toggleInstructionsButton} audio`)
        .evaluate((el: HTMLAudioElement) => el.paused);
      expect(isPausedToggle).toBe(false);

      // 马丽 taps one of the buttons with instructions, the instructional audio
      // is played and Seedlingo's home page is displayed when done.
      await page.locator(homeButton).click();
      const isPausedHome = await page
        .locator(`${homeButton} audio`)
        .evaluate((el: HTMLAudioElement) => el.paused);
      expect(isPausedHome).toBe(false);
      // Dispatch the ended event immediately rather than waiting for the
      // ~4.4 s audio file to finish naturally.
      await page
        .locator(`${homeButton} audio`)
        .evaluate((el: HTMLAudioElement) =>
          el.dispatchEvent(new Event('ended')),
        );
      // Overlay should auto-hide when the ended event fires
      await expect(page.locator(instructionsOverlay)).not.toBeAttached();
    },
  );
});
