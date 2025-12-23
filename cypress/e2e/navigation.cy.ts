describe('Navigation', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should navigate to about page', () => {
        cy.contains(/about|over/i).click();
        cy.url().should('include', '/about');
    });

    it('should navigate to login page', () => {
        cy.contains(/login|inloggen/i).click();
        cy.url().should('include', '/login');
    });

    it('should handle 404 page for invalid routes', () => {
        cy.visit('/non-existent-page', { failOnStatusCode: false });
        cy.contains(/404|not found/i).should('be.visible');
    });

    it('should be able to go back home from any page', () => {
        cy.visit('/about');
        cy.contains(/home|startpagina/i).click();
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
});
