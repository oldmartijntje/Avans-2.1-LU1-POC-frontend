# Cypress Testing

This project uses Cypress for end-to-end testing.

## Running Tests

### Interactive Mode (recommended for development)
```bash
npm run cypress
# or
npm run test:open
```

### Headless Mode (CI/CD)
```bash
npm test
# or
npm run cypress:headless
```

## Test Structure

- `cypress/e2e/` - End-to-end tests
  - `home.cy.ts` - Home page tests
  - `authentication.cy.ts` - Login/Register flow tests
  - `navigation.cy.ts` - Navigation and routing tests
  - `subjects.cy.ts` - Subject management tests
  - `pwa.cy.ts` - PWA features tests

- `cypress/support/` - Support files and custom commands
  - `commands.ts` - Custom Cypress commands (login, checkAuth)
  - `e2e.ts` - E2E test configuration
  - `component.ts` - Component test configuration

## Custom Commands

- `cy.login(username, password)` - Logs in a user
- `cy.checkAuth()` - Verifies user is authenticated

## Configuration

Cypress is configured in `cypress.config.ts` with:
- Base URL: http://localhost:5173
- Video recording: disabled
- Screenshots on failure: enabled

## Before Running Tests

Make sure the development server is running:
```bash
npm run dev
```

Then in another terminal, run the tests.
