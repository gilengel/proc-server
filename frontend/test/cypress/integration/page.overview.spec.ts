function getPageItems() {
  return cy.get('#lst__pages').find('.q-item__section'); 
}

describe('Landing', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('.should() - create a new page with button clicked', () => {
    cy.get('#new_page_link').click()

    getPageItems().its('length').then((size) => {
      cy.get('#txt__new_page_name').type('New Page')
      cy.get('#btn__create_page').click()
      expect(getPageItems().its('length').should('eq', size + 2));
    })
  });

  it('.should() - cancel create a new page', () => {
    getPageItems().its('length').then((size) => {
      cy.get('#new_page_link').click()
      cy.get('#btn__cancel_create_page').click()  
      expect(getPageItems().its('length').should('eq', size));
    })
  });

  it('.should() - cancel create a new page by pressing "esc"', () => {
    getPageItems().its('length').then((size) => {
      cy.get('#new_page_link').click()
      cy.get('#txt__new_page_name').type('{esc}') 
      expect(getPageItems().its('length').should('eq', size));
    })
  });

  it('.should() - delete an existing page', () => {
    getPageItems().its('length').then((size) => {
      cy.get('#btn__delete_page_0').click()
      cy.get('#btn__delete_page').click()
      expect(getPageItems().its('length').should('eq', size - 2));
    })
  });
});

