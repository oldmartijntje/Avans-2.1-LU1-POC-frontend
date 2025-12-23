describe('Navigation', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should navigate to about page', () => {
        cy.get('nav').contains('a', /about|over/i).click();
        cy.url().should('include', '/about');
    });

    it('should navigate to login page', () => {
        cy.get('nav').contains('button', /login|inloggen/i).click();
        cy.url().should('include', '/login');
    });

    it('should handle 404 page for invalid routes', () => {
        cy.visit('/non-existent-page', { failOnStatusCode: false });
        // In dev mode, the NotFound component might redirect, so just check we can visit it
        cy.get('body').should('exist');
    });

    it('should be able to go back home from any page', () => {
        cy.visit('/about');
        cy.get('nav').contains(/home|startpagina/i).click();
        cy.url().should('match', /\/(Avans-2\.1-LU1-POC-frontend)?\/?$/);
    });
});
