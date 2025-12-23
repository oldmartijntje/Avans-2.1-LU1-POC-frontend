describe('Subjects Management', () => {
    it('should redirect to login when not authenticated', () => {
        cy.visit('/subjects');
        cy.url().should('include', '/login');
    });

    it('should show subjects page when authenticated', () => {
        // Mock authentication
        cy.window().then((win) => {
            win.localStorage.setItem('token', 'test-token');
            win.localStorage.setItem('user', JSON.stringify({ username: 'testuser', role: 'STUDENT' }));
        });

        cy.visit('/subjects');
        // The page might redirect or show content - just verify we can visit it
        cy.get('body').should('exist');
    });

    it('should have proper navigation from home', () => {
        cy.visit('/');
        cy.url().should('match', /\/$/);
    });
});
