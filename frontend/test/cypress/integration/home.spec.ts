describe('Landing', () => {
  beforeEach(() => {
    cy.visit('#/');
  });
  it('.should() - assert that <title> is correct', () => {
    cy.title().should('include', 'Quasar');

    cy.get('h1').contains('Page List')
  });
});
