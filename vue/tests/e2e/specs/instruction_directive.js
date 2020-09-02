describe('马丽 interacts with the "instruction" system', () => {
  it(
    'Displays the instruction mode with audio elements,' +
      'overlay and background shading',
    () => {
      /* 马丽 arrives at the instruction overlay
       */
      cy.visit('/');
      cy.get('[data-test="get-instructions-component"]').should('be.visible');
      cy.get('[data-test="toggle-instructions-button"]')
        .should('be.visible')
        .click();
      cy.get('[data-test="get-instructions-component"]').should(
        'not.be.visible',
      );
      cy.get('[data-test="instructions-overlay"]').should('be.visible');
      // not working: cy.get('[data-test="home-button"]').should('not.be.disabled');
      cy.get('[data-test="home-button"]').should(
        'not.have.class',
        'v-btn--disabled',
      );

      // ensure home button has styling indicating interactive, i.e.:
      // - ensure home button has overlay/icon/styling
      // - ensure home button has audio attached
      // ensure default state has no such styling
      // - click instruction toggle
      // - ensure no screen overlay
      // - ensure home button has no overlay
      // - ensure no animation playing
      // ensure overlay disappears after audio
      // - click instruction toggle
      // - click home button
      // - ensure plays audio
      // - ensure plays animation
      // - ensure overlay disappears after audio done (wire up short audio or mock play)
      // ensure audio silenced if instructions dismissed manually
      // - click instruction toggle
      // - click home button
      // - click instruction toggle
      // - ensure audio stopped
      // ensure only one concurrent instruction
      // - click instruction toggle
      // - click lesson 1 button
      // - ensure lesson 1 audio playing
      // - ensure lesson 1 animation playing
      // - click home button
      // - ensure only home button audio playing
      // - ensure only home button animation playing
      // - ensure auto toggle when done
      // ensure instructions mode stays through navigation
      // - visit /about
      // - click home
      // - click instruction toggle
      // - go back (to /about)
      // - ensure instructions overlay still showing
      // - click home
      // - ensure audio plays
      // - ensure still /about

      // when clicking the ear for the first time,
      // a message about the instructions system is played
      // that message needs to be paused if:
      // the ear is clicked again, so that instructions mode is dismissed
      // another instruction is clicked
      // add instructionButton as element in Instruction.Collection?
    },
  );
});
