describe('Login Flow', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display login form', () => {
        cy.url().should('include', '/login');
        cy.get('input[name="username"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
        cy.contains(/sign in|inloggen/i).should('be.visible');
    });

    it('should have required fields validation', () => {
        // Check that form fields are required
        cy.get('input[name="username"]').should('have.attr', 'required');
        cy.get('input[name="password"]').should('have.attr', 'required');
    });

    it('should allow user to type credentials', () => {
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="username"]').should('have.value', 'testuser');

        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="password"]').should('have.value', 'password123');
    });

    it('should navigate to register page', () => {
        cy.contains('a', /register|registreren/i).click();
        cy.url().should('include', '/register');
    });
});
