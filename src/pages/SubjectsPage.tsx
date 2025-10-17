import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Alert,
    Spinner,
    ButtonGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { subjectService } from '../services/subjectService';
import type { Subject, SubjectFilters } from '../services/subjectService';
import SubjectList from '../components/SubjectList';

const SubjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslations({
        keys: [
            'subjects.title',
            'subjects.subtitle',
            'subjects.loadSubjects',
            'subjects.clearFilters',
            'subjects.loading',
            'subjects.error',
            'subjects.success',
            'subjects.filters.level',
            'subjects.filters.points',
            'subjects.filters.tag',
            'subjects.filters.allLevels',
            'subjects.filters.studyPointsPlaceholder',
            'subjects.filters.tagPlaceholder',
            'subjects.viewRecommended',
            'subjects.viewFavourites'
        ]
    });

    // State
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Filter state
    const [filters, setFilters] = useState<SubjectFilters>({
        level: '',
        points: undefined,
        tag: ''
    });

    // Load subjects on component mount and when filters change
    useEffect(() => {
        loadSubjects();
    }, []);

    // Clear messages when component unmounts
    useEffect(() => {
        return () => {
            setSuccess(null);
            setError(null);
        };
    }, []);

    const loadSubjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const filterParams: SubjectFilters = {};
            if (filters.level) filterParams.level = filters.level;
            if (filters.points) filterParams.points = filters.points;
            if (filters.tag) filterParams.tag = filters.tag;

            const data = await subjectService.getAllSubjectsPublic(filterParams);
            setSubjects(data);
            // Only show success message for explicit searches, not initial load
            if (Object.keys(filterParams).length > 0) {
                const message = t('subjects.success') || 'Subjects loaded successfully';
                setSuccess(message);
                // Auto-clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('404')) {
                    setError(t('subjects.error') || 'No subjects found');
                } else if (err.message.includes('401')) {
                    setError(t('subjects.error') || 'Unauthorized access');
                } else {
                    setError(err.message);
                }
            } else {
                setError(t('subjects.error') || 'Failed to load subjects');
            }
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilters({ level: '', points: undefined, tag: '' });
        // Reload subjects without filters
        setTimeout(() => loadSubjects(), 100);
    };

    const handleFilterChange = (field: keyof SubjectFilters, value: string | number | undefined) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Container className="py-4">
            <Row>
                <Col>
                    {/* Header */}
                    <div className="mb-4 d-flex justify-content-between align-items-start">
                        <div>
                            <h1 className="h2 fw-bold text-light-custom mb-1">
                                {t('subjects.title') || 'Available Subjects'}
                            </h1>
                            <p className="text-muted-custom mb-0">
                                {t('subjects.subtitle') || 'Browse and discover elective modules'}
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-warning"
                                onClick={() => navigate('/subjects/favourites')}
                            >
                                {t('subjects.viewFavourites') || 'View Favourites'}
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate('/subjects/recommended')}
                            >
                                {t('subjects.viewRecommended') || 'View Recommended'}
                            </Button>
                        </div>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <Alert variant="danger" dismissible onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
                            {success}
                        </Alert>
                    )}

                    {/* Filters */}
                    <Card className="bg-medium-dark-custom border-dark-custom mb-4 shadow">
                        <Card.Body>
                            <Row className="align-items-end">
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="text-light-custom">
                                            {t('subjects.filters.level') || 'Level'}
                                        </Form.Label>
                                        <Form.Select
                                            value={filters.level || ''}
                                            onChange={(e) => handleFilterChange('level', e.target.value || undefined)}
                                            className="bg-dark-custom text-light-custom border-dark"
                                        >
                                            <option value="">{t('subjects.filters.allLevels') || 'All Levels'}</option>
                                            <option value="NLQF-5">NLQF-5</option>
                                            <option value="NLQF-6">NLQF-6</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="text-light-custom">
                                            {t('subjects.filters.points') || 'Study Points'}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={filters.points || ''}
                                            onChange={(e) => handleFilterChange('points', e.target.value ? parseInt(e.target.value) : undefined)}
                                            placeholder={t('subjects.filters.studyPointsPlaceholder') || 'Study points'}
                                            className="bg-dark-custom text-light-custom border-dark"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="text-light-custom">
                                            {t('subjects.filters.tag') || 'Tag'}
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={filters.tag || ''}
                                            onChange={(e) => handleFilterChange('tag', e.target.value || undefined)}
                                            placeholder={t('subjects.filters.tagPlaceholder') || 'Tag name'}
                                            className="bg-dark-custom text-light-custom border-dark"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <ButtonGroup className="w-100">
                                        <Button variant="primary" onClick={loadSubjects} disabled={loading}>
                                            {loading ? (
                                                <Spinner size="sm" />
                                            ) : (
                                                t('subjects.loadSubjects') || 'Search'
                                            )}
                                        </Button>
                                        <Button variant="outline-secondary" onClick={clearFilters}>
                                            {t('subjects.clearFilters') || 'Clear'}
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Subject List */}
                    <Card className="bg-medium-dark-custom border-dark-custom shadow">
                        <Card.Body>
                            <SubjectList
                                subjects={subjects}
                                loading={loading}
                                showMatchPercentage={false}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SubjectsPage;