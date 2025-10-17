// Configuration for the application
export const config = {
    // API base URL - change this to match your backend server
    API_BASE_URL: import.meta.env.VITE_API_URL || '/api',

    // Default language
    DEFAULT_LANGUAGE: 'english' as const,

    // Available languages
    LANGUAGES: ['english', 'dutch'] as const,

    // Translation cache settings
    TRANSLATION_CACHE_TTL: 5 * 60 * 1000, // 5 minutes in milliseconds
} as const;