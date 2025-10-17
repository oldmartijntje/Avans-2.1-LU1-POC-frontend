import { config } from '../config/config';
import { handleApiError } from '../utils/errorHandler';

export interface Subject {
    uuid?: string;
    _id?: string;
    title?: {
        _id?: string;
        dutch: string;
        english: string;
        creatorUuid?: string;
        __v?: number;
    } | null;
    description?: {
        _id?: string;
        dutch: string;
        english: string;
        creatorUuid?: string;
        __v?: number;
    } | null;
    moreInfo?: {
        _id?: string;
        dutch: string;
        english: string;
        creatorUuid?: string;
        __v?: number;
    } | null;
    ownerUuid?: string;
    level: string;
    studyPoints: number;
    languages: string[];
    tags: Array<{
        _id?: string;
        tagName: string;
        __v?: number;
    }>;
    __v?: number;
    isFavourite?: boolean;
}

export interface RecommendedSubject extends Subject {
    matchPercentage: number;
}

export interface CreateSubjectRequest {
    titleNL: string;
    titleEN: string;
    descriptionNL: string;
    descriptionEN: string;
    moreInfoNL: string;
    moreInfoEN: string;
    level: string;
    studyPoints: number;
    languages: string[];
    tags: string[];
}

export interface UpdateSubjectRequest {
    titleNL?: string;
    titleEN?: string;
    descriptionNL?: string;
    descriptionEN?: string;
    moreInfoNL?: string;
    moreInfoEN?: string;
    level?: string;
    studyPoints?: number;
    languages?: string[];
    tags?: string[];
}

export interface SubjectFilters {
    level?: string;
    points?: number;
    tag?: string;
}

export interface ApiError {
    message: string;
    error?: string;
    statusCode: number;
}

class SubjectService {
    private baseUrl = `${config.API_BASE_URL}/subjects`;

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            let errorData: ApiError;
            try {
                errorData = await response.json();
            } catch {
                // If response doesn't have JSON, create a generic error
                errorData = {
                    message: response.statusText || 'Request failed',
                    statusCode: response.status
                };
            }

            // Create a proper error object that will be handled by handleApiError
            const error = new Error(`${errorData.message} (${errorData.statusCode})`);
            const errorInfo = handleApiError(error, 'Request failed');
            throw new Error(errorInfo.message);
        }
        return response.json();
    }

    private getAuthHeaders(): Record<string, string> {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    async getAllSubjects(filters?: SubjectFilters): Promise<Subject[]> {
        try {
            let url = this.baseUrl;

            if (filters) {
                const params = new URLSearchParams();
                if (filters.level) params.append('level', filters.level);
                if (filters.points) params.append('points', filters.points.toString());
                if (filters.tag) params.append('tag', filters.tag);

                if (params.toString()) {
                    url += '?' + params.toString();
                }
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            return this.handleResponse<Subject[]>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to load subjects');
            throw new Error(errorInfo.message);
        }
    }

    async getSubjectById(uuid: string): Promise<Subject> {
        try {
            const response = await fetch(`${this.baseUrl}/${uuid}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            return this.handleResponse<Subject>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to load subject');
            throw new Error(errorInfo.message);
        }
    }

    async createSubject(subjectData: CreateSubjectRequest): Promise<Subject> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(subjectData)
            });

            return this.handleResponse<Subject>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to create subject');
            throw new Error(errorInfo.message);
        }
    }

    async updateSubject(uuid: string, subjectData: UpdateSubjectRequest): Promise<Subject> {
        try {
            const response = await fetch(`${this.baseUrl}/${uuid}`, {
                method: 'PATCH',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(subjectData)
            });

            return this.handleResponse<Subject>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to update subject');
            throw new Error(errorInfo.message);
        }
    }

    async deleteSubject(uuid: string): Promise<{ message: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/${uuid}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            return this.handleResponse<{ message: string }>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to delete subject');
            throw new Error(errorInfo.message);
        }
    }

    async addToFavourites(uuid: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/favourite/${uuid}`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            return this.handleResponse<any>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to add subject to favourites');
            throw new Error(errorInfo.message);
        }
    }

    async removeFromFavourites(uuid: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/favourite/${uuid}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            return this.handleResponse<any>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to remove subject from favourites');
            throw new Error(errorInfo.message);
        }
    }

    // Public methods for user-facing subject browsing
    async getAllSubjectsPublic(filters?: SubjectFilters): Promise<Subject[]> {
        try {
            let url = this.baseUrl;

            if (filters) {
                const params = new URLSearchParams();
                if (filters.level) params.append('level', filters.level);
                if (filters.points) params.append('points', filters.points.toString());
                if (filters.tag) params.append('tag', filters.tag);

                if (params.toString()) {
                    url += '?' + params.toString();
                }
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            return this.handleResponse<Subject[]>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to load subjects');
            throw new Error(errorInfo.message);
        }
    }

    async getRecommendedSubjects(): Promise<RecommendedSubject[]> {
        try {
            const response = await fetch(`${this.baseUrl}/reccomended`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            return this.handleResponse<RecommendedSubject[]>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to load recommended subjects');
            throw new Error(errorInfo.message);
        }
    }

    async getFavouriteSubjects(): Promise<Subject[]> {
        try {
            const response = await fetch(`${this.baseUrl}/favourites`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            return this.handleResponse<Subject[]>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to load favourite subjects');
            throw new Error(errorInfo.message);
        }
    }
}

export const subjectService = new SubjectService();