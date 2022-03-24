const app = '[data-test="app"]';
const loader = '[data-test="loader"]';
const getInstructionComponent = '[data-test="instruction-explainer-component"]';
const instructionOverlay = '[data-test="instruction-overlay"]';
const homeButton = '[data-test="home-button"]';
const toggleInstructionButton = '[data-test="toggle-instruction-button"]';
const lessonsList = '[data-test="lesson-list"]';

describe('马丽 opens the app to lessons overview', () => {
  it(
    'Displays splash animation, ' +
      'then "introductions explainer" graphic, ' +
      'then lessons list',
    () => {
      cy.log(
        '马丽 picks up her phone and taps on a link in her messaging app. The Literacy App Prototype opens and displays a screen with an animation that encourages 马丽 to wait for the web app to get ready.',
      );
      cy.visit('/', {
        onBeforeLoad(window) {
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.HTMLElement.prototype, 'animate').as(
            'animation.animate',
          );
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
        'Once the web app is ready, a screen with an animation indicating the expectation that 马丽 should tap an interactive icon is displayed. The icon is re-used on every screen in the app and has a symbol that indicates “listen”, “help”, “instruction” or “support”.',
      );
      cy.get(loader).should('not.be.visible');
      cy.get(app)
        .should('be.visible')
        .find(getInstructionComponent)
        .should('be.visible');
      cy.get(homeButton).should(
        'have.class',
        'button-disabled', // ionic disabled
      );

      cy.log('The "instruction" button pulses to invite interaction.');
      cy.get(toggleInstructionButton).should('be.visible');
      // 1 instruction button pulse played
      cy.get('@animation.play').should('have.callCount', 1);
      cy.get('@animation.play').invoke('resetHistory');
      // 1 instruction button pulse created
      cy.get('@animation.animate').should('have.callCount', 1);
      cy.get('@animation.animate').invoke('resetHistory');

      cy.log(
        'A short auto-played audio clip invites 马丽 to tap the interactive icon.',
      );
      cy.wait(400);
      cy.get(getInstructionComponent)
        .find('audio')
        .then(($el) => {
          cy.wrap($el[0].paused).should('be.false'); // = playing
        });

      cy.log(
        'When 马丽 taps the icon, an instruction overlay is displayed over the Home screen',
      );
      cy.get(instructionOverlay).should('not.exist');
      cy.get(toggleInstructionButton).should('be.visible').click();
      cy.get(getInstructionComponent).should('not.exist');
      cy.get(homeButton).should('not.have.class', 'button-disabled');
      cy.get(instructionOverlay).should('exist');
      cy.get(lessonsList).should('exist');

      cy.log(
        'An audio clip plays explaining how tapping the icon is the way to get help or instructions throughout the web app, encouraging 马丽 to tap one of the buttons to try out the “instruction” mode.',
      );
      cy.get(toggleInstructionButton)
        .find('audio')
        .then(($el) => {
          cy.wrap($el[0].paused).should('be.false'); // = playing
        });

      cy.log(
        '马丽 taps one of the buttons with an instruction, the instruction is played and the web app’s dashboard is displayed when done.',
      );
      cy.get(homeButton)
        .click()
        .find('audio')
        .then(($el) => {
          cy.wrap($el[0].paused).should('be.false'); // = playing
        })
        // Should auto-hide overlay after audio finishes
        // default timeout is 4000, need just a bit longer for audio to end
        .get(instructionOverlay, { timeout: 5000 })
        .should('not.exist');
    },
  );
});
