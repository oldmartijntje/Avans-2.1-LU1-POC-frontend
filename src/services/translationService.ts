import { api } from '../contexts/AuthContext';
import { config } from '../config/config';
import { handleApiError } from '../utils/errorHandler';

type Language = typeof config.LANGUAGES[number];

export interface TranslationRequest {
    uiKeys: string[];
}

export interface TranslationResponseItem {
    _id?: string;
    uiKey: string;
    dutch?: string;
    english?: string;
    displayText?: string;
    notFound?: boolean;
    creatorUuid?: string;
    __v?: number;
}

export interface TranslationResponse {
    translations?: Record<string, string>;
    // Support multiple response formats
}

export interface TranslationCache {
    translations: Record<string, string>;
    notFoundKeys: Set<string>; // Track keys that don't exist
    timestamp: number;
}

class TranslationService {
    private cache: Map<string, TranslationCache> = new Map();
    private notFoundKeys: Set<string> = new Set(); // Global tracking of missing keys
    private currentLanguage: Language = this.initializeLanguage();

    private initializeLanguage(): Language {
        // Check localStorage first
        const storedLanguage = localStorage.getItem('selectedLanguage') as Language;
        if (storedLanguage && config.LANGUAGES.includes(storedLanguage)) {
            return storedLanguage;
        }

        // Check device language preference
        const deviceLanguage = this.getDeviceLanguagePreference();
        if (deviceLanguage) {
            return deviceLanguage;
        }

        // Fall back to default
        return config.DEFAULT_LANGUAGE;
    }

    private getDeviceLanguagePreference(): Language | null {
        const browserLanguage = navigator.language.toLowerCase();

        // Check for exact matches or language prefixes
        if (browserLanguage.startsWith('nl') || browserLanguage.startsWith('dutch')) {
            return 'dutch';
        } else if (browserLanguage.startsWith('en') || browserLanguage.startsWith('english')) {
            return 'english';
        }

        // Check navigator.languages array for additional preferences
        for (const lang of navigator.languages) {
            const langLower = lang.toLowerCase();
            if (langLower.startsWith('nl')) {
                return 'dutch';
            } else if (langLower.startsWith('en')) {
                return 'english';
            }
        }

        return null;
    }

    private getCacheKey(keys: string[]): string {
        return keys.sort().join('|');
    }

    private isCacheValid(cache: TranslationCache): boolean {
        return Date.now() - cache.timestamp < config.TRANSLATION_CACHE_TTL;
    }

    private getFromCache(keys: string[]): Record<string, string> | null {
        const cacheKey = this.getCacheKey(keys);
        const cache = this.cache.get(cacheKey);

        if (cache && this.isCacheValid(cache)) {
            // Check if all requested keys are in cache (either as translations or known missing)
            const hasAllKeys = keys.every(key =>
                key in cache.translations || cache.notFoundKeys.has(key)
            );
            if (hasAllKeys) {
                // Return only the requested keys with fallback for missing ones
                const filteredTranslations: Record<string, string> = {};
                keys.forEach(key => {
                    if (cache.notFoundKeys.has(key)) {
                        filteredTranslations[key] = key; // Use key as fallback
                    } else {
                        filteredTranslations[key] = cache.translations[key];
                    }
                });
                return filteredTranslations;
            }
        }

        return null;
    }

    private saveToCache(keys: string[], translations: Record<string, string>, notFoundKeys: Set<string>): void {
        const cacheKey = this.getCacheKey(keys);
        const cache: TranslationCache = {
            translations,
            notFoundKeys: new Set(notFoundKeys),
            timestamp: Date.now()
        };
        this.cache.set(cacheKey, cache);
    }

    private filterKeysToFetch(keys: string[]): string[] {
        // Only fetch keys that are not globally known to be missing
        return keys.filter(key => !this.notFoundKeys.has(key));
    }

    async fetchTranslations(keys: string[]): Promise<Record<string, string>> {
        if (keys.length === 0) {
            return {};
        }

        // Check cache first
        const cachedTranslations = this.getFromCache(keys);
        if (cachedTranslations) {
            console.log('Returning cached translations for keys:', keys);
            return cachedTranslations;
        }

        // Filter out keys that are globally known to be missing
        const keysToFetch = this.filterKeysToFetch(keys);

        // Prepare result with fallbacks for known missing keys
        const result: Record<string, string> = {};
        keys.forEach(key => {
            if (this.notFoundKeys.has(key)) {
                result[key] = key; // Use key as fallback for known missing keys
            }
        });

        // If no keys need fetching, return the result
        if (keysToFetch.length === 0) {
            console.log('All keys are known to be missing, returning fallbacks');
            return result;
        }

        try {
            console.log('Fetching translations for keys:', keysToFetch);
            console.log('Using authenticated API client with JWT token');

            const requestBody: TranslationRequest = {
                uiKeys: keysToFetch
            };

            // Using authenticated axios instance that includes JWT Bearer token
            const response = await api.post(
                `/display-text`,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000, // 10 second timeout
                }
            );

            const translations: Record<string, string> = {};
            const notFoundKeys = new Set<string>();

            // Handle multiple response formats
            if (Array.isArray(response.data)) {
                // Array format: can be either notFound items or translation objects
                response.data.forEach((item: TranslationResponseItem) => {
                    if (item.notFound) {
                        // NotFound format: { uiKey: "key", notFound: true }
                        notFoundKeys.add(item.uiKey);
                        this.notFoundKeys.add(item.uiKey); // Add to global missing keys
                        result[item.uiKey] = item.uiKey; // Use key as fallback
                    } else if (item.displayText) {
                        // DisplayText format: { uiKey: "key", displayText: "text" }
                        translations[item.uiKey] = item.displayText;
                        result[item.uiKey] = item.displayText;
                    } else if (item.dutch || item.english) {
                        // New API format: { uiKey: "key", dutch: "tekst", english: "text", ... }
                        let translationText = item.uiKey; // fallback to key

                        if (this.currentLanguage === 'dutch' && item.dutch) {
                            translationText = item.dutch;
                        } else if (this.currentLanguage === 'english' && item.english) {
                            translationText = item.english;
                        } else if (item.english) {
                            // Fallback to English if default language not available
                            translationText = item.english;
                        } else if (item.dutch) {
                            // Fallback to Dutch if English not available
                            translationText = item.dutch;
                        }

                        translations[item.uiKey] = translationText;
                        result[item.uiKey] = translationText;
                    }
                });
            } else if (response.data.translations) {
                // Old format: object with translations property
                Object.assign(translations, response.data.translations);
                Object.assign(result, response.data.translations);

                // Mark unfound keys as missing
                keysToFetch.forEach(key => {
                    if (!(key in translations)) {
                        notFoundKeys.add(key);
                        this.notFoundKeys.add(key);
                        result[key] = key;
                    }
                });
            }

            // Save to cache (including not found information)
            this.saveToCache(keys, translations, notFoundKeys);

            console.log('Fetched translations:', translations);
            console.log('Not found keys:', Array.from(notFoundKeys));
            return result;

        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to fetch translations');
            console.error('Translation service error:', errorInfo.message);

            // Return fallback translations using the keys as values
            const fallbackTranslations: Record<string, string> = {};
            keys.forEach(key => {
                fallbackTranslations[key] = key; // Use key as fallback text
            });

            return fallbackTranslations;
        }
    }

    clearCache(): void {
        this.cache.clear();
        this.notFoundKeys.clear();
    }

    getCacheSize(): number {
        return this.cache.size;
    }

    getNotFoundKeys(): string[] {
        return Array.from(this.notFoundKeys);
    }

    getCacheEntries(): Array<{ keys: string[], timestamp: number, valid: boolean, notFoundKeys: string[] }> {
        const entries: Array<{ keys: string[], timestamp: number, valid: boolean, notFoundKeys: string[] }> = [];

        for (const [cacheKey, cache] of this.cache.entries()) {
            const keys = cacheKey.split('|');
            entries.push({
                keys,
                timestamp: cache.timestamp,
                valid: this.isCacheValid(cache),
                notFoundKeys: Array.from(cache.notFoundKeys)
            });
        }

        return entries;
    }

    setLanguage(language: Language): void {
        if (this.currentLanguage !== language) {
            this.currentLanguage = language;

            // Store the selected language in localStorage
            localStorage.setItem('selectedLanguage', language);

            // Clear cache when language changes to force re-fetching with new language
            this.clearCache();
        }
    }

    getCurrentLanguage(): Language {
        return this.currentLanguage;
    }

    getStoredLanguagePreference(): Language | null {
        const storedLanguage = localStorage.getItem('selectedLanguage') as Language;
        return storedLanguage && config.LANGUAGES.includes(storedLanguage) ? storedLanguage : null;
    }

    clearStoredLanguagePreference(): void {
        localStorage.removeItem('selectedLanguage');
    }

    getLanguageDebugInfo(): {
        current: Language;
        stored: Language | null;
        devicePreference: Language | null;
        browserLanguage: string;
        browserLanguages: readonly string[];
    } {
        return {
            current: this.currentLanguage,
            stored: this.getStoredLanguagePreference(),
            devicePreference: this.getDeviceLanguagePreference(),
            browserLanguage: navigator.language,
            browserLanguages: navigator.languages
        };
    }
}

// Export singleton instance
export const translationService = new TranslationService();