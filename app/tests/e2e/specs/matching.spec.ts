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

test.describe('马丽 interacts with the "matching" system', () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const continueButton = '[data-test="continue-button"]';
  const toggleInstructionsButton = '[data-test="toggle-instructions-button"]';
  const firstHighlightColor = 'ion-color-purple';
  const secondHighlightColor = 'ion-color-pink';
  const thirdHighlightColor = 'ion-color-orange';
  const fourthHighlightColor = 'ion-color-teal';
  const errorColor = 'ion-color-danger';
  const wordColor = 'ion-color-primary';
  const nonWordColor = 'ion-color-card';

  test.beforeEach(async ({ page }) => {
    await skipInstructionsExplainer(page);
  });

  test(
    'Displays the matching screen with ' +
      '4 "word" cards and 4 "symbol" cards',
    async ({ page }) => {
      // *****
      // * 1 *
      // *****
      // 马丽 sees
      // -- 4 *symbol* buttons
      // -- 4 corresponding *word* buttons
      await removeServiceWorker(page);
      await setupAudioSpy(page);
      await setupAnimationSpies(page);
      await setupMatchMediaStub(page);
      await page.goto('/unit/matching-test');

      await expect(page.locator(loader)).not.toBeVisible();
      await expect(page.locator(app)).toBeVisible();
      await expect(
        page.locator(instructionsExplainerComponent),
      ).not.toBeAttached();
      await expect(page.locator(toggleInstructionsButton)).toBeAttached();
      await expect(page.locator(toggleInstructionsButton)).toBeVisible();

      // Expected test-data:
      // 0: option1 '2'
      // 1: option2 术
      // 2: option3 二
      // 3: option4 '4'
      // 4: option5 '🌴'
      // 5: option6 'dice 3'
      // 6: option7 三
      // 7: option8 四
      await expect(page.locator('[data-test="option-button-1"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-2"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-2"]')).toContainText(
        '术',
      );
      await expect(page.locator('[data-test="option-button-3"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-3"]')).toContainText(
        '二',
      );
      await expect(page.locator('[data-test="option-button-4"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-5"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-6"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-7"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-7"]')).toContainText(
        '三',
      );
      await expect(page.locator('[data-test="option-button-8"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-8"]')).toContainText(
        '四',
      );

      // 0 item audio played
      await expectAudioPlayCount(page, 0);
      // 0 audio ripples played
      await expectAnimationPlayCount(page, 0);
      // 0 audio ripples created
      await expectAnimationAnimateCount(page, 0);

      await page.waitForTimeout(200);

      // *****
      // * 2 *
      // *****
      // 马丽 taps a *word* button
      // -- does not hear corresponding audio
      // -- does not see a ripple animation on the button
      // -- sees the button is highlighted/colored
      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        new RegExp(wordColor),
      );
      await page.locator('[data-test="option-button-2"]').click();
      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        new RegExp(firstHighlightColor),
      );
      // 0 item audio played
      await expectAudioPlayCount(page, 0);
      await resetAudioPlay(page);
      // 0 audio ripples played
      await expectAnimationPlayCount(page, 0);
      await resetAnimationPlay(page);
      // 0 audio ripples created + 0 button buzz
      await expectAnimationAnimateCount(page, 0);
      await resetAnimationAnimate(page);

      await page.waitForTimeout(600);

      // *****
      // * 3 *
      // *****
      // 马丽 taps a *non-corresponding* *symbol* button
      // -- hears corresponding audio
      // -- sees a ripple animation on the button until audio ends
      // -- sees both highlighted buttons buzz and turn red
      // -- sees both buttons return to normal, i.e. not highlighted
      // both go red
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        new RegExp(nonWordColor),
      );
      await page.locator('[data-test="option-button-1"]').click(); // numeric 2
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        new RegExp(errorColor),
      );
      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        new RegExp(errorColor),
      );
      // then both revert to original color
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        new RegExp(nonWordColor),
      );
      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        new RegExp(wordColor),
      );
      // 1 item audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played + 0 buzz
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 2 button buzz
      await expectAnimationAnimateCount(page, 4);
      await resetAnimationAnimate(page);

      await page.waitForTimeout(200);

      // *****
      // * 4 *
      // *****
      // 马丽 taps the same *symbol* button again
      // -- hears corresponding audio
      // -- sees a ripple animation on the button until audio ends
      // -- sees button colored in *same* color as first tap
      await page.locator('[data-test="option-button-1"]').click(); // numeric 2
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        new RegExp(firstHighlightColor),
      );
      // 1 item audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played + 0 buzz
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 0 button buzz
      await expectAnimationAnimateCount(page, 2);
      await resetAnimationAnimate(page);

      await page.waitForTimeout(200);

      // *****
      // * 5 *
      // *****
      // 马丽 taps another *symbol* button
      // -- hears corresponding audio
      // -- sees a ripple animation on the button until audio ends
      // -- sees the button colored in *different* color to last tap
      // -- sees the previously tapped *symbol* button return to normal
      // -- sees most recently tapped *symbol* button remain highlighted
      await page.locator('[data-test="option-button-4"]').click(); // numeric 4
      await expect(page.locator('[data-test="option-button-4"]')).toHaveClass(
        new RegExp(secondHighlightColor),
      );
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        new RegExp(nonWordColor),
      ); // numeric 2 reverts
      // 1 item audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played + 0 buzz
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 0 button buzz
      await expectAnimationAnimateCount(page, 2);
      await resetAnimationAnimate(page);

      await page.waitForTimeout(800);

      // *****
      // * 6 *
      // *****
      // 马丽 taps the corresponding *word* button
      // -- hears corresponding audio
      // -- sees a ripple animation on the button until audio ends
      // -- sees button colored *same* as corresponding *symbol* button
      // -- sees both highlighted buttons turn the *same* color
      // -- sees highlighted pair *reorder* before unmatched buttons
      await page.locator('[data-test="option-button-8"]').click(); // 四
      // A successful match re-orders the buttons: `option8` is now `option2`
      await expect(page.locator('[data-test="option-button-2"]')).toContainText(
        '四',
      );
      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        new RegExp(secondHighlightColor),
      );
      await expect(page.locator('[data-test="option-button-8"]')).toContainText(
        '三',
      );
      await expect(page.locator('[data-test="option-button-8"]')).toHaveClass(
        new RegExp(wordColor),
      );
      // option-button-1 and option-button-2 are the first two elements
      const allOptions = page.locator('[data-test|="option"]');
      await expect(allOptions.nth(0)).toHaveAttribute(
        'data-test',
        'option-button-1',
      );
      await expect(allOptions.nth(1)).toHaveAttribute(
        'data-test',
        'option-button-2',
      );
      await expect(allOptions.nth(1)).toContainText('四');
      // 1 item audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played + 0 buzz
      await expectAnimationPlayCount(page, 2);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 0 button buzz
      await expectAnimationAnimateCount(page, 2);
      await resetAnimationAnimate(page);

      await page.waitForTimeout(200);

      // *****
      // * 7 *
      // *****
      // 马丽 taps both matched *symbol* and *word* button
      // -- hears corresponding audio for both
      // -- sees a ripple animation on the buttons until audio ends
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        new RegExp(secondHighlightColor),
      );
      await page.locator('[data-test="option-button-1"]').click(); // symbol for 四
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        new RegExp(secondHighlightColor),
      );
      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        new RegExp(secondHighlightColor),
      );
      await page.locator('[data-test="option-button-2"]').click(); // 四
      await expect(page.locator('[data-test="option-button-2"]')).toHaveClass(
        new RegExp(secondHighlightColor),
      );
      // 2 item audio played
      await expectAudioPlayCount(page, 2);
      await resetAudioPlay(page);
      // 4 audio ripples played + 0 buzz
      await expectAnimationPlayCount(page, 4);
      await resetAnimationPlay(page);
      // 4 audio ripples created + 0 button buzz
      await expectAnimationAnimateCount(page, 4);
      await resetAnimationAnimate(page);

      // **7.b) 马丽 taps an unmatched *symbol* button**
      // -- hears corresponding audio
      // -- *then* taps an *already matched* *symbol* button
      // -- hears corresponding audio
      // -- sees the first unmatched *symbol* button return to normal
      await expect(page.locator('[data-test="option-button-3"]')).toHaveClass(
        new RegExp(nonWordColor),
      );
      await page.locator('[data-test="option-button-3"]').click(); // '2' symbol
      await expect(page.locator('[data-test="option-button-3"]')).toHaveClass(
        new RegExp(thirdHighlightColor),
      );
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        new RegExp(secondHighlightColor),
      ); // '4', already matched
      await page.locator('[data-test="option-button-1"]').click(); // '4', already matched
      await expect(page.locator('[data-test="option-button-1"]')).toHaveClass(
        new RegExp(secondHighlightColor),
      );
      await expect(page.locator('[data-test="option-button-3"]')).toHaveClass(
        new RegExp(nonWordColor),
      ); // reset to normal
      // 2 item audio played (one for each symbol click)
      await expectAudioPlayCount(page, 2);
      await resetAudioPlay(page);
      // 4 audio ripples played + 0 buzz
      await expectAnimationPlayCount(page, 4);
      await resetAnimationPlay(page);
      // 4 audio ripples created + 0 button buzz
      await expectAnimationAnimateCount(page, 4);
      await resetAnimationAnimate(page);

      await page.waitForTimeout(200);

      // *****
      // * 8 *
      // *****
      // 马丽 repeats matching
      // -- correct words with symbols
      // -- symbols with words
      // -- until all are correctly matched
      // -- *then* sees the continue button available

      // State after first match: option1=matched'4', option2=matched'四',
      // option3='2', option4=术, option5=二, option6='🌴', option7='dice 3', option8=三

      // Match '2' (option3 symbol) with 二 (option5 word)
      await page.locator('[data-test="option-button-3"]').click(); // '2' symbol
      await expect(page.locator('[data-test="option-button-3"]')).toHaveClass(
        new RegExp(thirdHighlightColor),
      );
      await page.locator('[data-test="option-button-5"]').click(); // 二 word
      // After match, 二 reorders to option4
      await expect(page.locator('[data-test="option-button-4"]')).toHaveClass(
        new RegExp(thirdHighlightColor),
      );

      // State: option1=matched'4', option2=matched'四', option3=matched'2',
      // option4=matched'二', option5=术, option6='🌴', option7='dice 3', option8=三

      // Match 术 (option5 word) with 🌴 (option6 symbol)
      await page.locator('[data-test="option-button-5"]').click(); // 术 word (no audio - word first)
      await expect(page.locator('[data-test="option-button-5"]')).toHaveClass(
        new RegExp(fourthHighlightColor),
      );
      await page.locator('[data-test="option-button-6"]').click(); // 🌴 symbol
      await expect(page.locator('[data-test="option-button-6"]')).toHaveClass(
        new RegExp(fourthHighlightColor),
      );

      // State: matched1-6, option7='dice 3', option8=三

      // Highlight 'dice 3' (option7 symbol) for final match
      await page.locator('[data-test="option-button-7"]').click(); // 'dice 3' symbol
      await expect(page.locator('[data-test="option-button-7"]')).toHaveClass(
        new RegExp(firstHighlightColor),
      );

      // 4 item audio played: '2' symbol (1), 🌴 symbol (2), 'dice 3' symbol (3)
      // + 二 word matched (1) = 4 total
      await expectAudioPlayCount(page, 4);
      await resetAudioPlay(page);
      // 8 audio ripples played + 0 buzz (4 audio events × 2 ripples)
      await expectAnimationPlayCount(page, 8);
      await resetAnimationPlay(page);
      // 8 audio ripples created + 0 button buzz
      await expectAnimationAnimateCount(page, 8);
      await resetAnimationAnimate(page);

      await expect(page.locator(continueButton)).not.toBeAttached();

      // Final match: 三 (option8 word) with 'dice 3' (option7 symbol)
      await page.locator('[data-test="option-button-8"]').click(); // 三
      await expect(page.locator('[data-test="option-button-8"]')).toHaveClass(
        new RegExp(firstHighlightColor),
      );
      // 1 item audio played
      await expectAudioPlayCount(page, 1);
      await resetAudioPlay(page);
      // 2 audio ripples played + 1 continue pulse
      await expectAnimationPlayCount(page, 3);
      await resetAnimationPlay(page);
      // 2 audio ripples created + 1 continue pulse
      await expectAnimationAnimateCount(page, 3);
      await resetAnimationAnimate(page);

      // celebration state
      await expect(page.locator(continueButton)).toBeVisible();
    },
  );
});

test.describe('马丽 interacts with the "explanation matching" system', () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';

  test.beforeEach(async ({ page }) => {
    await skipInstructionsExplainer(page);
  });

  test(
    'Displays the matching screen with ' +
      '3 "word" cards and 3 "explanation" cards',
    async ({ page }) => {
      // *****
      // * 1 *
      // *****
      // 马丽 sees
      // -- 3 *explanation* buttons
      // -- 3 corresponding *word* buttons
      await removeServiceWorker(page);
      await setupAudioSpy(page);
      await setupAnimationSpies(page);
      await setupMatchMediaStub(page);
      await page.goto('/unit/explanation-matching-test');

      await expect(page.locator(loader)).not.toBeVisible();
      await expect(page.locator(app)).toBeVisible();
      await expect(
        page.locator(instructionsExplainerComponent),
      ).not.toBeAttached();

      // Expected test-data:
      // 0: option1 My parent's brother
      // 1: option2 四
      // 2: option3 Uncle
      // 3: option4 二加二
      // 4: option5 8*3
      // 5: option6 24
      await expect(page.locator('[data-test="option-button-1"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-1"]')).toContainText(
        "My parent's brother",
      );
      await expect(page.locator('[data-test="option-button-2"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-2"]')).toContainText(
        '四',
      );
      await expect(page.locator('[data-test="option-button-3"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-3"]')).toContainText(
        'Uncle',
      );
      await expect(page.locator('[data-test="option-button-4"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-4"]')).toContainText(
        '二加二',
      );
      await expect(page.locator('[data-test="option-button-5"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-5"]')).toContainText(
        '8*3',
      );
      await expect(page.locator('[data-test="option-button-6"]')).toBeVisible();
      await expect(page.locator('[data-test="option-button-6"]')).toContainText(
        '24',
      );
      // 0 item audio played
      await expectAudioPlayCount(page, 0);
      await resetAudioPlay(page);
      // 0 audio ripples played
      await expectAnimationPlayCount(page, 0);
      await resetAnimationPlay(page);
      // 0 audio ripples created
      await expectAnimationAnimateCount(page, 0);
      await resetAnimationAnimate(page);
    },
  );
});
