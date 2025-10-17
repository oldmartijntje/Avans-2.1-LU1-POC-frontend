# GitHub Pages SPA Routing Solution

This project implements a comprehensive solution for Single Page Application (SPA) routing on GitHub Pages, which traditionally doesn't support client-side routing out of the box.

## How it works

### The Problem
When you deploy a React app with React Router to GitHub Pages:
1. Direct navigation to `/your-repo/some-route` results in a 404 error
2. Refreshing the page on any route except the root also causes a 404
3. GitHub Pages tries to serve a physical file at that path, which doesn't exist

### Our Solution

#### 1. **404.html Redirect Script** (`/public/404.html`)
- GitHub Pages automatically serves `404.html` for any non-existent path
- Our `404.html` contains JavaScript that:
  - Detects if we're on a GitHub Pages path that should be handled by React Router
  - Stores the intended route in `sessionStorage`
  - Redirects to the base path of the application

#### 2. **Client-Side Route Recovery** (`/src/main.tsx`)
- When the app loads, it checks `sessionStorage` for a stored redirect path
- If found, it uses `window.history.replaceState()` to restore the correct URL
- This happens before React Router initializes, ensuring the correct route is active

#### 3. **Proper Basename Configuration**
- `BrowserRouter` is configured with `basename="/Avans-2.1-LU1-POC-frontend"`
- Vite config includes `base: '/Avans-2.1-LU1-POC-frontend'`
- This ensures all assets and routing work correctly under the GitHub Pages subpath

#### 4. **404 Page Component** (`/src/pages/NotFound.tsx`)
- Handles legitimate 404s (routes that don't exist in your app)
- Provides user-friendly error page with navigation options
- Includes fallback route handling for edge cases

## Testing the Solution

### Local Development
```bash
npm run dev
```
- Visit `http://localhost:5173/Avans-2.1-LU1-POC-frontend/translation-management`
- Refresh the page - should work correctly
- Navigate using browser back/forward buttons - should work correctly

### Production (GitHub Pages)
```bash
npm run build
# Deploy the `dist` folder to GitHub Pages
```
- Visit `https://yourusername.github.io/Avans-2.1-LU1-POC-frontend/translation-management`
- Refresh the page - should work correctly
- Share direct links to any route - should work correctly

## Key Files Modified

1. **`/public/404.html`** - GitHub Pages 404 redirect handler
2. **`/src/main.tsx`** - Route recovery logic
3. **`/src/pages/NotFound.tsx`** - 404 page component
4. **`/src/App.tsx`** - Added catch-all route for 404s
5. **`/vite.config.ts`** - Proper base path configuration
6. **`/.github/workflows/deploy.yml`** - Automated deployment

## Browser Support

This solution works on all modern browsers that support:
- `sessionStorage`
- `window.history.replaceState()`
- ES6 JavaScript

## Alternative Solutions Considered

1. **Hash Router**: Works but creates URLs like `/#/route` which are less SEO-friendly
2. **Server Redirects**: Not available on GitHub Pages static hosting
3. **Custom Domain with Netlify/Vercel**: More complex setup, not needed for this use case

## Deployment

The project includes automated GitHub Actions deployment. Simply push to the `main` branch and the app will be built and deployed automatically.

## Common Issues and Solutions

### Issue: Routes don't work after deployment
**Solution**: Ensure the `base` in `vite.config.ts` matches your repository name exactly.

### Issue: Assets not loading
**Solution**: Verify the `basename` in `BrowserRouter` matches the `base` in Vite config.

### Issue: 404 page shows instead of app routes
**Solution**: Check that `404.html` is in the `public` directory and gets copied to `dist` during build.

This solution provides seamless client-side routing on GitHub Pages without compromising user experience or SEO.