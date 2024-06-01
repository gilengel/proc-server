/* eslint-disable no-undef */

/**
 *  This test will simulate the creation of an UI form including labels and text elements
 *  and the creation of the logical connections between the elements in the flow editor
 */
describe('Navigation', () => {
  it('should display home', () => {
    cy.visit('/');

    cy.viewport(1024, 800);

    cy.get('[data-testid=tab-layout]').click();

    cy.get('[data-testid=grid-column-1-1').children('.drop-container');

    cy.get('[data-testid="layout-column-element-container-1-1"').then(
      (textElement) => {
        textElement[0].ondrop = (e) => {
          console.log(e);
        };
      },
    );

    cy.get('[data-testid="element-list-entry-text"').trigger('dragstart', {
      eventConstructor: 'DragEvent',
    });

    cy.get('[data-testid="layout-column-element-container-1-1"').trigger(
      'dragover',
      { eventConstructor: 'DragEvent' },
    );
    cy.get('[data-testid="layout-column-element-container-1-1"').trigger(
      'drop',
      { eventConstructor: 'DragEvent' },
    );

    /*
      const textElementBoundingBox = textElement[0].getBoundingClientRect();

      cy.get('[data-testid=grid-column-1-1')
        .children('.drop-container')
        .then((column) => {
          const boundaryBox = column[0].getBoundingClientRect();

          const x = Math.ceil(boundaryBox.x + 50);
          const y = Math.ceil(boundaryBox.y + 25);

          const before = column.html();

          cy.get('[data-testid="element-list-entry-text"')
            .trigger('pointerdown', {
              which: 1,
              pageX: textElementBoundingBox.x + 20,
              pageY: textElementBoundingBox.y + 10,
            })

            .trigger('pointermove', {
              which: 1,
              pageX: x,
              pageY: y,
            })

            .trigger('drop');

          console.log(x);
          const after = column.html();

          console.log(before === after);
        });
    });
    */
  });
});
