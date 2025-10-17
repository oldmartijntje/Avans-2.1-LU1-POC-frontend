import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { TranslationProvider } from './contexts/TranslationContext';
import './styles/globals.css'
import App from './App.tsx'

// Handle GitHub Pages client-side routing redirect
const redirectPath = sessionStorage.getItem('redirectPath');
if (redirectPath) {
    sessionStorage.removeItem('redirectPath');
    window.history.replaceState(null, '', '/Avans-2.1-LU1-POC-frontend' + redirectPath);
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename="/Avans-2.1-LU1-POC-frontend">
            <TranslationProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </TranslationProvider>
        </BrowserRouter>
    </StrictMode>,
)
