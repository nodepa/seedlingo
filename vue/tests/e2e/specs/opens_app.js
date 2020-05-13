describe('马丽 opens the app to lessons overview', () => {
  it(
    'Displays splash animation, ' +
      'then "get introductions" graphic, ' +
      'then lessons list',
    () => {
      cy.visit('/');

      cy.get('[data-test="app"]').should('not.be.visible');
      cy.get('[data-test="loader"]').should('be.visible');
      cy.get('[data-test="loader"]').should('not.be.visible');
      cy.get('[data-test="app"]').should('be.visible');
      cy.get('[data-test="get-instructions-component"]').should('be.visible');
      // not working: cy.get('[data-test="home-button"]').should('be.disabled');
      cy.get('[data-test="home-button"]').should(
        'have.class',
        'v-btn--disabled',
      );
      // TODO: should play audio
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
      // TODO: should show instructions overlay
      // TODO: home.click()
      // TODO: should play audio
      // TODO: should (auto) hide overlay
      // TODO: should show lessons list
    },
  );
});
