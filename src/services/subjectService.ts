import { config } from '../config/config';

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
            const errorData: ApiError = await response.json();
            throw new Error(`${errorData.message} (${errorData.statusCode})`);
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
    }

    async getSubjectById(uuid: string): Promise<Subject> {
        const response = await fetch(`${this.baseUrl}/${uuid}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        return this.handleResponse<Subject>(response);
    }

    async createSubject(subjectData: CreateSubjectRequest): Promise<Subject> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(subjectData)
        });

        return this.handleResponse<Subject>(response);
    }

    async updateSubject(uuid: string, subjectData: UpdateSubjectRequest): Promise<Subject> {
        const response = await fetch(`${this.baseUrl}/${uuid}`, {
            method: 'PATCH',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(subjectData)
        });

        return this.handleResponse<Subject>(response);
    }

    async deleteSubject(uuid: string): Promise<{ message: string }> {
        const response = await fetch(`${this.baseUrl}/${uuid}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });

        return this.handleResponse<{ message: string }>(response);
    }

    async addToFavourites(uuid: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/favourite/${uuid}`, {
            method: 'POST',
            headers: this.getAuthHeaders()
        });

        return this.handleResponse<any>(response);
    }

    async removeFromFavourites(uuid: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/favourite/${uuid}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });

        return this.handleResponse<any>(response);
    }

    // Public methods for user-facing subject browsing
    async getAllSubjectsPublic(filters?: SubjectFilters): Promise<Subject[]> {
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
    }

    async getRecommendedSubjects(): Promise<RecommendedSubject[]> {
        const response = await fetch(`${this.baseUrl}/reccomended`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        return this.handleResponse<RecommendedSubject[]>(response);
    }

    async getFavouriteSubjects(): Promise<Subject[]> {
        const response = await fetch(`${this.baseUrl}/favourites`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        return this.handleResponse<Subject[]>(response);
    }
}

export const subjectService = new SubjectService();