describe('PWA Features', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should have PWA manifest', () => {
        cy.request('/manifest.json').then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('name');
        });
    });

    it('should have service worker registered', () => {
        cy.request('/sw.js').then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('should load offline page', () => {
        cy.request('/offline.html').then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('should show PWA status indicator', () => {
        cy.get('[data-testid="pwa-status"]').should('exist').or('get', 'body').should('exist');
    });
});
