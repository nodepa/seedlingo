const app = '[data-test="app"]';
const loader = '[data-test="loader"]';
const getInstructionComponent = '[data-test="get-instruction-component"]';
const continueButton = '[data-test="continue-button"]';
const sentenceCard = '[data-test="sentence-card"]';
const sentenceBlank = '[data-test="sentence-word-3"]';
const errorColor = 'rgb(229, 57, 53)';
const primaryColor = 'rgb(25, 118, 210)';
const successColor = 'rgb(0, 150, 136)';

describe('马丽 interacts with the "cloze" system', () => {
  beforeEach(() => {
    // Avoid dealing with "get instructions" side effects.
    localStorage.setItem('GetInstructionGraphicShownCount', 5);
  });

  it(
    'Displays the single-cloze screen with ' +
      'a sentence with a blank for a missing word and 4 "word" cards',
    () => {
      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 sees a sentence with a blank for a missing word**,');
      cy.log('-- sees a list of words from the same lesson,');
      cy.log('&nbsp;&nbsp; of which 1 word is the missing word, and');
      cy.log('-- sees 3 words that are unsuitable substitutes.');
      cy.visit('/lesson/single-cloze-test', {
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
        .contains('术');
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible')
        .contains('两');
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible')
        .contains('二');
      cy.get('[data-test="option-button-4"]')
        .as('option4')
        .should('be.visible')
        .contains('五减二');
      cy.get(sentenceCard)
        .should('be.visible')
        .contains('我有个弟弟，不过没有别的兄弟姐妹。');
      cy.get(continueButton).should('not.exist');

      // *****
      // * 2 *
      // *****
      cy.log('**2. 马丽 taps an incorrect word**, and');
      cy.log('-- sees the word turn red, buzz and become inactive.');
      cy.get('@option1')
        .click()
        .wait(20)
        .should('have.css', 'background-color', errorColor);
      // item is disabled
      cy.get('@option1').should('be.disabled');

      // 1 item audio played:                       +1 (0)
      cy.get('@audio.play').should('have.callCount', 1);
      // 1 item buzz 1 + 2 item ripples:                   +3 (0)
      cy.get('@animation.animate').should('have.callCount', 3);
      // 0 ripples replayed:                            +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // 2 audio ripples canceled:                        +2 (0)
      cy.get('@animation.cancel').should('have.callCount', 2);

      // *****
      // * 3 *
      // *****
      cy.log('**3. 马丽 taps the correct word**,');
      cy.log('-- sees the blank space reveal the correct character,');
      cy.log('&nbsp;&nbsp; on a green background');
      cy.log('-- sees all selectable options become disabled, and');
      cy.log('-- sees the continue button become visible.');
      cy.get('@option2')
        .click()
        .should('have.css', 'background-color', successColor);
      cy.get(sentenceCard).contains('我有两个弟弟，不过没有别的兄弟姐妹。');
      cy.get(sentenceBlank).should(
        'have.css',
        'background-color',
        successColor,
      );
      cy.get('@option1').should('be.disabled');
      cy.get('@option3').should('be.disabled');
      cy.get('@option4').should('be.disabled');
      cy.get(continueButton).should('be.visible');

      // 1 item audio plays:                        +1 (1)
      cy.get('@audio.play').should('have.callCount', 2);
      // 2 item ripples + 1 continue pulse:                +3 (3)
      cy.get('@animation.animate').should('have.callCount', 6);
      // no animation replays:                          +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // item ripples x2 canceled after audio:             +2 (2)
      cy.get('@animation.cancel').should('have.callCount', 4);
    },
  );

  it(
    'Displays the multi-cloze screen with ' +
      'a sentence with four blanks for missing words and 4 "word" cards',
    () => {
      cy.log('Test sentence: 我[有][两]个弟弟，不过[没有]别的[兄弟姐妹]。');

      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 sees a sentence with four blanks for missing words**,');
      cy.log(
        '-- sees a "list" of words matching the number of blanks in the sentence.',
      );
      cy.visit('/lesson/multi-cloze-test', {
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
      // 0: option1 兄弟姐妹
      // 1: option2 两
      // 2: option3 没有
      // 3: option4 有
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible')
        .contains('兄弟姐妹');
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible')
        .contains('两');
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible')
        .contains('没有');
      cy.get('[data-test="option-button-4"]')
        .as('option4')
        .should('be.visible')
        .contains('有');
      cy.get(sentenceCard)
        .should('be.visible')
        .contains('我个弟弟，不过别的。');
      cy.get(continueButton).should('not.exist');

      // *****
      // * 2 *
      // *****
      cy.log('**2. 马丽 does not hear auto-played audio of the sentence**,');

      // 0 sentence audio played on load:           +0 (0)
      cy.get('@audio.play').should('have.callCount', 0);
      // 0 sentence audio ripples:                         +0 (0)
      cy.get('@animation.animate').should('have.callCount', 0);
      // 0 ani repeats:                                 +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // 0 sentence ripples canceled after audio ended:   +0 (0)
      cy.get('@animation.cancel').should('have.callCount', 0);

      // *****
      // * 3 *
      // *****
      cy.log(
        '**3. 马丽 taps the *incorrect* option for the first blank**, and',
      );
      cy.log('-- sees the word turn red and buzz');
      cy.log("-- hears the word's audio");
      cy.log('-- sees the word return to original state.');
      cy.get('@option1')
        .click()
        .wait(20)
        .should('have.css', 'background-color', errorColor);
      // item returns to normal
      cy.get('@option1')
        .should('not.be.disabled')
        .should('have.css', 'background-color', primaryColor);

      // 1 item audio played:                       +1 (0)
      cy.get('@audio.play').should('have.callCount', 1);
      // 1 item buzz + 2 item ripples:                     +3 (0)
      cy.get('@animation.animate').should('have.callCount', 3);
      // 0 ani repeats:                                 +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // 2 item ripples canceled:                         +2 (0)
      cy.get('@animation.cancel').should('have.callCount', 2);

      // *****
      // * 4 *
      // *****
      cy.log('**4. 马丽 taps a *correct* option for the first blank**, and');
      cy.log('-- sees the word button become disabled (no buzz)');
      cy.log(
        '-- sees the first blank in the sentence reveal the word in green',
      );
      cy.log("-- hears the word's audio");
      cy.get('@option4').click().wait(20).should('be.disabled');
      cy.get('[data-test="sentence-word-2"]')
        .should('have.css', 'background-color', successColor)
        .contains('有');

      // 1 item audio played:                       +1 (1)
      cy.get('@audio.play').should('have.callCount', 2);
      // 2 item ripples:                                   +2 (3)
      cy.get('@animation.animate').should('have.callCount', 5);
      // 0 ani repeats:                                 +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // 2 item ripples canceled:                         +2 (2)
      cy.get('@animation.cancel').should('have.callCount', 4);

      // *****
      // * 5 *
      // *****
      cy.log('Test sentence: 我[有][两]个弟弟，不过[没有]别的[兄弟姐妹]。');
      cy.log('**5. 马丽 taps elements of the sentence**');
      cy.log("-- hears a non-blank word's audio");
      cy.log("-- hears a revealed blank-word's audio");
      cy.log("-- hears a unrevealed blank's corresponding audio");
      cy.log('-- hears no audio for punctuation');

      // non-blank word
      cy.get('[data-test="sentence-word-1"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .contains('我')
        .click();
      // 1 item audio played:                       +1 (2)
      cy.get('@audio.play').should('have.callCount', 3);
      // 2 item ripples:                                   +2 (5)
      cy.get('@animation.animate').should('have.callCount', 7);
      // 0 ani repeats:                                 +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // 2 item ripples canceled:                         +2 (4)
      cy.get('@animation.cancel').should('have.callCount', 6);

      // revealed blank-word
      cy.get('[data-test="sentence-word-2"]')
        .should('have.css', 'background-color', successColor)
        .contains('有')
        .click();
      // 1 item audio played:                       +1 (3)
      cy.get('@audio.play').should('have.callCount', 4);
      // 2 item ripples:                                   +2 (7)
      cy.get('@animation.animate').should('have.callCount', 9);
      // 0 ani repeats:                                 +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // 2 item ripples canceled:                         +2 (6)
      cy.get('@animation.cancel').should('have.callCount', 8);

      // unrevealed blank plays no audio until revealed
      cy.get('[data-test="sentence-word-3"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .should('not.contain', '两')
        .click();
      // 0 item audio played:                       +0 (4)
      cy.get('@audio.play').should('have.callCount', 4);
      // 0 item ripples:                                   +0 (9)
      cy.get('@animation.animate').should('have.callCount', 9);
      // 0 ani repeats:                                 +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // 0 item ripples canceled:                         +0 (8)
      cy.get('@animation.cancel').should('have.callCount', 8);

      // no audio for punctuation
      cy.get('[data-test="sentence-word-6"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .contains('，')
        .click();
      // 0 item audio played:                       +0 (4)
      cy.get('@audio.play').should('have.callCount', 4);
      // 0 item ripples:                                   +0 (9)
      cy.get('@animation.animate').should('have.callCount', 9);
      // 0 ani repeats:                                 +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // 0 item ripples canceled:                         +0 (8)
      cy.get('@animation.cancel').should('have.callCount', 8);

      // *****
      // * 6 *
      // *****
      cy.log('**6. 马丽 taps the *correct* option for the second blank**, and');
      cy.log('-- sees the word button become disabled (no buzz)');
      cy.log(
        '-- sees the first blank in the sentence reveal the word in green',
      );
      cy.log("-- hears the word's audio");

      cy.get('[data-test="sentence-word-3"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .should('not.contain', '两');
      cy.get('@option2').click().wait(20).should('be.disabled');
      cy.get('[data-test="sentence-word-3"]')
        .should('have.css', 'background-color', successColor)
        .should('contain', '两');

      // 1 item audio played:                       +1 (4)
      cy.get('@audio.play').should('have.callCount', 5);
      // 2 item ripples:                                   +2 (9)
      cy.get('@animation.animate').should('have.callCount', 11);
      // 0 ani repeats:                                 +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // 2 item ripples canceled:                         +2 (8)
      cy.get('@animation.cancel').should('have.callCount', 10);

      // *****
      // * 7 *
      // *****
      cy.log('**7. 马丽 taps the *correct* option for the third blank**, and');
      cy.log('-- sees the word button become disabled (no buzz)');
      cy.log(
        '-- sees the first blank in the sentence reveal the word in green',
      );
      cy.log("-- hears the word's audio");

      cy.get('[data-test="sentence-word-8"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .should('not.contain', '没有');
      cy.get('@option3').click().wait(20).should('be.disabled');
      cy.get('[data-test="sentence-word-8"]')
        .should('have.css', 'background-color', successColor)
        .should('contain', '没有');

      // 1 item audio played:                       +1 (5)
      cy.get('@audio.play').should('have.callCount', 6);
      // 2 item ripples:                                   +2 (11)
      cy.get('@animation.animate').should('have.callCount', 13);
      // 0 ani repeats:                                 +0 (0)
      cy.get('@animation.play').should('have.callCount', 0);
      // 2 item ripples canceled:                         +2 (10)
      cy.get('@animation.cancel').should('have.callCount', 12);

      // *****
      // * 8 *
      // *****
      cy.log('**8. 马丽 taps the *correct* option for the last blank**, and');
      cy.log('-- sees the word button become disabled (no buzz)');
      cy.log(
        '-- sees the first blank in the sentence reveal the word in green',
      );
      cy.log("-- hears the word's audio");
      cy.log('-- sees the continue button visible and flashing');

      cy.get('[data-test="sentence-word-10"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .should('not.contain', '兄弟姐妹');
      cy.get('@option1').click().wait(20).should('be.disabled');
      cy.get('[data-test="sentence-word-10"]')
        .should('have.css', 'background-color', successColor)
        .should('contain', '兄弟姐妹');
      cy.get(continueButton).should('be.visible');

      // 1 item audio played:                       +1 (6)
      cy.get('@audio.play').should('have.callCount', 7);
      // 1 continue pulse:                                  +1 (13)
      cy.get('@animation.animate').should('have.callCount', 14);
      // 2 item ripples repeats:                        +2 (0)
      cy.get('@animation.play').should('have.callCount', 2);
      // 2 item ripples canceled:                         +2 (12)
      cy.get('@animation.cancel').should('have.callCount', 14);
    },
  );
});
