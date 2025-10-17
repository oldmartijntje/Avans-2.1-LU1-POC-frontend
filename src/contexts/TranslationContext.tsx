import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { translationService } from '../services/translationService';
import { config } from '../config/config';

type Language = typeof config.LANGUAGES[number];

interface TranslationContextType {
    translations: Record<string, string>;
    loading: boolean;
    error: string | null;
    currentLanguage: Language;
    loadTranslations: (keys: string[]) => Promise<void>;
    t: (key: string, fallback?: string) => string;
    clearCache: () => void;
    getCacheInfo: () => Array<{ keys: string[], timestamp: number, valid: boolean, notFoundKeys: string[] }>;
    getNotFoundKeys: () => string[];
    setLanguage: (language: Language) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
    children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentLanguage, setCurrentLanguage] = useState<Language>(translationService.getCurrentLanguage());
    const translationsRef = useRef(translations);

    // Keep ref in sync with state
    translationsRef.current = translations;

    const loadTranslations = useCallback(async (keys: string[]) => {
        // Use a ref to access current translations to avoid dependency issues
        const currentTranslations = translationsRef.current;
        const notFoundKeys = translationService.getNotFoundKeys();
        const missingKeys = keys.filter(key => !currentTranslations[key] && !notFoundKeys.includes(key));

        if (missingKeys.length === 0) return;

        // Inline the refresh logic to avoid circular dependencies
        setLoading(true);
        setError(null);

        try {
            const result = await translationService.fetchTranslations(missingKeys);
            setTranslations(prev => ({ ...prev, ...result }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load translations');
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshTranslations = useCallback(async (keys: string[]) => {
        setLoading(true);
        setError(null);

        try {
            const result = await translationService.fetchTranslations(keys);
            setTranslations(prev => ({ ...prev, ...result }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load translations');
        } finally {
            setLoading(false);
        }
    }, []);

    const setLanguage = useCallback(async (language: Language) => {
        translationService.setLanguage(language);
        setCurrentLanguage(language);

        // Reload existing translations for the new language
        const currentKeys = Object.keys(translationsRef.current);
        if (currentKeys.length > 0) {
            await refreshTranslations(currentKeys);
        }
    }, [refreshTranslations]);

    const t = useCallback((key: string, fallback?: string): string => {
        const translation = translations[key];
        if (translation !== undefined) {
            return translation;
        }

        if (fallback !== undefined) {
            return fallback;
        }

        // Return the key itself as ultimate fallback
        return key;
    }, [translations]);

    const clearCache = useCallback(() => {
        translationService.clearCache();
        setTranslations({});
        setError(null);
    }, []);

    const getCacheInfo = useCallback(() => {
        return translationService.getCacheEntries();
    }, []);

    const getNotFoundKeys = useCallback(() => {
        return translationService.getNotFoundKeys();
    }, []);

    const value: TranslationContextType = {
        translations,
        loading,
        error,
        loadTranslations,
        t,
        clearCache,
        getCacheInfo,
        getNotFoundKeys,
        currentLanguage,
        setLanguage,
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = (): TranslationContextType => {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};