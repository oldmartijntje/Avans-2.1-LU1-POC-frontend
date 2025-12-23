describe('Home Page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should load the home page successfully', () => {
        cy.url().should('include', '/');
        cy.contains('h1').should('be.visible');
    });

    it('should have navigation menu', () => {
        cy.get('nav').should('exist');
    });

    it('should have language switcher', () => {
        cy.get('[data-testid="language-switcher"]').should('exist').or('contain', 'EN').or('contain', 'NL');
    });
});
