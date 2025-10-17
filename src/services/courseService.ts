import { api } from '../contexts/AuthContext';
import { handleApiError } from '../utils/errorHandler';

export interface CourseTitle {
    _id: string;
    dutch: string;
    english: string;
    creatorUuid: string;
    __v: number;
}

export interface CourseDescription {
    _id: string;
    dutch: string;
    english: string;
    creatorUuid: string;
    __v: number;
}

export interface CourseTag {
    _id: string;
    tagName: string;
    __v: number;
}

export interface Course {
    _id: string;
    uuid: string;
    title: CourseTitle;
    description: CourseDescription;
    languages: string[];
    tags: CourseTag[];
    __v: number;
}

export interface UserWithCourse {
    _id: string;
    uuid: string;
    username: string;
    email: string;
    role: string;
    study: Course;
    favourites: any[];
    __v: number;
}

export interface CourseError {
    message: string;
    error: string;
    statusCode: number;
}

export interface CreateCourseRequest {
    titleNL: string;
    titleEN: string;
    descriptionNL: string;
    descriptionEN: string;
    languages: string[];
    tags: string[];
}

export interface UpdateCourseRequest {
    titleNL?: string;
    titleEN?: string;
    descriptionNL?: string;
    descriptionEN?: string;
    languages?: string[];
    tags?: string[];
}

class CourseService {
    /**
     * Get all available courses
     */
    async getAllCourses(): Promise<Course[]> {
        try {
            const response = await api.get('/course');
            return response.data;
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to load courses');
            throw new Error(errorInfo.message);
        }
    }

    /**
     * Join a course by UUID
     */
    async joinCourse(courseUuid: string): Promise<UserWithCourse> {
        try {
            const response = await api.post(`/course/joined/${courseUuid}`);
            return response.data;
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to join course');
            throw new Error(errorInfo.message);
        }
    }

    /**
     * Get the currently joined course
     */
    async getJoinedCourse(): Promise<Course[]> {
        try {
            const response = await api.get('/course/joined');
            return response.data;
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to fetch joined course');
            throw new Error(errorInfo.message);
        }
    }

    /**
     * Leave the current course
     */
    async leaveCourse(): Promise<void> {
        try {
            await api.delete('/course/joined');
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to leave course');
            throw new Error(errorInfo.message);
        }
    }

    // CRUD Operations for Course Management

    /**
     * Create a new course
     */
    async createCourse(courseData: CreateCourseRequest): Promise<Course> {
        try {
            const response = await api.post('/course', courseData);
            return response.data;
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to create course');
            throw new Error(errorInfo.message);
        }
    }

    /**
     * Update an existing course
     */
    async updateCourse(uuid: string, courseData: UpdateCourseRequest): Promise<Course> {
        try {
            const response = await api.patch(`/course/${uuid}`, courseData);
            return response.data;
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to update course');
            throw new Error(errorInfo.message);
        }
    }

    /**
     * Delete a course
     */
    async deleteCourse(uuid: string): Promise<{ message: string }> {
        try {
            const response = await api.delete(`/course/${uuid}`);
            return response.data;
        } catch (error) {
            const errorInfo = handleApiError(error, 'Failed to delete course');
            throw new Error(errorInfo.message);
        }
    }
}

export const courseService = new CourseService();