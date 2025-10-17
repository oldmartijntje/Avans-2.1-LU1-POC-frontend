import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { TranslationProvider } from './contexts/TranslationContext';
import './styles/globals.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <TranslationProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </TranslationProvider>
        </BrowserRouter>
    </StrictMode>,
)
