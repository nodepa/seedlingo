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

test.describe('马丽 interacts with the "multiple-choice" system', () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const itemUnderTestButton = '[data-test="item-under-test-button"]';
  const errorColor = 'ion-color-danger';

  test(
    'Displays the multiple-choice screen with ' +
      'vibrating loudspeaker/mouth talking, ' +
      'and 4 selectable options',
    async ({ page }) => {
      // **1. 马丽 sees a vibrating loudspeaker/mouth talking**
      // -- hears the audio of a corresponding word

      // Visit /about first (with serviceWorker deletion) then navigate to the test unit.
      // addInitScript scripts accumulate and run on all future navigations.
      await removeServiceWorker(page);
      await page.goto('/about');
      await page.locator('h1').filter({ hasText: '立爱种字' }).click();

      // Set up spies between the two navigations so they activate on the next goto.
      await setupAudioSpy(page);
      await setupAnimationSpies(page);
      await setupMatchMediaStub(page);
      await page.goto('/unit/multiple-choice-test');

      await expect(page.locator(loader)).not.toBeVisible();
      await expect(page.locator(app)).toBeVisible();
      await expect(
        page.locator(instructionsExplainerComponent),
      ).not.toBeAttached();
      await expect(page.locator(itemUnderTestButton)).toBeVisible();

      // 1 item audio auto-played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 0 button buzz
      await expectAnimationAnimateCount(page, 2);
      await resetAnimationAnimate(page);

      // **2. 马丽 sees 4 words**
      // -- of which one is the correct match to the audio played.
      await expect(page.locator('[data-test="option-button-1"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-2"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-3"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-4"]')).toBeVisible();

      // **3. 马丽 taps the loudspeaker to hear the audio again.**
      // Wait long enough for the first audio (~730 ms) to finish before replaying,
      // otherwise the play() call while audio is already playing would not trigger
      // a playing state change and therefore no new ripple animation.
      await page.waitForTimeout(1500);
      await page.locator(itemUnderTestButton).click();
      // 1 item audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 0 button buzz
      await expectAnimationAnimateCount(page, 2);
      await resetAnimationAnimate(page);

      // **4. 马丽 taps wrong word/non-corresponding word**
      // -- sees the word vibrate, flash red
      // -- hears the audio for the incorrect word
      // -- sees the word become disabled and non-interactive
      // -- hears the "item under test" audio plays again
      await page.locator('[data-test="option-button-1"]').click();
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        new RegExp(errorColor),
      );
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        /button-disabled/,
      );
      // 2 item audio played
      await expectAudioPlayCount(page, 2);
      await resetAudioPlay(page);
      // 4 audio ripples played
      await expectAnimationPlayCount(page, 4);
      await resetAnimationPlay(page);
      // 4 audio ripples created + 1 button buzz
      await expectAnimationAnimateCount(page, 5);
      await resetAnimationAnimate(page);
    },
  );
});

test.describe('马丽 interacts with the "multiple-choice explanation" system', () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const itemUnderTestButton = '[data-test="item-under-test-button"]';
  const errorColor = 'ion-color-danger';
  const successColor = 'ion-color-success';

  test.beforeEach(async ({ page }) => {
    await skipInstructionsExplainer(page);
  });

  test(
    'Displays the multiple-choice screen with ' +
      'an explanation, ' +
      'and 2-4 selectable options',
    async ({ page }) => {
      // **1. 马丽 sees an explanation**
      await removeServiceWorker(page);
      await setupAudioSpy(page);
      await setupAnimationSpies(page);
      await setupMatchMediaStub(page);
      await page.goto('/unit/explanation-multiple-choice-test');

      await expect(page.locator(loader)).not.toBeVisible();
      await expect(page.locator(app)).toBeVisible();
      await expect(
        page.locator(instructionsExplainerComponent),
      ).not.toBeAttached();
      await expect(page.locator(itemUnderTestButton)).toBeVisible();
      await expect(page.locator(itemUnderTestButton)).toContainText(
        "My parent's brother",
      );
      // 0 item audio played
      await expectAudioPlayCount(page, 0);
      // 0 audio ripples played
      await expectAnimationPlayCount(page, 0);
      // 0 audio ripples created + 0 button buzz
      await expectAnimationAnimateCount(page, 0);

      // **2. 马丽 sees 3 words**
      // -- of which one is the correct match to the explanation.
      await expect(page.locator('[data-test="option-button-1"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-1"]')).toContainText(
        'Uncle',
      );
      await expect(page.locator('[data-test="option-button-2"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-2"]')).toContainText(
        'Cousin',
      );
      await expect(page.locator('[data-test="option-button-3"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-3"]')).toContainText(
        'Aunt',
      );
      await expect(page.locator('[data-test="option-button-4"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-4"]')).toContainText(
        'Grandma',
      );
      await expect(
        page.locator('[data-test="option-button-5"]'),
      ).not.toBeAttached();

      // **3. 马丽 taps wrong word/non-corresponding word**
      // -- sees the word vibrate, flash red
      // -- hears the audio for the incorrect word
      // -- sees the word become disabled and non-interactive

      // explanation: My parent's brother
      // option 1: Uncle, option 2: Cousin, option 3: Aunt, option 4: Grandma
      // click incorrect option 2
      await page.locator('[data-test="option-button-2"]').click();
      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        new RegExp(errorColor),
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

      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        /button-disabled/,
      );
      // there's no itemUnderTest audio to play
      await expectAudioPlayCount(page, 0);

      // **4. 马丽 taps correct word/corresponding word**
      // -- sees the word turn green
      // -- hears the audio for the correct word
      // -- sees the other words become disabled and non-interactive
      // -- sees the continue button available
      await expect(
        page.locator('[data-test="continue-button"]'),
      ).not.toBeAttached();
      await page.locator('[data-test="option-button-1"]').click();
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        new RegExp(successColor),
      );
      await expect(page.locator('[data-test="option-button-3"]')).toHaveClass(
        /button-disabled/,
      );
      await expect(page.locator('[data-test="option-button-4"]')).toHaveClass(
        /button-disabled/,
      );
      await expect(page.locator('[data-test="continue-button"]')).toBeVisible();
    },
  );
});
