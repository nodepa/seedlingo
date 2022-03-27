const app = '[data-test="app"]';
const loader = '[data-test="loader"]';
const instructionsExplainerComponent =
  '[data-test="instructions-explainer-component"]';
const continueButton = '[data-test="continue-button"]';
const toggleInstructionsButton = '[data-test="toggle-instructions-button"]';
const firstHighlightColor = 'ion-color-purple'; // 'rgb(103, 58, 183)';
const secondHighlightColor = 'ion-color-pink'; // 'rgb(233, 30, 99)';
const thirdHighlightColor = 'ion-color-orange'; // 'rgb(255, 152, 0)';
const fourthHighlightColor = 'ion-color-teal'; // 'rgb(0, 150, 136)';
const errorColor = 'ion-color-danger'; // 'rgb(229, 115, 115)';
const wordColor = 'ion-color-primary'; // 'rgb(25, 118, 210)';
const nonWordColor = 'ion-color-card'; // 'rgb(255, 255, 255)'; // default

describe('马丽 interacts with the "matching" system', () => {
  it(
    'Displays the matching screen with ' +
      '4 "word" cards and 4 "symbol" cards',
    () => {
      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 sees**');
      cy.log('-- 4 *symbol* buttons');
      cy.log('-- 4 corresponding *word* buttons');
      cy.visit('/lesson/matching-test', {
        onBeforeLoad(window) {
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.HTMLElement.prototype, 'animate').as(
            'animation.animate',
          );
          // avoid dark mode
          cy.stub(window, 'matchMedia', () => {
            return {
              matches: false,
              addEventListener() {
                /**/
              },
            };
          });
        },
      });
      cy.get(loader).should('not.be.visible');
      cy.get(app).should('be.visible');
      cy.get(instructionsExplainerComponent).should('not.exist');
      cy.get(toggleInstructionsButton).should('exist').should('be.visible');

      // Expected test-data:
      // 0: option1 '2'
      // 1: option2 术
      // 2: option3 二
      // 3: option4 '4'
      // 4: option5 '🌴'
      // 5: option6 'dice 3'
      // 6: option7 三
      // 7: option8 四
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible');
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible')
        .should('contain', '术');
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible')
        .should('contain', '二');
      cy.get('[data-test="option-button-4"]')
        .as('option4')
        .should('be.visible');
      cy.get('[data-test="option-button-5"]')
        .as('option5')
        .should('be.visible');
      cy.get('[data-test="option-button-6"]')
        .as('option6')
        .should('be.visible');
      cy.get('[data-test="option-button-7"]')
        .as('option7')
        .should('be.visible')
        .should('contain', '三');
      cy.get('[data-test="option-button-8"]')
        .as('option8')
        .should('be.visible')
        .should('contain', '四');
      // 0 item audio played
      cy.get('@audio.play').should('have.callCount', 0);
      // 0 audio ripples played
      cy.get('@animation.play').should('have.callCount', 0);
      // 0 audio ripples created
      cy.get('@animation.animate').should('have.callCount', 0);

      // *****
      // * 2 *
      // *****
      cy.log('**2. 马丽 taps a *word* button**');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log('-- sees the button is highlighted/colored');
      cy.get('@option2')
        .should('have.class', wordColor)
        .click()
        .should('have.class', firstHighlightColor);
      // 1 item audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 0 button buzz
      cy.get('@animation.animate').should('have.callCount', 2);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 3 *
      // *****
      cy.log('**3. 马丽 taps a *non-corresponding* *symbol* button**');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log(
        '-- ~~sees the *symbol* button colored in a different color to the *word* button~~',
      );
      cy.log('-- sees both highlighted buttons buzz and turn red');
      cy.log('-- sees both buttons return to normal, i.e. not highlighted');
      // both go red
      cy.get('@option1') // numeric 2
        .click()
        .wait(20)
        .should('have.class', errorColor);
      cy.get('@option2').should('have.class', errorColor);
      // then both revert to original color
      cy.get('@option1') // numeric 2
        .should('have.class', nonWordColor);
      cy.get('@option2').should('have.class', wordColor);
      // 1 item audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played + 0 buzz
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 2 button buzz
      cy.get('@animation.animate').should('have.callCount', 4);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 4 *
      // *****
      cy.log('**4. 马丽 taps the same *symbol* button again**');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log('-- sees button colored in **same** color as first tap');
      cy.get('@option1') // numeric 2
        .click()
        .should('have.class', firstHighlightColor);
      // 1 item audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played + 0 buzz
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 0 button buzz
      cy.get('@animation.animate').should('have.callCount', 2);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 5 *
      // *****
      cy.log('**5. 马丽 taps another *symbol* button**');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log('-- sees the button colored in **different** color to last tap');
      cy.log('-- sees the previously tapped *symbol* button return to normal');
      cy.log('-- sees most recently tapped *symbol* button remain highlighted');
      cy.get('@option4') // numeric 4
        .click()
        .should('have.class', secondHighlightColor);
      cy.get('@option1') // numeric 2
        .should('have.class', nonWordColor);
      // 1 item audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played + 0 buzz
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 0 button buzz
      cy.get('@animation.animate').should('have.callCount', 2);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 6 *
      // *****
      cy.log('**6. 马丽 taps the corresponding *word* button**');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log(
        '-- sees button colored **same** as corresponding *symbol* button',
      );
      cy.log('-- sees both highlighted buttons turn the **same** color');
      cy.log('-- sees highlighted pair **reorder** before unmatched buttons');
      cy.get('@option8') // 四
        .should('contain', '四')
        .click();
      cy.get('@option2') // 四 reordered
        .should('contain', '四')
        .should('have.class', secondHighlightColor);
      // A successful match re-orders the buttons: `option8` is now `option2`
      cy.get('@option8') // 三
        .should('contain', '三')
        .should('have.class', wordColor);
      cy.get('@option2') // 四
        .should('contain', '四')
        .should('have.class', secondHighlightColor);
      // option4 and option8 are reordered as first 2 of option buttons
      cy.get('[data-test|="option"]').then((elements) => {
        cy.get('@option1').should('match', elements[0]);
        cy.get('@option2')
          .should('match', elements[1])
          .find('p')
          .should('have.text', '四');
      });
      // 1 item audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played + 0 buzz
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 0 button buzz
      cy.get('@animation.animate').should('have.callCount', 2);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 7 *
      // *****
      cy.log('**7. 马丽 taps either matched *symbol* and *word* button**');
      cy.log('-- hears (one) corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.get('@option2') // 四
        .should('have.class', secondHighlightColor)
        .click()
        .should('have.class', secondHighlightColor);
      // 1 item audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played + 0 buzz
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 0 button buzz
      cy.get('@animation.animate').should('have.callCount', 2);
      cy.get('@animation.animate').invoke('resetHistory');

      cy.log('**7.b) 马丽 taps an unmatched *symbol* button**');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log('-- **then** taps an **already matched** *symbol* button');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log('-- sees the first unmatched *symbol* button return to normal');
      cy.get('@option3') // 2
        .should('have.class', nonWordColor)
        .click()
        .should('have.class', thirdHighlightColor);
      cy.get('@option1') // 4, already matched
        .should('have.class', secondHighlightColor)
        .click()
        .should('have.class', secondHighlightColor);
      cy.get('@option3') // 2
        .should('have.class', nonWordColor); // reset to normal
      // 1 item audio played
      cy.get('@audio.play').should('have.callCount', 2);
      cy.get('@audio.play').invoke('resetHistory');
      // 4 audio ripples played + 0 buzz
      cy.get('@animation.play').should('have.callCount', 4);
      cy.get('@animation.play').invoke('resetHistory');
      // 4 audio ripples created + 0 button buzz
      cy.get('@animation.animate').should('have.callCount', 4);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 8 *
      // *****
      cy.log('**8. 马丽 repeats matching**');
      cy.log('-- correct words with symbols');
      cy.log('-- symbols with words');
      cy.log('-- until all are correctly matched');
      cy.log('-- **then** sees **fireworks** or a big **smiley** cover screen');
      cy.log('-- sees the screen transition to the next exercise');
      cy.get('@option3') // 2
        .click()
        .should('have.class', thirdHighlightColor);
      cy.get('@option5') // 二
        .click();
      cy.get('@option4') // 二, re-ordered
        .should('have.class', thirdHighlightColor);
      cy.get('@option5') // 术
        .click()
        .should('have.class', fourthHighlightColor);
      cy.get('@option6') // 🌴
        .click()
        .should('have.class', fourthHighlightColor);
      cy.get('@option7') // 3
        .click()
        .should('have.class', firstHighlightColor);
      // 5 item audio played
      cy.get('@audio.play').should('have.callCount', 5);
      cy.get('@audio.play').invoke('resetHistory');
      // 10 audio ripples played + 0 buzz
      cy.get('@animation.play').should('have.callCount', 10);
      cy.get('@animation.play').invoke('resetHistory');
      // 10 audio ripples created + 0 button buzz
      cy.get('@animation.animate').should('have.callCount', 10);
      cy.get('@animation.animate').invoke('resetHistory');

      cy.get(continueButton).should('not.exist');

      cy.get('@option8') // 三
        .click()
        .should('have.class', firstHighlightColor);
      // 1 item audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played + 1 continue pulse
      cy.get('@animation.play').should('have.callCount', 3);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 1 continue pulse
      cy.get('@animation.animate').should('have.callCount', 3);
      cy.get('@animation.animate').invoke('resetHistory');

      // celebration state
      cy.get(continueButton).should('be.visible');
    },
  );
});

describe('马丽 interacts with the "explanation matching" system', () => {
  it(
    'Displays the matching screen with ' +
      '2 "word" cards and 2 "explanation" cards',
    () => {
      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 sees**');
      cy.log('-- 2 *explanation* buttons');
      cy.log('-- 2 corresponding *word* buttons');
      cy.visit('/lesson/explanation-matching-test', {
        onBeforeLoad(window) {
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.HTMLElement.prototype, 'animate').as(
            'animation.animate',
          );
          // avoid dark mode
          cy.stub(window, 'matchMedia', () => {
            return {
              matches: false,
              addEventListener() {
                /**/
              },
            };
          });
        },
      });
      cy.get(loader).should('not.be.visible');
      cy.get(app).should('be.visible');
      cy.get(instructionsExplainerComponent).should('not.exist');

      // Expected test-data:
      // 0: option1 五减二
      // 1: option2 四
      // 2: option3 三
      // 3: option4 二加二
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible')
        .should('contain', '五减二');
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible')
        .should('contain', '四');
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible')
        .should('contain', '三');
      cy.get('[data-test="option-button-4"]')
        .as('option4')
        .should('be.visible')
        .should('contain', '二加二');
      // 0 item audio played
      cy.get('@audio.play').should('have.callCount', 0);
      cy.get('@audio.play').invoke('resetHistory');
      // 0 audio ripples played + 1 continue pulse
      cy.get('@animation.play').should('have.callCount', 0);
      cy.get('@animation.play').invoke('resetHistory');
      // 0 audio ripples created + 1 continue pulse
      cy.get('@animation.animate').should('have.callCount', 0);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 2 *
      // *****
      // cy.log('**2. 马丽 taps a *word* button**');
      // cy.log('-- hears corresponding audio');
      // cy.log('-- sees a ripple animation on the button until audio ends');
      // cy.log('-- sees the button is highlighted/colored');
      // cy.get('@option2')
      //   .click()
      //   .should('have.class', firstHighlightColor);
    },
  );
});
