import { useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface UseTranslationsOptions {
    keys: string[];
    loadOnMount?: boolean;
}

export const useTranslations = ({ keys, loadOnMount = true }: UseTranslationsOptions) => {
    const { t, loadTranslations, loading, error } = useTranslation();

    useEffect(() => {
        if (loadOnMount && keys.length > 0) {
            loadTranslations(keys);
        }
    }, [keys, loadOnMount, loadTranslations]);

    return {
        t,
        loading,
        error,
        reload: () => loadTranslations(keys)
    };
};