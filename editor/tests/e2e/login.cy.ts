describe('Login page', () => {
  beforeEach(() => {
    cy.log('**Visit the login page**');
    cy.visit('/login');
  });

  it('renders the Seedlingo Apiary heading', () => {
    cy.log('**Verify the page title heading is present**');
    cy.contains('Seedlingo Apiary').should('be.visible');
  });

  it('renders a link to seedlingo.com', () => {
    cy.log('**Verify the Seedlingo link is present**');
    cy.contains('Seedlingo').should('be.visible');
  });

  it('renders the Toggle Dark Mode button', () => {
    cy.log('**Verify the dark mode toggle button is present**');
    cy.contains('Toggle Dark Mode').should('be.visible');
  });

  it('renders the Amplify Authenticator sign-in form', () => {
    cy.log('**Verify the sign-in form is rendered**');
    cy.get('[data-amplify-authenticator]').should('exist');
  });
});
