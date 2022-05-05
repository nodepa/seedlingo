const app = '[data-test="app"]';
const loader = '[data-test="loader"]';
const instructionsExplainerComponent =
  '[data-test="instructions-explainer-component"]';
const continueButton = '[data-test="continue-button"]';

describe('马丽 interacts with the "review" system', () => {
  beforeEach(() => {
    // Avoid dealing with "instructions explainer" side effects.
    localStorage.setItem('InstructionsExplainerShownCount', 5);
  });

  it('Displays the review screen with a word and the corresponding symbol', () => {
    // *****
    // * 1 *
    // *****
    cy.log('**1. 马丽**');
    cy.log('-- sees a symbol representing the word');
    cy.log('-- sees the word itself');
    cy.log('-- hears the pronunciation of the word');
    cy.visit('/lesson/1/review', {
      onBeforeLoad(window) {
        cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
        cy.spy(window.Animation.prototype, 'play').as('animation.play');
        cy.spy(window.HTMLElement.prototype, 'animate').as('animation.animate');
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
    cy.get('[data-test="review-icon"]')
      .as('reviewIcon')
      .should('exist')
      .should('be.visible');
    cy.get('[data-test="review-word"]')
      .as('reviewWord')
      .should('be.visible')
      .contains('数字');
    cy.get(continueButton).should('exist').should('be.visible');
    // 1 word audio played
    cy.get('@audio.play').should('have.callCount', 1);
    cy.get('@audio.play').invoke('resetHistory');
    // 2 audio ripples created + 1 continue button pulse
    cy.get('@animation.animate').should('have.callCount', 3);
    cy.get('@animation.animate').invoke('resetHistory');
    // 2 audio ripples played + 1 continue button pulse
    cy.get('@animation.play').should('have.callCount', 3);
    cy.get('@animation.play').invoke('resetHistory');

    // *****
    // * 2 *
    // *****
    cy.log('**2. 马丽 taps the word button**, and');
    cy.log('-- hears the pronunciation of the word again');
    cy.get('@audio.play').should('have.callCount', 0);
    cy.get('@animation.play').should('have.callCount', 0);
    cy.get('@animation.animate').should('have.callCount', 0);
    cy.get('[data-test="review-word"]').click();
    // 1 word audio played
    cy.get('@audio.play').should('have.callCount', 1);
    cy.get('@audio.play').invoke('resetHistory');
    // 2 audio ripples created
    cy.get('@animation.animate').should('have.callCount', 2);
    cy.get('@animation.animate').invoke('resetHistory');
    // 2 audio ripples played
    cy.get('@animation.play').should('have.callCount', 2);
    cy.get('@animation.play').invoke('resetHistory');

    // *****
    // * 3 *
    // *****
    cy.log('**3. 马丽 taps the continue button**, and');
    cy.log('-- sees a new icon and word');
    cy.log('-- hears the pronunciation of the new word');
    cy.get('@audio.play').should('have.callCount', 0);
    cy.get('@animation.play').should('have.callCount', 0);
    cy.get('@animation.animate').should('have.callCount', 0);
    cy.get(continueButton).click();
    cy.get('[data-test="review-word"]')
      .as('reviewWord')
      .should('be.visible')
      .contains('零');
    // 1 word audio played
    cy.get('@audio.play').should('have.callCount', 1);
    cy.get('@audio.play').invoke('resetHistory');
    // 2 audio ripples created
    cy.get('@animation.animate').should('have.callCount', 2);
    cy.get('@animation.animate').invoke('resetHistory');
    // 2 audio ripples played
    cy.get('@animation.play').should('have.callCount', 2);
    cy.get('@animation.play').invoke('resetHistory');
    cy.get(continueButton).should('exist').should('be.visible');
  });
});
