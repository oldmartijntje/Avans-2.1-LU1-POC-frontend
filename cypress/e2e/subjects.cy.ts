describe('Subjects Management', () => {
    beforeEach(() => {
        cy.visit('/subjects');
    });

    it('should display subjects page', () => {
        cy.url().should('include', '/subjects');
    });

    it('should show subject list or empty state', () => {
        cy.get('body').then(($body) => {
            if ($body.text().includes('No subjects') || $body.text().includes('Geen vakken')) {
                cy.contains(/no subjects|geen vakken/i).should('be.visible');
            } else {
                cy.get('[data-testid="subject-list"]').should('exist').or('get', '.subject-item').should('exist');
            }
        });
    });

    it('should have course selector', () => {
        cy.get('select').should('exist').or('contains', /course|cursus/i);
    });
});
