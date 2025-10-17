import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { courseService } from '../services/courseService';
import type { Course } from '../services/courseService';
import { useTranslations } from '../hooks/useTranslations';
import { useTranslation } from '../contexts/TranslationContext';

interface CourseSelectorProps {
    onCourseChange?: (course: Course | null) => void;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({ onCourseChange }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
    const [selectedCourseUuid, setSelectedCourseUuid] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);

    const { currentLanguage } = useTranslation();
    const { t } = useTranslations({
        keys: [
            'dashboard.course.title',
            'dashboard.course.selectCourse',
            'dashboard.course.noCourseSelected',
            'dashboard.course.selectPlaceholder',
            'dashboard.course.save',
            'dashboard.course.saving',
            'dashboard.course.success',
            'dashboard.course.error',
            'dashboard.course.loadingCourses',
            'dashboard.course.errorLoadingCourses'
        ]
    });

    const getLocalizedTitle = (course: Course) => {
        return course.title[currentLanguage as keyof typeof course.title] || course.title.english;
    };

    const getLocalizedDescription = (course: Course) => {
        return course.description[currentLanguage as keyof typeof course.description] || course.description.english;
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setMessage(null);

        try {
            // Load all available courses
            const allCourses = await courseService.getAllCourses();
            setCourses(allCourses);

            // Load current joined course
            try {
                const joinedCourses = await courseService.getJoinedCourse();
                const joined = joinedCourses.length > 0 ? joinedCourses[0] : null;
                setCurrentCourse(joined);
                setSelectedCourseUuid(joined?.uuid || '');
                onCourseChange?.(joined);
            } catch (error) {
                // No course joined yet, that's fine
                setCurrentCourse(null);
                setSelectedCourseUuid('');
                onCourseChange?.(null);
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            setMessage({
                type: 'danger',
                text: t('dashboard.course.errorLoadingCourses')
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedCourseUuid) {
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            await courseService.joinCourse(selectedCourseUuid);

            // Find the selected course in our courses array
            const selectedCourse = courses.find(course => course.uuid === selectedCourseUuid);
            setCurrentCourse(selectedCourse || null);
            onCourseChange?.(selectedCourse || null);

            setMessage({
                type: 'success',
                text: t('dashboard.course.success')
            });

            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error joining course:', error);
            setMessage({
                type: 'danger',
                text: t('dashboard.course.error')
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCourseChange = (courseUuid: string) => {
        setSelectedCourseUuid(courseUuid);
        setMessage(null);
    };

    if (loading) {
        return (
            <Card className="h-100">
                <Card.Header>
                    <h5 className="card-title mb-0">
                        <i className="me-2">📚</i>
                        {t('dashboard.course.title')}
                    </h5>
                </Card.Header>
                <Card.Body className="d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" className="mb-2" />
                        <p className="text-muted-custom mb-0">{t('dashboard.course.loadingCourses')}</p>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="h-100">
            <Card.Header>
                <h5 className="card-title mb-0">
                    <i className="me-2">📚</i>
                    {t('dashboard.course.title')}
                </h5>
            </Card.Header>
            <Card.Body>
                {message && (
                    <Alert variant={message.type} className="mb-3">
                        {message.text}
                    </Alert>
                )}

                {currentCourse && (
                    <div className="mb-3 p-3 bg-dark rounded border border-secondary">
                        <h6 className="text-bg-dark mb-1">
                            {getLocalizedTitle(currentCourse)}
                        </h6>
                        <small className="text-bg-dark">
                            {getLocalizedDescription(currentCourse)}
                        </small>
                    </div>
                )}

                {!currentCourse && (
                    <div className="mb-3 p-3 bg-light rounded text-center">
                        <small className="text-muted">
                            {t('dashboard.course.noCourseSelected')}
                        </small>
                    </div>
                )}

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>{t('dashboard.course.selectCourse')}</Form.Label>
                        <Form.Select
                            value={selectedCourseUuid}
                            onChange={(e) => handleCourseChange(e.target.value)}
                            disabled={saving}
                        >
                            <option value="">{t('dashboard.course.selectPlaceholder')}</option>
                            {courses.map((course) => (
                                <option key={course.uuid} value={course.uuid}>
                                    {getLocalizedTitle(course)}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={!selectedCourseUuid || saving || selectedCourseUuid === currentCourse?.uuid}
                        className="w-100"
                    >
                        {saving ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                {t('dashboard.course.saving')}
                            </>
                        ) : (
                            t('dashboard.course.save')
                        )}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CourseSelector;