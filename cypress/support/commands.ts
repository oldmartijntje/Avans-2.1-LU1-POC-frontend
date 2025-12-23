/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for login
Cypress.Commands.add('login', (username: string, password: string) => {
    cy.visit('/login');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
});

// Custom command to check if user is authenticated
Cypress.Commands.add('checkAuth', () => {
    cy.window().its('localStorage.token').should('exist');
});

// Declare custom command types
declare global {
    namespace Cypress {
        interface Chainable {
            login(username: string, password: string): Chainable<void>;
            checkAuth(): Chainable<void>;
        }
    }
}

export { };
