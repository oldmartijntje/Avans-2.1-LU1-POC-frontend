import { api } from '../contexts/AuthContext';

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
            console.error('Error fetching courses:', error);
            throw error;
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
            console.error('Error joining course:', error);
            throw error;
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
            console.error('Error fetching joined course:', error);
            throw error;
        }
    }

    /**
     * Leave the current course
     */
    async leaveCourse(): Promise<void> {
        try {
            await api.delete('/course/joined');
        } catch (error) {
            console.error('Error leaving course:', error);
            throw error;
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
            console.error('Error creating course:', error);
            throw error;
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
            console.error('Error updating course:', error);
            throw error;
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
            console.error('Error deleting course:', error);
            throw error;
        }
    }
}

export const courseService = new CourseService();