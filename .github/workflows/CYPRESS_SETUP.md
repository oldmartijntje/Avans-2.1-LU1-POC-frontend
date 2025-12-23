# Cypress CI/CD Setup Guide

## GitHub Secrets Configuration

To enable Cypress Cloud recording in your CI/CD pipeline, you need to add your Cypress record key as a GitHub secret:

### Steps:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - **Name**: `CYPRESS_RECORD_KEY`
   - **Value**: `....`

## CI/CD Workflow

The Cypress tests run automatically on:
- Push to `main`, `develop`, or `fix-backend` branches
- Pull requests to `main` or `develop` branches

### What the workflow does:

1. ✅ Checks out code
2. ✅ Sets up Node.js 20
3. ✅ Installs dependencies
4. ✅ Builds the application
5. ✅ Runs Cypress tests with Chrome browser
6. ✅ Records results to Cypress Cloud
7. ✅ Uploads screenshots on failure
8. ✅ Uploads videos as artifacts

## Local Testing with Recording

To run tests locally with recording to Cypress Cloud:

```bash
npx cypress run --record --key 0159c694-b773-4f07-83db-5d0f5105d7ff
```

Or using environment variable:
```bash
export CYPRESS_RECORD_KEY=0159c694-b773-4f07-83db-5d0f5105d7ff
npm test
```

## Cypress Project ID

Update the `projectId` in `cypress.config.ts` with your actual Cypress Cloud project ID if you haven't already.

## Troubleshooting

- If tests fail in CI but pass locally, check the artifacts for screenshots and videos
- Ensure your dev server starts correctly on the CI environment
- Verify the `CYPRESS_RECORD_KEY` secret is set correctly in GitHub
