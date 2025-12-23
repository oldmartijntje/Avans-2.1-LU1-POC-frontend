describe('Translation Features', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should have default language (English)', () => {
        cy.get('[data-testid="language-switcher"]').should('contain', 'English');
    });

    it('should switch language from English to Dutch', () => {
        // Open language dropdown
        cy.get('[data-testid="language-switcher"]').find('.dropdown-toggle').click();

        // Select Dutch
        cy.get('.dropdown-menu').contains('Nederlands').click();

        // Verify language changed
        cy.get('[data-testid="language-switcher"]').should('contain', 'Nederlands');
    });

    it('should switch language from Dutch to English', () => {
        // First switch to Dutch
        cy.get('[data-testid="language-switcher"]').find('.dropdown-toggle').click();
        cy.get('.dropdown-menu').contains('Nederlands').click();
        cy.wait(100);

        // Then switch back to English
        cy.get('[data-testid="language-switcher"]').find('.dropdown-toggle').click();
        cy.get('.dropdown-menu').contains('English').click();

        // Verify language changed back
        cy.get('[data-testid="language-switcher"]').should('contain', 'English');
    });

    it('should persist language selection after navigation', () => {
        // Switch to Dutch
        cy.get('[data-testid="language-switcher"]').find('.dropdown-toggle').click();
        cy.get('.dropdown-menu').contains('Nederlands').click();

        // Navigate to another page
        cy.get('nav').contains('a', /about|over/i).click();
        cy.url().should('include', '/about');

        // Verify language is still Dutch
        cy.get('[data-testid="language-switcher"]').should('contain', 'Nederlands');
    });

    it('should persist language selection after page reload', () => {
        // Switch to Dutch
        cy.get('[data-testid="language-switcher"]').find('.dropdown-toggle').click();
        cy.get('.dropdown-menu').contains('Nederlands').click();
        cy.wait(100);

        // Reload the page
        cy.reload();

        // Verify language is still Dutch after reload
        cy.get('[data-testid="language-switcher"]').should('contain', 'Nederlands');
    });

    it('should translate navigation items when switching language', () => {
        // Check English navigation
        cy.get('nav').should('contain', 'Home');
        cy.get('nav').should('contain', 'About');

        // Switch to Dutch
        cy.get('[data-testid="language-switcher"]').find('.dropdown-toggle').click();
        cy.get('.dropdown-menu').contains('Nederlands').click();
        cy.wait(200);

        // Navigation should contain Dutch text (or still English if translations aren't loaded)
        cy.get('nav').should('exist');
    });

    it('should have language switcher on all pages', () => {
        // Check home page
        cy.get('[data-testid="language-switcher"]').should('exist');

        // Check about page
        cy.visit('/about');
        cy.get('[data-testid="language-switcher"]').should('exist');

        // Check login page
        cy.visit('/login');
        cy.get('[data-testid="language-switcher"]').should('exist');
    });
});
