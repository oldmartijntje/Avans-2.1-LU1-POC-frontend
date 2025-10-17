import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { translationService } from '../services/translationService';

/**
 * Hook that clears the persistent translation cache when visiting authentication pages
 */
export const useAuthPageCacheClearer = () => {
    const location = useLocation();

    useEffect(() => {
        const authPages = ['/login', '/logout', '/register'];
        
        if (authPages.includes(location.pathname)) {
            console.log('Visiting auth page, clearing persistent translation cache');
            translationService.clearPersistentTranslationCache();
        }
    }, [location.pathname]);
};