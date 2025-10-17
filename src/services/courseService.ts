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
}

export const courseService = new CourseService();