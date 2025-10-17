import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Modal,
    Form,
    Alert,
    Spinner,
    Badge
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';
import { courseService } from '../services/courseService';
import type { Course, CreateCourseRequest } from '../services/courseService';
import { handleApiError } from '../utils/errorHandler';

const CourseManagement: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslations({
        keys: [
            'courseManagement.title',
            'courseManagement.subtitle',
            'courseManagement.accessDenied',
            'courseManagement.loadCourses',
            'courseManagement.createNew',
            'courseManagement.noCourses',
            'courseManagement.loading',
            'courseManagement.error',
            'courseManagement.success',
            'courseManagement.delete.confirm',
            'courseManagement.delete.success',
            'courseManagement.delete.error',
            'courseManagement.form.title',
            'courseManagement.form.titleNL',
            'courseManagement.form.titleEN',
            'courseManagement.form.descriptionNL',
            'courseManagement.form.descriptionEN',
            'courseManagement.form.languages',
            'courseManagement.form.tags',
            'courseManagement.form.save',
            'courseManagement.form.cancel',
            'courseManagement.form.creating',
            'courseManagement.form.updating',
            'courseManagement.table.title',
            'courseManagement.table.languages',
            'courseManagement.table.tags',
            'courseManagement.table.actions',
            'courseManagement.actions.edit',
            'courseManagement.actions.delete'
        ]
    });

    // State
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUnauthorizedError, setIsUnauthorizedError] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState<CreateCourseRequest>({
        titleNL: '',
        titleEN: '',
        descriptionNL: '',
        descriptionEN: '',
        languages: [],
        tags: []
    });

    // Form input state for tags (to prevent typing interruption)
    const [tagsInput, setTagsInput] = useState('');

    // Load courses on component mount
    useEffect(() => {
        if (user && (user.role === 'TEACHER' || user.role === 'ADMIN')) {
            loadCourses();
        }
    }, [user]);

    // Clear messages when component unmounts
    useEffect(() => {
        return () => {
            setSuccess(null);
            setError(null);
        };
    }, []);

    const loadCourses = async () => {
        setLoading(true);
        setError(null);
        setIsUnauthorizedError(false);
        try {
            const data = await courseService.getAllCourses();
            setCourses(data);
        } catch (err) {
            const errorInfo = handleApiError(err, t('courseManagement.error') || 'Failed to load courses');
            setError(errorInfo.message);
            setIsUnauthorizedError(errorInfo.shouldShowLoginPrompt);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCourse(null);
        setFormData({
            titleNL: '',
            titleEN: '',
            descriptionNL: '',
            descriptionEN: '',
            languages: [],
            tags: []
        });
        setTagsInput('');
        setShowModal(true);
    };

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setFormData({
            titleNL: course.title?.dutch || '',
            titleEN: course.title?.english || '',
            descriptionNL: course.description?.dutch || '',
            descriptionEN: course.description?.english || '',
            languages: course.languages || [],
            tags: course.tags?.map(tag => tag.tagName) || []
        });
        setTagsInput(course.tags?.map(tag => tag.tagName).join(', ') || '');
        setShowModal(true);
    };

    const handleDelete = async (course: Course) => {
        if (window.confirm(t('courseManagement.delete.confirm') || 'Are you sure you want to delete this course?')) {
            try {
                await courseService.deleteCourse(course.uuid);
                setSuccess(t('courseManagement.delete.success') || 'Course deleted successfully');
                loadCourses();
            } catch (err) {
                const errorInfo = handleApiError(err, t('courseManagement.delete.error') || 'Failed to delete course');
                setError(errorInfo.message);
                setIsUnauthorizedError(errorInfo.shouldShowLoginPrompt);
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setIsUnauthorizedError(false);

        try {
            // Parse tags from input
            const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            const courseData = { ...formData, tags };

            if (editingCourse) {
                await courseService.updateCourse(editingCourse.uuid, courseData);
                setSuccess(t('courseManagement.success') || 'Course updated successfully');
            } else {
                await courseService.createCourse(courseData);
                setSuccess(t('courseManagement.success') || 'Course created successfully');
            }

            setShowModal(false);
            loadCourses();
        } catch (err) {
            const errorInfo = handleApiError(err, t('courseManagement.error') || 'Failed to save course');
            setError(errorInfo.message);
            setIsUnauthorizedError(errorInfo.shouldShowLoginPrompt);
        } finally {
            setSaving(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingCourse(null);
        setError(null);
        setIsUnauthorizedError(false);
    };

    const handleInputChange = (field: keyof CreateCourseRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLanguageChange = (language: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            languages: checked
                ? [...prev.languages, language]
                : prev.languages.filter(lang => lang !== language)
        }));
    };

    // Helper function to get localized content
    const getLocalizedContent = (content: { dutch?: string; english?: string } | null | undefined, fallback: string = 'Unknown') => {
        if (!content) return fallback;
        return content.dutch || content.english || fallback;
    };

    // Check if user has access
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
        return (
            <Container className="py-4">
                <Alert variant="danger">
                    <h4>{t('courseManagement.accessDenied') || 'Access Denied'}</h4>
                    <p>You don't have permission to access this page.</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Row>
                <Col>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="h2 fw-bold text-light-custom mb-1">
                                {t('courseManagement.title') || 'Course Management'}
                            </h1>
                            <p className="text-muted-custom mb-0">
                                {t('courseManagement.subtitle') || 'Manage courses and programs'}
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" onClick={loadCourses} disabled={loading}>
                                {loading ? <Spinner size="sm" /> : (t('courseManagement.loadCourses') || 'Load Courses')}
                            </Button>
                            <Button variant="primary" onClick={handleCreate}>
                                {t('courseManagement.createNew') || 'Create New Course'}
                            </Button>
                        </div>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <Alert variant="danger" dismissible onClose={() => { setError(null); setIsUnauthorizedError(false); }}>
                            {error}
                            {isUnauthorizedError && (
                                <> <Link to="/logout" className="text-decoration-underline">Click here to log back in</Link>.</>
                            )}
                        </Alert>
                    )}
                    {success && (
                        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
                            {success}
                        </Alert>
                    )}

                    {/* Courses Table */}
                    <Card className="bg-medium-dark-custom border-dark-custom shadow">
                        <Card.Body>
                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="text-muted-custom mt-3">
                                        {t('courseManagement.loading') || 'Loading courses...'}
                                    </p>
                                </div>
                            ) : courses.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted-custom">
                                        {t('courseManagement.noCourses') || 'No courses found'}
                                    </p>
                                </div>
                            ) : (
                                <Table responsive className="table-dark mb-0">
                                    <thead>
                                        <tr>
                                            <th>{t('courseManagement.table.title') || 'Title'}</th>
                                            <th>{t('courseManagement.table.languages') || 'Languages'}</th>
                                            <th>{t('courseManagement.table.tags') || 'Tags'}</th>
                                            <th>{t('courseManagement.table.actions') || 'Actions'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course) => (
                                            <tr key={course.uuid}>
                                                <td>
                                                    <div>
                                                        <strong className="text-light-custom">
                                                            {getLocalizedContent(course.title, 'Unknown Course')}
                                                        </strong>
                                                        <br />
                                                        <small className="text-muted-custom">
                                                            {getLocalizedContent(course.description, 'No description')}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1 flex-wrap">
                                                        {course.languages.map(lang => (
                                                            <Badge key={lang} bg="secondary" className="small">
                                                                {lang}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1 flex-wrap">
                                                        {course.tags.slice(0, 3).map(tag => (
                                                            <Badge key={tag._id} bg="outline-primary" className="small">
                                                                {tag.tagName}
                                                            </Badge>
                                                        ))}
                                                        {course.tags.length > 3 && (
                                                            <Badge bg="outline-secondary" className="small">
                                                                +{course.tags.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEdit(course)}
                                                        >
                                                            {t('courseManagement.actions.edit') || 'Edit'}
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDelete(course)}
                                                        >
                                                            {t('courseManagement.actions.delete') || 'Delete'}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Create/Edit Modal */}
            <Modal show={showModal} onHide={handleModalClose} size="lg" backdrop="static">
                <Modal.Header closeButton className="bg-dark-custom border-dark">
                    <Modal.Title className="text-light-custom">
                        {editingCourse
                            ? `${t('courseManagement.actions.edit') || 'Edit'} Course`
                            : `${t('courseManagement.createNew') || 'Create New'} Course`
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-medium-dark-custom">
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('courseManagement.form.titleNL') || 'Title (Dutch)'}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.titleNL}
                                        onChange={(e) => handleInputChange('titleNL', e.target.value)}
                                        className="bg-dark-custom text-light-custom border-dark"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('courseManagement.form.titleEN') || 'Title (English)'}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.titleEN}
                                        onChange={(e) => handleInputChange('titleEN', e.target.value)}
                                        className="bg-dark-custom text-light-custom border-dark"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('courseManagement.form.descriptionNL') || 'Description (Dutch)'}
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.descriptionNL}
                                        onChange={(e) => handleInputChange('descriptionNL', e.target.value)}
                                        className="bg-dark-custom text-light-custom border-dark"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('courseManagement.form.descriptionEN') || 'Description (English)'}
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.descriptionEN}
                                        onChange={(e) => handleInputChange('descriptionEN', e.target.value)}
                                        className="bg-dark-custom text-light-custom border-dark"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-light-custom">
                                {t('courseManagement.form.languages') || 'Languages'}
                            </Form.Label>
                            <div className="d-flex gap-3">
                                {['NL', 'EN', 'DE', 'FR', 'ES'].map(lang => (
                                    <Form.Check
                                        key={lang}
                                        type="checkbox"
                                        id={`lang-${lang}`}
                                        label={lang}
                                        checked={formData.languages.includes(lang)}
                                        onChange={(e) => handleLanguageChange(lang, e.target.checked)}
                                        className="text-light-custom"
                                    />
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-light-custom">
                                {t('courseManagement.form.tags') || 'Tags (comma-separated)'}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="e.g., programming, web development, backend"
                                className="bg-dark-custom text-light-custom border-dark"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="bg-dark-custom border-dark">
                    <Button variant="secondary" onClick={handleModalClose}>
                        {t('courseManagement.form.cancel') || 'Cancel'}
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Spinner size="sm" className="me-2" />
                                {editingCourse
                                    ? (t('courseManagement.form.updating') || 'Updating...')
                                    : (t('courseManagement.form.creating') || 'Creating...')
                                }
                            </>
                        ) : (
                            t('courseManagement.form.save') || 'Save'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CourseManagement;