import { AxiosError } from 'axios';

export interface ApiErrorResponse {
    message: string;
    error?: string;
    statusCode: number;
}

export interface ErrorHandlerResult {
    message: string;
    shouldShowLoginPrompt: boolean;
}

/**
 * Handles API errors and provides consistent error messages
 * @param error - The error object (AxiosError or generic Error)
 * @param fallbackMessage - Fallback message if error parsing fails
 * @returns Formatted error information
 */
export function handleApiError(error: unknown, fallbackMessage: string = 'An unexpected error occurred'): ErrorHandlerResult {
    console.error('API Error:', error);

    // Handle Axios errors (from course service using axios)
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;

        if (axiosError.response?.data) {
            const errorData = axiosError.response.data;

            switch (errorData.statusCode) {
                case 401:
                    return {
                        message: `${errorData.message || 'Unauthorized access'}. You might need to log back in.`,
                        shouldShowLoginPrompt: true
                    };
                case 404:
                    return {
                        message: errorData.message || 'Resource not found',
                        shouldShowLoginPrompt: false
                    };
                default:
                    return {
                        message: errorData.message || fallbackMessage,
                        shouldShowLoginPrompt: false
                    };
            }
        } else if (axiosError.response?.status === 401) {
            return {
                message: 'Unauthorized access. You might need to log back in.',
                shouldShowLoginPrompt: true
            };
        } else if (axiosError.response?.status === 404) {
            return {
                message: 'Resource not found',
                shouldShowLoginPrompt: false
            };
        }
    }

    // Handle fetch errors (from subject service using fetch)
    if (error instanceof Error) {
        const errorMessage = error.message;

        // Check if the error message contains status codes
        if (errorMessage.includes('(401)') || errorMessage.includes('Unauthorized')) {
            return {
                message: `${errorMessage}. You might need to log back in.`,
                shouldShowLoginPrompt: true
            };
        }

        if (errorMessage.includes('(404)') || errorMessage.includes('Not Found')) {
            return {
                message: errorMessage,
                shouldShowLoginPrompt: false
            };
        }

        return {
            message: errorMessage,
            shouldShowLoginPrompt: false
        };
    }

    // Handle network errors or other cases
    if (error && typeof error === 'object' && 'message' in error) {
        return {
            message: (error as Error).message || fallbackMessage,
            shouldShowLoginPrompt: false
        };
    }

    return {
        message: fallbackMessage,
        shouldShowLoginPrompt: false
    };
}

/**
 * Creates a formatted error message for 401 Unauthorized errors
 */
export function createUnauthorizedMessage(baseMessage: string = 'Unauthorized'): string {
    return `${baseMessage}. You might need to log back in.`;
}