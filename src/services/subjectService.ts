import { api } from '../contexts/AuthContext';
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
    private async handleResponse<T>(axiosResponse: any): Promise<T> {
        return axiosResponse.data;
    }

    async getAllSubjects(filters?: SubjectFilters): Promise<Subject[]> {
        try {
            let url = '/subjects';

            if (filters) {
                const params = new URLSearchParams();
                if (filters.level) params.append('level', filters.level);
                if (filters.points) params.append('points', filters.points.toString());
                if (filters.tag) params.append('tag', filters.tag);

                if (params.toString()) {
                    url += '?' + params.toString();
                }
            }

            const response = await api.get(url);
            return this.handleResponse<Subject[]>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to load subjects');
            throw new Error(errorInfo.message);
        }
    }

    async getSubjectById(uuid: string): Promise<Subject> {
        try {
            const response = await api.get(`/subjects/${uuid}`);
            return this.handleResponse<Subject>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to load subject');
            throw new Error(errorInfo.message);
        }
    }

    async createSubject(subjectData: CreateSubjectRequest): Promise<Subject> {
        try {
            const response = await api.post('/subjects', subjectData);
            return this.handleResponse<Subject>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to create subject');
            throw new Error(errorInfo.message);
        }
    }

    async updateSubject(uuid: string, subjectData: UpdateSubjectRequest): Promise<Subject> {
        try {
            const response = await api.patch(`/subjects/${uuid}`, subjectData);
            return this.handleResponse<Subject>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to update subject');
            throw new Error(errorInfo.message);
        }
    }

    async deleteSubject(uuid: string): Promise<{ message: string }> {
        try {
            const response = await api.delete(`/subjects/${uuid}`);
            return this.handleResponse<{ message: string }>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to delete subject');
            throw new Error(errorInfo.message);
        }
    }

    async addToFavourites(uuid: string): Promise<any> {
        try {
            const response = await api.post(`/subjects/favourite/${uuid}`);
            return this.handleResponse<any>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to add subject to favourites');
            throw new Error(errorInfo.message);
        }
    }

    async removeFromFavourites(uuid: string): Promise<any> {
        try {
            const response = await api.delete(`/subjects/favourite/${uuid}`);
            return this.handleResponse<any>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to remove subject from favourites');
            throw new Error(errorInfo.message);
        }
    }

    // Public methods for user-facing subject browsing
    async getAllSubjectsPublic(filters?: SubjectFilters): Promise<Subject[]> {
        try {
            let url = '/subjects';

            if (filters) {
                const params = new URLSearchParams();
                if (filters.level) params.append('level', filters.level);
                if (filters.points) params.append('points', filters.points.toString());
                if (filters.tag) params.append('tag', filters.tag);

                if (params.toString()) {
                    url += '?' + params.toString();
                }
            }

            const response = await api.get(url);
            return this.handleResponse<Subject[]>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to load subjects');
            throw new Error(errorInfo.message);
        }
    }

    async getRecommendedSubjects(): Promise<RecommendedSubject[]> {
        try {
            const response = await api.get('/subjects/reccomended');
            return this.handleResponse<RecommendedSubject[]>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to load recommended subjects');
            throw new Error(errorInfo.message);
        }
    }

    async getFavouriteSubjects(): Promise<Subject[]> {
        try {
            const response = await api.get('/subjects/favourites');
            return this.handleResponse<Subject[]>(response);
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to load favourite subjects');
            throw new Error(errorInfo.message);
        }
    }
}

export const subjectService = new SubjectService();