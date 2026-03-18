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
    // Suppress AbortError thrown when audio.play() is interrupted by pause()
    // (e.g. when the user selects an option while another audio is still playing).
    cy.on('uncaught:exception', (err) => err.name !== 'AbortError');
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
          cy.stub(window, 'matchMedia').callsFake(() => ({
            matches: false,
            addEventListener() {
              /**/
            },
          }));
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
          cy.stub(window, 'matchMedia').callsFake(() => ({
            matches: false,
            addEventListener() {
              /**/
            },
          }));
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
          cy.stub(window, 'matchMedia').callsFake(() => ({
            matches: false,
            addEventListener() {
              /**/
            },
          }));
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
          cy.stub(window, 'matchMedia').callsFake(() => ({
            matches: false,
            addEventListener() {
              /**/
            },
          }));
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

      // Wait for the stage transition to AnswerQuestions to complete and the
      // option buttons to be fully rendered, then reset the spy so that only
      // animations from the incorrect-option click are measured.
      cy.get('[data-test="option-button-1"]').should('be.visible');
      cy.get('@animation.animate').invoke('resetHistory');

      // Test data Q1: 谁是最小的？ incorrect answer: 姐姐 (option 2)
      cy.get('[data-test="option-button-2"]')
        .as('incorrectOption')
        .click()
        .should('have.class', 'button-disabled');

      // Incorrect option should buzz (and become disabled).
      // The buzz is a 6-keyframe shake animation; other animations (e.g. audio
      // ripples) may also fire on click, so we check for the buzz specifically
      // rather than enforcing an exact total call count.
      cy.get('@animation.animate').should((spy) => {
        const hasBuzz = (spy as unknown as sinon.SinonSpy).args.some(
          (args) => Array.isArray(args[0]) && args[0].length === 6,
        );
        expect(hasBuzz, 'buzz animation was created').to.eq(true);
      });
      cy.get('@animation.animate').invoke('resetHistory');

      // Continue button should not appear after incorrect answer
      cy.get(continueButton).should('not.exist');
    },
  );
});

export {};
