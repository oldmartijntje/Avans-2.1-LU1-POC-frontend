import { useEffect, useMemo } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface UseTranslationsOptions {
    keys: string[];
    loadOnMount?: boolean;
}

export const useTranslations = ({ keys, loadOnMount = true }: UseTranslationsOptions) => {
    const { t, loadTranslations, loading, error } = useTranslation();

    // Memoize the keys array to prevent unnecessary re-renders
    const memoizedKeys = useMemo(() => keys, [JSON.stringify(keys)]);

    useEffect(() => {
        if (loadOnMount && memoizedKeys.length > 0) {
            loadTranslations(memoizedKeys);
        }
    }, [memoizedKeys, loadOnMount, loadTranslations]);

    return {
        t,
        loading,
        error,
        reload: () => loadTranslations(memoizedKeys)
    };
};