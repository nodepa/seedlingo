const firstHighlightColor = 'rgb(103, 58, 183)'; // deep-purple
const secondHighlightColor = 'rgb(233, 30, 99)'; // pink
const thirdHighlightColor = 'rgb(255, 152, 0)'; // orange
const fourthHighlightColor = 'rgb(0, 150, 136)'; // teal
const errorColor = 'rgb(255, 82, 82)'; // error
const symColor = 'rgb(25, 118, 210)'; // primary
const charColor = 'rgb(245, 245, 245)'; // default

describe('马丽 interacts with the "matching" system', () => {
  it(
    'Displays the matching screen with ' +
      '4 "character" cards and 4 "symbol" cards',
    () => {
      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 sees**');
      cy.log('-- 4 *symbol* buttons');
      cy.log('-- 4 corresponding *character* buttons');
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
      // 1: answer1 '2'
      // 2: answer2 术
      // 3: answer3 二
      // 4: answer4 '4'
      // 5: answer5 '🌴'
      // 6: answer6 'dice 3'
      // 7: answer7 三
      // 8: answer8 四
      cy.get('[data-test="answer-1-button"]')
        .as('answer1')
        .should('be.visible');
      cy.get('[data-test="answer-2-button"]')
        .as('answer2')
        .should('be.visible')
        .then((el) => {
          cy.contains('术').should('match', el);
        });
      cy.get('[data-test="answer-3-button"]')
        .as('answer3')
        .should('be.visible')
        .then((el) => {
          cy.contains('二').should('match', el);
        });
      cy.get('[data-test="answer-4-button"]')
        .as('answer4')
        .should('be.visible');
      cy.get('[data-test="answer-5-button"]')
        .as('answer5')
        .should('be.visible');
      cy.get('[data-test="answer-6-button"]')
        .as('answer6')
        .should('be.visible');
      cy.get('[data-test="answer-7-button"]')
        .as('answer7')
        .should('be.visible')
        .then((el) => {
          cy.contains('三').should('match', el);
        });
      cy.get('[data-test="answer-8-button"]')
        .as('answer8')
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
      cy.log('**2. 马丽 taps a *character* button**');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log('-- sees the button is highlighted/colored');
      cy.get('@answer2')
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
        '-- ~~sees the *symbol* button colored in a different color to the *character* button~~',
      );
      cy.log('-- sees both highlighted buttons buzz and turn red');
      cy.log('-- sees both buttons return to normal, i.e. not highlighted');
      // both went red
      cy.get('@answer1') // numeric 2
        .click()
        .should('have.css', 'background-color', errorColor);
      cy.get('@answer2').should('have.css', 'background-color', errorColor);
      // then both reverted to original color
      cy.get('@answer1') // numeric 2
        .should('have.css', 'background-color', symColor);
      cy.get('@answer2').should('have.css', 'background-color', charColor);
      // the button's audio was played
      cy.get('@audio.play').should('have.callCount', 2); // 1 + 1
      cy.get('@animation.play').should('have.callCount', 0); // 0 + 0
      // 2 ripples animated on 1 audio playing + 2 answer buttons buzzing
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
      cy.get('@answer1') // numeric 2
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
      cy.get('@answer4') // numeric 4
        .click()
        .should('have.css', 'background-color', secondHighlightColor);
      cy.get('@answer1') // numeric 2
        .should('have.css', 'background-color', symColor);
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
      cy.log('**6. 马丽 taps the corresponding *character* button**');
      cy.log('-- hears corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.log(
        '-- sees button colored **same** as corresponding *symbol* button',
      );
      cy.log('-- sees both highlighted buttons turn the **same** color');
      cy.log('-- sees highlighted pair **reorder** before unmatched buttons');
      cy.get('@answer8') // 四
        .click();
      // A successful match re-orders the buttons: `answer8` is now `answer2`
      cy.get('@answer8') // 三
        .should('have.css', 'background-color', charColor);
      cy.get('@answer2') // 四
        .should('have.css', 'background-color', secondHighlightColor);
      // answer4 and answer8 are reordered as first 2 of answer buttons
      cy.get('[data-test|="answer"]').then((els) => {
        cy.get('@answer1').should('match', els[0]);
        cy.get('@answer2')
          .should('match', els[1])
          .find('p')
          .should('have.text', ' 四 ');
        // cy.get('@answer4').should('match', els[3]);
        // cy.get('@answer8').should('match', els[7]);
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
      cy.log('**7. 马丽 taps either matched *symbol* and *character* button**');
      cy.log('-- hears (one) corresponding audio');
      cy.log('-- sees a ripple animation on the button until audio ends');
      cy.get('@answer2') // 四
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
      cy.get('@answer3') // 2
        .should('have.css', 'background-color', symColor)
        .click()
        .should('have.css', 'background-color', thirdHighlightColor);
      cy.get('@answer1') // 4, already matched
        .should('have.css', 'background-color', secondHighlightColor)
        .click()
        .should('have.css', 'background-color', secondHighlightColor);
      cy.get('@answer3') // 2
        .should('have.css', 'background-color', symColor); // reset to normal
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
      cy.log('-- correct characters with symbols');
      cy.log('-- symbols with characters');
      cy.log('-- until all are correctly matched');
      cy.log('-- **then** sees **fireworks** or a big **smiley** cover screen');
      cy.log('-- sees the screen transition to the next exercise');
      cy.get('@answer3') // 2
        .click()
        .should('have.css', 'background-color', thirdHighlightColor);
      cy.get('@answer5') // 二
        .click();
      cy.get('@answer4') // 二, re-ordered
        .should('have.css', 'background-color', thirdHighlightColor);
      cy.get('@answer5') // 术
        .click()
        .should('have.css', 'background-color', fourthHighlightColor);
      cy.get('@answer6') // 🌴
        .click()
        .should('have.css', 'background-color', fourthHighlightColor);
      cy.get('@answer7') // 3
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

      cy.get('@answer8') // 三
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
