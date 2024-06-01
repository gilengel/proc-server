/* eslint-disable no-undef */

/**
 *  This test will simulate the creation of an UI form including labels and text elements
 *  and the creation of the logical connections between the elements in the flow editor
 */
describe('Flow Editor', () => {
  it('should add a new node using drag and drop', () => {
    cy.visit('/');

    cy.viewport(1024, 800);

    const dt = new DataTransfer();
    cy.get('[data-testid=flow-dock-item-input]').trigger('dragstart', {
      dataTransfer: dt,
    });

    cy.get('[data-testid=flow-rete-editor]').trigger('drop', {
      dataTransfer: dt,
    });

    cy.get('[data-testid=flow-node]').should('exist').and('be.visible');
  });

  it('should rearrange the nodes by clicking on the "auto arrange" button', () => {
    cy.visit('/');

    cy.get('[data-testid=flow-editor-rearrange-button]').trigger('click');
  });
});
