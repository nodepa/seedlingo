describe('Authentication redirect', () => {
  it('redirects unauthenticated users to the login page', () => {
    cy.log('**Visit the home page without authentication**');
    cy.visit('/');
    cy.log('**Verify redirect to /login**');
    cy.url().should('include', '/login');
  });

  it('serves the login page directly', () => {
    cy.log('**Visit the login page directly**');
    cy.visit('/login');
    cy.log('**Verify we are on the login page**');
    cy.url().should('include', '/login');
  });

  it('redirects any protected route to login when unauthenticated', () => {
    cy.log('**Visit the words page without authentication**');
    cy.visit('/words');
    cy.log('**Verify redirect to /login**');
    cy.url().should('include', '/login');
  });

  it('redirects the modules page to login when unauthenticated', () => {
    cy.log('**Visit the modules page without authentication**');
    cy.visit('/modules');
    cy.log('**Verify redirect to /login**');
    cy.url().should('include', '/login');
  });

  it('redirects the units page to login when unauthenticated', () => {
    cy.log('**Visit the units page without authentication**');
    cy.visit('/units');
    cy.log('**Verify redirect to /login**');
    cy.url().should('include', '/login');
  });
});
