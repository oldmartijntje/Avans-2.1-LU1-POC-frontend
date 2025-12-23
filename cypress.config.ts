import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'zrog4n',
    e2e: {
        baseUrl: 'http://localhost:5173/Avans-2.1-LU1-POC-frontend',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/e2e.ts',
    },
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
        specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/component.ts',
    },
    video: false,
    screenshotOnRunFailure: true,
});
