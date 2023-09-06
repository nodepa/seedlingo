describe("马丽 opens the app to the home screen's list of lessons", () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const instructionsOverlay = '[data-test="instructions-overlay"]';
  const homeButton = '[data-test="home-button"]';
  const toggleInstructionsButton = '[data-test="toggle-instructions-button"]';
  const lessonsList = '[data-test="lesson-list"]';

  it(
    'Displays start-up splash animation, ' +
      'then "introductions explainer" graphic, ' +
      'then lessons list',
    () => {
      cy.log(
        '马丽 picks up her phone, opens her messaging app and taps on a link to Seedling in a message. Seedling opens and displays a screen with an animation that encourages 马丽 to wait for Seedling to get ready.',
      );
      cy.visit('/', {
        onBeforeLoad(window) {
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

      cy.log(
        'Once Seedling is ready, a screen with an animation indicating the expectation that 马丽 should tap an interactive icon is displayed. The icon is re-used on every screen in the app and has a symbol that indicates “listen”, “help”, “instructions” or “support”.',
      );
      cy.get(loader).should('not.be.visible');
      cy.get(app)
        .should('be.visible')
        .find(instructionsExplainerComponent)
        .should('be.visible');
      cy.get(homeButton).should(
        'have.class',
        'button-disabled', // ionic disabled
      );

      cy.log('The "toggle instructions" button pulses to invite interaction.');
      cy.get(toggleInstructionsButton).should('be.visible');
      // 1 toggle instructions button pulse played
      cy.get('@animation.play').should('have.callCount', 1);
      cy.get('@animation.play').invoke('resetHistory');
      // 1 toggle instructions button pulse created
      cy.get('@animation.animate').should('have.callCount', 1);
      cy.get('@animation.animate').invoke('resetHistory');

      cy.log(
        'A short auto-played audio clip invites 马丽 to tap the "toggle instructions" button.',
      );
      cy.wait(400);
      cy.get(instructionsExplainerComponent)
        .find('audio')
        .then(($el) => {
          cy.wrap($el[0].paused).should('be.false'); // = playing
        });

      cy.log(
        'When 马丽 taps the icon, an overlay highlighting elements with attached instructions is displayed over the Home screen',
      );
      cy.get(instructionsOverlay).should('not.exist');
      cy.get(toggleInstructionsButton).should('be.visible').click();
      cy.get(instructionsExplainerComponent).should('not.exist');
      cy.get(homeButton).should('not.have.class', 'button-disabled');
      cy.get(instructionsOverlay).should('exist');
      cy.get(lessonsList).should('exist');

      cy.log(
        'An audio clip plays explaining how tapping the icon is the way to get help or instructions throughout Seedling, encouraging 马丽 to tap one of the buttons to try out the “instructions” mode.',
      );
      cy.get(toggleInstructionsButton)
        .find('audio')
        .then(($el) => {
          cy.wrap($el[0].paused).should('be.false'); // = playing
        });

      cy.log(
        '马丽 taps one of the buttons with instructions, the instructional audio is played and Seedling’s home page is displayed when done.',
      );
      cy.get(homeButton)
        .click()
        .find('audio')
        .then(($el) => {
          cy.wrap($el[0].paused).should('be.false'); // = playing
        })
        // Should auto-hide overlay after audio finishes
        // default timeout is 4000, need just a bit longer for audio to end
        .get(instructionsOverlay, { timeout: 6000 })
        .should('not.exist');
    },
  );
});

export {};
