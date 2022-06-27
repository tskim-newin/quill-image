const BTN = '.image-actions__toolbar-button';
const IMG = '.ql-editor img';
const OVL = '#editor >.image-actions__overlay';

const givenContents = ({
  center,
  float,
}: { center?: true; float?: 'left' | 'right' } = {}) =>
  beforeEach(() =>
    cy.quillSetContents([
      {
        insert: 'Hello World!\n',
      },
      {
        attributes: float ? { float } : undefined,
        insert: {
          image: '256x256.png',
        },
      },
      center
        ? {
            attributes: { align: 'center' },
            insert: '\nHI HI HI',
          }
        : {
            insert: 'Albert says hi!\n\n',
          },
    ])
  );

describe('quill-image-actions', () => {
  beforeEach(() => {
    cy.visit('/assets/e2e.html');
  });

  context('selection rectangle', () => {
    givenContents();

    context('when image clicked', () => {
      beforeEach(() => cy.get(IMG).click());

      it('pops up', () => {
        cy.get(IMG).then(($img) => {
          cy.get(OVL).then(($ovl) => {
            const { top, right, bottom, left } =
              $img[0].getBoundingClientRect();
            const bounds = $ovl[0].getBoundingClientRect();

            expect(bounds.top).to.be.within(top - 1, top + 1);
            expect(bounds.right).to.be.within(right - 1, right + 1);
            expect(bounds.bottom).to.be.within(bottom - 1, bottom + 1);
            expect(bounds.left).to.be.within(left - 1, left + 1);
          });
        });
      });
    });

    context('when dragged', () => {
      beforeEach(() => cy.get(IMG).click());

      it('resizes from NE', () => {
        cy.get(OVL).drag('topRight', -32, 32);
        cy.get(OVL).invoke('width').should('be.within', 222, 224);
        cy.get(OVL).invoke('height').should('be.within', 222, 224);
      });

      it('resizes from SE', () => {
        cy.get(OVL).drag('bottomRight', -32, -32);
        cy.get(OVL).invoke('width').should('be.within', 222, 224);
        cy.get(OVL).invoke('height').should('be.within', 222, 224);
      });

      it('resizes from SW', () => {
        cy.get(OVL).drag('bottomLeft', 32, -32);
        cy.get(OVL).invoke('width').should('be.within', 222, 224);
        cy.get(OVL).invoke('height').should('be.within', 222, 224);
      });

      it('resizes from NW', () => {
        cy.get(OVL).drag('topLeft', 32, 32);
        cy.get(OVL).invoke('width').should('be.within', 222, 224);
        cy.get(OVL).invoke('height').should('be.within', 222, 224);
      });
    });
  });

  context('action buttons', () => {
    context('given existing content', () => {
      context('float left', () => {
        givenContents({ float: 'left' });
        it.skip('indicates', () => {
          cy.get(IMG).should('have.attr', 'style', 'float: left;');
          cy.get(IMG).click();
          // TODO: fix this bug in the extension
          cy.get(BTN).eq(0).should('have.class', 'is-selected');
        });
      });
    });

    context('when clicked', () => {
      givenContents();
      beforeEach(() => cy.get(IMG).click());

      it('float left', () => {
        cy.get(BTN).eq(0).click().should('have.class', 'is-selected');
        cy.get(IMG).should('have.attr', 'style', 'float: left;');
      });

      it('center', () => {
        cy.get(BTN).eq(1).click().should('have.class', 'is-selected');
        cy.get(IMG).should('not.have.attr', 'style');
        cy.get(IMG).closest('p').should('have.class', 'ql-align-center');
      });

      it('float right', () => {
        cy.get(BTN).eq(2).click().should('have.class', 'is-selected');
        cy.get(IMG).should('have.attr', 'style', 'float: right;');
      });
    });
  });
});
