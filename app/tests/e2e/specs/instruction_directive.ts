describe('马丽 interacts with the "instructions" system', () => {
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const instructionsOverlay = '[data-test="instructions-overlay"]';
  const homeButton = '[data-test="home-button"]';
  const toggleInstructionsButton = '[data-test="toggle-instructions-button"]';

  it(
    'Displays the instructions mode with audio elements,' +
      'overlay and background shading',
    () => {
      /* 马丽 arrives at the instructions overlay
       */
      cy.visit('/', {
        onBeforeLoad(window) {
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
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

      cy.get(instructionsOverlay).should('not.exist');
      cy.get(instructionsExplainerComponent).should('be.visible');
      cy.get(toggleInstructionsButton).should('be.visible').click();
      cy.get(instructionsExplainerComponent).should('not.exist');
      cy.get(instructionsOverlay).should('exist');
      cy.get(homeButton)
        .should('not.have.class', 'button-disabled')
        .find('.badge')
        .should('exist')
        .should('be.visible');

      cy.get('@audio.play').should('have.callCount', 1); // on first load
      cy.get('@audio.play').invoke('resetHistory');
      cy.get(homeButton).click();
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');

      cy.get(toggleInstructionsButton).click();
      cy.get(instructionsOverlay).should('not.exist');
      cy.get(homeButton).find('.badge').should('not.exist');

      cy.get(toggleInstructionsButton).click();
      cy.get(instructionsOverlay).should('exist');

      // ensure overlay disappears after audio
      // - click instructions toggle
      // - click home button
      // - ensure plays audio
      // - ensure plays animation
      // - ensure overlay disappears after audio done (wire up short audio or mock play)
      // ensure audio silenced if instructions dismissed manually
      // - click instructions toggle
      // - click home button
      // - click instructions toggle
      // - ensure audio stopped
      // ensure only one set of concurrent instructions
      // - click instructions toggle
      // - click unit 1 button
      // - ensure unit 1 audio playing
      // - ensure unit 1 animation playing
      // - click home button
      // - ensure only home button audio playing
      // - ensure only home button animation playing
      // - ensure auto toggle when done
      // ensure instructions mode stays through navigation
      // - visit /about
      // - click home
      // - click instructions toggle
      // - go back (to /about)
      // - ensure instructions overlay still showing
      // - click home
      // - ensure audio plays
      // - ensure still /about

      // when clicking the ear for the first time,
      // a message about the instructions system is played
      // that message needs to be paused if:
      // the ear is clicked again, so that instructions mode is dismissed
      // another set of instructions is clicked
      // add toggleInstructionsButton as element in Instructions.AudioCollection?
    },
  );
});

export {};
