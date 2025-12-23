describe('Home Page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should load the home page successfully', () => {
        cy.url().should('match', /\/$/);
        cy.get('h1').should('be.visible');
    });

    it('should have navigation menu', () => {
        cy.get('nav').should('exist');
        cy.contains('Avans Elective Hub').should('be.visible');
    });

    it('should have language switcher', () => {
        cy.get('[data-testid="language-switcher"]').should('exist');
    });
});
