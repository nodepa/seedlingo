describe('马丽 opens the app to lessons overview', () => {
  it(
    'Displays splash animation, ' +
      'then "get introductions" graphic, ' +
      'then lessons list',
    () => {
      /* 马丽 picks up her phone and taps on a link in her messaging app. The
       * Literacy App Prototype opens and displays a screen with an animation
       * that encourages 马丽 to wait for the web app to get ready.
       */
      cy.visit('/');

      cy.get('[data-test="app"]').should('not.be.visible');
      cy.get('[data-test="loader"]').should('be.visible');
      /* Once the web app is ready, a screen with an animation indicating the
       * expectation that 马丽 should tap an interactive icon is displayed. The
       * icon is re-used on every screen in the app and has a symbol that
       * indicates “listen”, “help”, “instructions” or “support”.
       */
      cy.get('[data-test="loader"]').should('not.be.visible');
      cy.get('[data-test="app"]').should('be.visible');
      cy.get('[data-test="get-instructions-component"]').should('be.visible');
      // not working: cy.get('[data-test="home-button"]').should('be.disabled');
      cy.get('[data-test="home-button"]').should(
        'have.class',
        'v-btn--disabled',
      );

      /* The "instructions" icon vibrates periodically to invite interaction.
       */
      // pending
      // cy.get('[data-test="toggle-instructions-button"]')
      //   .should('be.visible')
      //   .should('vibrate');

      /* A short auto-played audio clip invites 马丽 to tap the interactive
       * icon.
       */
      // pending
      // cy.get('[data-test="toggle-instructions-button"]')
      //   .should('play audio');

      /* When 马丽 taps the icon, an instructions overlay is displayed over the
       * Home screen
       */
      cy.get('[data-test="toggle-instructions-button"]')
        .should('be.visible')
        .click();
      cy.get('[data-test="get-instructions-component"]').should(
        'not.be.visible',
      );
      // not working: cy.get('[data-test="home-button"]').should('be.enabled');
      cy.get('[data-test="home-button"]').should(
        'not.have.class',
        'v-btn--disabled',
      );
      cy.get('[data-test="instructions-overlay"]').should('be.visible');
      cy.get('[data-test="lessons-list"]').should('be.visible');

      /* An audio clip plays explaining how tapping the icon is the way to get
       * help or instructions throughout the web app, encouraging 马丽 to tap
       * one of the buttons to try out the “instructions” mode.
       */
      // pending
      // cy.get('[data-test="toggle-instructions-button"]')
      //   .should('play audio');

      /* 马丽 taps one of the buttons with an instruction, the instruction is
       * played and the web app’s dashboard is displayed when done.
       */
      cy.get('[data-test="home-button"]').click();
      // pending
      // cy.get('[data-test="home-button"]')
      //   .should('play audio');
      // TODO: should (auto) hide overlay
      // cy.get('[data-test="instructions-overlay"]').should('not.be.visible');
    },
  );
});
