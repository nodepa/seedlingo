const app = '[data-test="app"]';
const loader = '[data-test="loader"]';
const getInstructionComponent = '[data-test="get-instruction-component"]';
const continueButton = '[data-test="continue-button"]';
const sentenceCard = '[data-test="sentence-card"]';
const errorColor = 'rgb(229, 57, 53)';
const successColor = 'rgb(0, 150, 136)';

describe('马丽 interacts with the "cloze" system', () => {
  it(
    'Displays the cloze screen with ' +
      'a sentence with a gap for a missing word and 4 "word" cards',
    () => {
      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 sees a sentence with a gap for a missing word**,');
      cy.log('-- sees an (optional) button to play audio');
      cy.log('&nbsp;&nbsp; (or the sentence or the gap is the button)');
      cy.log('-- sees a list of words (no audio) from the same lesson,');
      cy.log('&nbsp;&nbsp; of which 1 word is the missing word, and');
      cy.log('-- sees 3 words that are unsuitable substitutes.');
      cy.visit('/lesson/cloze-test', {
        onBeforeLoad(window) {
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.HTMLElement.prototype, 'animate').as(
            'animation.animate',
          );
          cy.spy(window.Animation.prototype, 'cancel').as('animation.cancel');
        },
      });
      cy.get(loader).should('not.be.visible');
      cy.get(app).should('be.visible');
      cy.get(getInstructionComponent).should('not.exist');
      // Expected test-data:
      // 0: option1 术
      // 1: option2 两 (correct option)
      // 2: option3 二
      // 3: option4 五减二
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible')
        .then((el) => {
          cy.contains('术').should('match', el);
        });
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible')
        .then((el) => {
          cy.contains('两').should('match', el);
        });
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible')
        .then((el) => {
          cy.contains('二').should('match', el);
        });
      cy.get('[data-test="option-button-4"]')
        .as('option4')
        .should('be.visible')
        .then((el) => {
          cy.contains('五减二').should('match', el);
        });
      cy.get(sentenceCard).should('be.visible');
      cy.contains('我有个弟弟，不过没有别的兄弟姐妹。').should('exist');
      cy.get(continueButton).should('not.exist');

      // *****
      // * 2 *
      // *****
      cy.log('**2. 马丽 hears the audio of the sentence (if audio present)**,');
      cy.log('-- including the audio for the missing word');
      cy.log('-- otherwise she hears no audio at all.');
      // sentence audio plays on load:              +1 (0)
      cy.get('@audio.play').should('have.callCount', 1);
      // toggle-instruction pulse & sentence ripple x2:   +3 (0)
      cy.get('@animation.animate').should('have.callCount', 3);
      // no ani repeats:                                +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // sentence ripple canceled after audio ended:      +2 (0)
      cy.get('@animation.cancel').should('have.callCount', 2);

      // *****
      // * 3 *
      // *****
      cy.log('**3. 马丽 taps an incorrect word**, and');
      cy.log('-- sees the word turn red, buzz and become inactive.');
      cy.get('@option1')
        .click()
        .wait(20)
        .should('have.css', 'background-color', errorColor);
      // item is disabled
      cy.get('@option1').should('be.disabled');
      // item audio plays, then sentence audio:     +2 (1)
      cy.get('@audio.play').should('have.callCount', 3);
      // item buzzes and plays ripple x2:                  +3 (3)
      cy.get('@animation.animate').should('have.callCount', 6);
      // sentence audio triggers ripple replay x2:      +2 (0)
      cy.get('@animation.play').should('have.callCount', 2);
      // item ripples x2 & sentence ripples x2 canceled:  +4 (2)
      cy.get('@animation.cancel').should('have.callCount', 6);

      // *****
      // * 4 *
      // *****
      cy.log('**4. 马丽 taps the sentence**, and');
      cy.log("-- hears the full sentence's audio again");
      cy.log('-- (if present, otherwise no audio is played)');
      cy.get(sentenceCard).click();
      // sentence audio plays:                      +1 (3)
      cy.get('@audio.play').should('have.callCount', 4);
      // no new animations:                                +0 (6)
      cy.get('@animation.animate').should('have.callCount', 6);
      // sentence audio triggers ripple replay x2:      +2 (2)
      cy.get('@animation.play').should('have.callCount', 4);
      // sentence ripples x2 canceled after audio:        +2 (6)
      cy.get('@animation.cancel').should('have.callCount', 8); // this is just a test of long lines, if moving up and down wrapped lines is visual or logical.

      // *****
      // * 5 *
      // *****
      cy.log('**5. 马丽 taps the correct word**,');
      cy.log('-- sees the blank space reveal the correct character,');
      // cy.log('-- sees the sentence turn green to indicate correct,');
      cy.log('-- sees all selectable options become disabled, and');
      cy.log('-- sees the continue button become visible.');
      cy.get('@option2')
        .click()
        .should('have.css', 'background-color', successColor);
      cy.contains('我有两个弟弟，不过没有别的兄弟姐妹。').should('exist');
      // cy.get(sentenceCard).should(
      //   'have.css',
      //   'background-color',
      //   'rbg(76, 175, 80)',
      // );
      cy.get('@option1').should('be.disabled');
      cy.get('@option3').should('be.disabled');
      cy.get('@option4').should('be.disabled');
      cy.get(continueButton).should('be.visible');
      // item audio plays:                          +1 (4)
      cy.get('@audio.play').should('have.callCount', 5);
      // item plays ripple x2 & continue pulse:            +3 (6)
      cy.get('@animation.animate').should('have.callCount', 9);
      // no animation replays:                          +0 (4)
      cy.get('@animation.play').should('have.callCount', 4);
      // item ripples x2 canceled after audio:             +2 (8)
      cy.get('@animation.cancel').should('have.callCount', 10);
    },
  );
});
