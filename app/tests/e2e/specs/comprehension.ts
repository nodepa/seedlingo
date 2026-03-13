describe('马丽 interacts with the "text comprehension" system', () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const continueButton = '[data-test="continue-button"]';
  const sentenceCard = '[data-test="sentence-card"]';

  beforeEach(() => {
    // Avoid dealing with "instructions explainer" side effects.
    localStorage.setItem('InstructionsExplainerShownCount', '5');
  });

  it(
    'Displays the ReadText stage with the comprehension text ' +
      'and a continue button',
    () => {
      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 sees the comprehension text**,');
      cy.log('-- sees a sentence card with the full text,');
      cy.log('-- sees the continue button to advance to questions.');
      cy.visit('/unit/comprehension-test', {
        onBeforeLoad(window) {
          delete Object.getPrototypeOf(window.navigator).serviceWorker;
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

      // The sentence card should be visible with comprehension text
      cy.get(sentenceCard).should('be.visible');
      cy.get(sentenceCard).should('contain', '我');
      cy.get(sentenceCard).should('contain', '家里');

      // Continue button should appear immediately in ReadText stage
      cy.get(continueButton).should('exist').should('be.visible');
    },
  );

  it(
    'Advances to AnswerQuestions stage and displays questions with options ' +
      'after clicking the continue button from the ReadText stage',
    () => {
      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 is on the ReadText stage**,');
      cy.log('-- sees the comprehension text and continue button.');
      cy.visit('/unit/comprehension-test', {
        onBeforeLoad(window) {
          delete Object.getPrototypeOf(window.navigator).serviceWorker;
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
      cy.get(continueButton).should('be.visible');

      // *****
      // * 2 *
      // *****
      cy.log('**2. 马丽 clicks the continue button**,');
      cy.log('-- sees the first question and answer options.');
      cy.get(continueButton).click();

      // In AnswerQuestions stage, the continue button should not be shown
      // until a correct answer is given
      cy.get(continueButton).should('not.exist');

      // The sentence card should still be visible
      cy.get(sentenceCard).should('be.visible');

      // Question options should be visible
      // Test data Q1: 谁是最小的？ options: [我, 姐姐, 大哥, 小哥]
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible')
        .contains('我');
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible')
        .contains('姐姐');
    },
  );

  it(
    'Selects the correct answer for a comprehension question ' +
      'and shows the continue button',
    () => {
      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 advances past the ReadText stage**.');
      cy.visit('/unit/comprehension-test', {
        onBeforeLoad(window) {
          delete Object.getPrototypeOf(window.navigator).serviceWorker;
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
      cy.get(continueButton).click();

      // *****
      // * 2 *
      // *****
      cy.log('**2. 马丽 answers the first question correctly**,');
      cy.log('-- sees the option turn green,');
      cy.log('-- sees the continue button appear.');

      // Test data Q1: 谁是最小的？ correct answer: 我 (option 1)
      cy.get('[data-test="option-button-1"]').as('correctOption').click();

      // Correct option should turn green
      cy.get('@correctOption').should('have.class', 'ion-color-success');

      // Continue button should appear after correct answer
      cy.get(continueButton).should('exist').should('be.visible');
    },
  );

  it(
    'Buzzes an incorrect answer for a comprehension question ' +
      'without showing the continue button',
    () => {
      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 advances past the ReadText stage**.');
      cy.visit('/unit/comprehension-test', {
        onBeforeLoad(window) {
          delete Object.getPrototypeOf(window.navigator).serviceWorker;
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
      cy.get(continueButton).click();

      // *****
      // * 2 *
      // *****
      cy.log('**2. 马丽 answers the first question incorrectly**,');
      cy.log('-- sees the option buzz and become disabled,');
      cy.log('-- does not see the continue button.');

      // Test data Q1: 谁是最小的？ incorrect answer: 姐姐 (option 2)
      cy.get('[data-test="option-button-2"]')
        .as('incorrectOption')
        .click()
        .should('have.class', 'button-disabled');

      // Incorrect option should buzz (and become disabled)
      // 1 buzz animation created (button buzz)
      cy.get('@animation.animate').should('have.callCount', 1);
      cy.get('@animation.animate').invoke('resetHistory');

      // Continue button should not appear after incorrect answer
      cy.get(continueButton).should('not.exist');
    },
  );
});

export {};
