import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/Avans-2.1-LU1-POC-frontend',
    server: {
        proxy: {
            '/api': {
                target: 'https://avans-yourself.oldmartijntje.nl',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
                configure: (proxy) => {
                    proxy.on('error', (err) => {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', (_, req) => {
                        console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req) => {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                },
            }
        }
    },
    build: {
        rollupOptions: {
            output: {
                // Ensure service worker and manifest are copied to build
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'manifest.json' || assetInfo.name === 'sw.js') {
                        return '[name][extname]';
                    }
                    return 'assets/[name]-[hash][extname]';
                }
            }
        }
    }
})
