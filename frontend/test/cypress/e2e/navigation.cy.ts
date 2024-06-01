/* eslint-disable no-undef */

describe('Navigation', () => {
  it('should display home', () => {
    cy.visit('/');

    cy.get('[data-testid=layout-main]').should('exist').and('be.visible');
  });
});
