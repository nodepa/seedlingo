const firstHighlightColor = 'rgb(103, 58, 183)'; // deep-purple
const secondHighlightColor = 'rgb(233, 30, 99)'; // pink
const thirdHighlightColor = 'rgb(255, 152, 0)'; // orange
const fourthHighlightColor = 'rgb(0, 150, 136)'; // teal
const errorColor = 'rgb(255, 82, 82)'; // error
const wordColor = 'rgb(245, 245, 245)'; // default
const nonWordColor = 'rgb(25, 118, 210)'; // primary

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
          cy.spy(window.Animation.prototype, 'cancel').as('animation.cancel');
        },
      });
      cy.get('[data-test="loader"]').should('not.be.visible');
      cy.get('[data-test="app"]').should('be.visible');
      cy.get('[data-test="get-instructions-component"]').should(
        'not.be.visible',
      );

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
        .then((el) => {
          cy.contains('术').should('match', el);
        });
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible')
        .then((el) => {
          cy.contains('二').should('match', el);
        });
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
        .then((el) => {
          cy.contains('三').should('match', el);
        });
      cy.get('[data-test="option-button-8"]')
        .as('option8')
        .should('be.visible')
        .then((el) => {
          cy.contains('四').should('match', el);
        });
      // 1 ani.animate called: 1 toggle-instructions
      cy.get('@animation.animate').should('have.callCount', 1);
      // 0 ani.cancel called:
      cy.get('@animation.cancel').should('have.callCount', 0);
      // 0 audio.play called:
      cy.get('@audio.play').should('have.callCount', 0);
      // 0 animation.play called (ani created on first play, no repeats)
      cy.get('@animation.play').should('have.callCount', 0);

      // *****
      // * 2 *
      // *****
      cy.log('**2. 马丽 taps a *word* button**');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log('-- sees the button is highlighted/colored');
      cy.get('@option2')
        .click()
        .should('have.css', 'background-color', firstHighlightColor);
      // .then((el) => {
      //   cy.wrap(el).should(
      //     'have.css',
      //     'background-color',
      //     firstHighlightColor,
      //   );
      // expect(el).to.have.css('background-color', firstHighlightColor);
      // });
      cy.get('@audio.play').should('have.callCount', 1); // 0 + 1
      cy.get('@animation.play').should('have.callCount', 0); // 0 + 0
      cy.get('@animation.animate').should('have.callCount', 3); // 1 + 2(*ripple)
      cy.get('@animation.cancel').should('have.callCount', 2); // 0 + 2(*ripple)

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
      // both went red
      cy.get('@option1') // numeric 2
        .click()
        .should('have.css', 'background-color', errorColor);
      cy.get('@option2').should('have.css', 'background-color', errorColor);
      // then both reverted to original color
      cy.get('@option1') // numeric 2
        .should('have.css', 'background-color', nonWordColor);
      cy.get('@option2').should('have.css', 'background-color', wordColor);
      // the button's audio was played
      cy.get('@audio.play').should('have.callCount', 2); // 1 + 1
      cy.get('@animation.play').should('have.callCount', 0); // 0 + 0
      // 2 ripples animated on 1 audio playing + 2 option buttons buzzing
      cy.get('@animation.animate').should('have.callCount', 7); // 3 + 2 + 2
      // 2 ripples canceled on audio ended
      cy.get('@animation.cancel').should('have.callCount', 4); // 2 + 2

      // *****
      // * 4 *
      // *****
      cy.log('**4. 马丽 taps the same *symbol* button again**');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log('-- sees button colored in **same** color as first tap');
      cy.get('@option1') // numeric 2
        .click()
        .should('have.css', 'background-color', firstHighlightColor);
      // the button's audio was played
      cy.get('@audio.play').should('have.callCount', 3); // 2 + 1
      cy.get('@animation.play').should('have.callCount', 2); // 0 + 2
      // no new animations, instead playing pre-created ripples ^^^
      cy.get('@animation.animate').should('have.callCount', 7); // 7 + 0
      // 2 ripples canceled on audio ended
      cy.get('@animation.cancel').should('have.callCount', 6); // 4 + 2

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
        .should('have.css', 'background-color', secondHighlightColor);
      cy.get('@option1') // numeric 2
        .should('have.css', 'background-color', nonWordColor);
      // the button's audio was played
      cy.get('@audio.play').should('have.callCount', 4); // 3 + 1
      // no repeat animations, new button = new animate
      cy.get('@animation.play').should('have.callCount', 2); // 2 + 0
      // new button = 2x animate for ripples
      cy.get('@animation.animate').should('have.callCount', 9); // 7 + 2
      // 2 ripples canceled on audio ended
      cy.get('@animation.cancel').should('have.callCount', 8); // 6 + 2

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
        .click();
      // A successful match re-orders the buttons: `option8` is now `option2`
      cy.get('@option8') // 三
        .should('have.css', 'background-color', wordColor);
      cy.get('@option2') // 四
        .should('have.css', 'background-color', secondHighlightColor);
      // option4 and option8 are reordered as first 2 of option buttons
      cy.get('[data-test|="option"]').then((els) => {
        cy.get('@option1').should('match', els[0]);
        cy.get('@option2')
          .should('match', els[1])
          .find('p')
          .should('have.text', ' 四 ');
        // cy.get('@option4').should('match', els[3]);
        // cy.get('@option8').should('match', els[7]);
      });
      // the button's audio was played
      cy.get('@audio.play').should('have.callCount', 5); // 4 + 1
      // one repeat animation (old button = play(), new button = animate())
      cy.get('@animation.play').should('have.callCount', 4); // 2 + 2
      // old button = 0x animate for ripples
      cy.get('@animation.animate').should('have.callCount', 9); // 9 + 0
      // 2 ripples canceled on audio ended
      cy.get('@animation.cancel').should('have.callCount', 10); // 8 + 2

      // *****
      // * 7 *
      // *****
      cy.log('**7. 马丽 taps either matched *symbol* and *word* button**');
      cy.log('-- hears (one) corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.get('@option2') // 四
        .should('have.css', 'background-color', secondHighlightColor)
        .click()
        .should('have.css', 'background-color', secondHighlightColor);
      // the button's audio was played
      cy.get('@audio.play').should('have.callCount', 6); // 5 + 1
      // repeat animations (same button but new content)
      cy.get('@animation.play').should('have.callCount', 6); // 4 + 2
      // repeat button, only play, no animate
      cy.get('@animation.animate').should('have.callCount', 9); // 9 + 0
      // 2 ripples canceled on audio ended
      cy.get('@animation.cancel').should('have.callCount', 12); // 10 + 2

      cy.log('**7.b) 马丽 taps an unmatched *symbol* button**');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log('-- **then** taps an **already matched** *symbol* button');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log('-- sees the first unmatched *symbol* button return to normal');
      cy.get('@option3') // 2
        .should('have.css', 'background-color', nonWordColor)
        .click()
        .should('have.css', 'background-color', thirdHighlightColor);
      cy.get('@option1') // 4, already matched
        .should('have.css', 'background-color', secondHighlightColor)
        .click()
        .should('have.css', 'background-color', secondHighlightColor);
      cy.get('@option3') // 2
        .should('have.css', 'background-color', nonWordColor); // reset to normal
      // the two buttons' audio was played
      cy.get('@audio.play').should('have.callCount', 8); // 6 + 2
      // two repeat animations on button 1
      cy.get('@animation.play').should('have.callCount', 8); // 6 + 2
      // two new animate on button 3
      cy.get('@animation.animate').should('have.callCount', 11); // 9 + 2
      // 4 ripples canceled on audio ended
      cy.get('@animation.cancel').should('have.callCount', 16); // 12 + 4

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
        .should('have.css', 'background-color', thirdHighlightColor);
      cy.get('@option5') // 二
        .click();
      cy.get('@option4') // 二, re-ordered
        .should('have.css', 'background-color', thirdHighlightColor);
      cy.get('@option5') // 术
        .click()
        .should('have.css', 'background-color', fourthHighlightColor);
      cy.get('@option6') // 🌴
        .click()
        .should('have.css', 'background-color', fourthHighlightColor);
      cy.get('@option7') // 3
        .click()
        .should('have.css', 'background-color', firstHighlightColor);
      // 5 buttons' audio was played
      cy.get('@audio.play').should('have.callCount', 13); // 8 + 5
      // repeat animations
      cy.get('@animation.play').should('have.callCount', 12); // 8 + 4
      // new animation on button 4-7 (4 buttons)
      cy.get('@animation.animate').should('have.callCount', 17); // 11 + 6
      // 8 ripples canceled on audio ended
      cy.get('@animation.cancel').should('have.callCount', 26); // 16 + 10
      cy.get('[data-test="continue-button"]').should('not.be.visible');

      cy.get('@option8') // 三
        .click()
        .should('have.css', 'background-color', firstHighlightColor);
      // 1 buttons' audio was played
      cy.get('@audio.play').should('have.callCount', 14); // 13 + 1
      // no repeat animations
      cy.get('@animation.play').should('have.callCount', 12); // 12 + 0
      // new animations on button 8 and on continueButton
      cy.get('@animation.animate').should('have.callCount', 20); // 17 + 3
      // 2 ripples canceled on audio ended
      cy.get('@animation.cancel').should('have.callCount', 28); // 26 + 2

      // celebration state
      cy.get('[data-test="continue-button"]').should('be.visible');
    },
  );
});

describe('马丽 interacts with the "matching explanation" system', () => {
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
      cy.visit('/lesson/matching-explanation-test', {
        onBeforeLoad(window) {
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.HTMLElement.prototype, 'animate').as(
            'animation.animate',
          );
          cy.spy(window.Animation.prototype, 'cancel').as('animation.cancel');
        },
      });
      cy.get('[data-test="loader"]').should('not.be.visible');
      cy.get('[data-test="app"]').should('be.visible');
      cy.get('[data-test="get-instructions-component"]').should(
        'not.be.visible',
      );

      // Expected test-data:
      // 0: option1 五减二
      // 1: option2 四
      // 2: option3 三
      // 3: option4 二加二
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible')
        .then((el) => {
          cy.contains('五减二').should('match', el);
        });
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible')
        .then((el) => {
          cy.contains('四').should('match', el);
        });
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible')
        .then((el) => {
          cy.contains('三').should('match', el);
        });
      cy.get('[data-test="option-button-4"]')
        .as('option4')
        .should('be.visible')
        .then((el) => {
          cy.contains('二加二').should('match', el);
        });
      // 1 ani.animate called: 1 toggle-instructions
      cy.get('@animation.animate').should('have.callCount', 1);
      // 0 ani.cancel called:
      cy.get('@animation.cancel').should('have.callCount', 0);
      // 0 audio.play called:
      cy.get('@audio.play').should('have.callCount', 0);
      // 0 animation.play called (ani created on first play, no repeats)
      cy.get('@animation.play').should('have.callCount', 0);

      // *****
      // * 2 *
      // *****
      // cy.log('**2. 马丽 taps a *word* button**');
      // cy.log('-- hears corresponding audio');
      // cy.log('-- sees a ripple animation on the button until audio ends');
      // cy.log('-- sees the button is highlighted/colored');
      // cy.get('@option2')
      //   .click()
      //   .should('have.css', 'background-color', firstHighlightColor);
    },
  );
});
