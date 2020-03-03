describe('马丽 opens the app to lessons overview', () => {
  it(
    'Displays splash animation, ' +
      'then get introductions graphic, ' +
      'then lessons overview',
    () => {
      cy.visit('/');

      cy.get('[data-test="app"]').should('not.be.visible');
      cy.get('[data-test="loader"]').should('be.visible');
      cy.get('[data-test="loader"]').should('not.be.visible');
      cy.get('[data-test="app"]').should('be.visible');
      cy.get('[data-test="get-instructions-component"]').should('be.visible');
      // should play audio
      cy.get('[data-test="toggle-instructions-button"]')
        .should('be.visible')
        .click();
      // should show instructions overlay
      // home.click()
      // should play audio
      // toggle-instructions.click()
      // should hide overlay
      // should show lessons
    },
  );
});
