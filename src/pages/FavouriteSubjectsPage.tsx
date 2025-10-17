import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Alert,
    Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { subjectService } from '../services/subjectService';
import type { Subject } from '../services/subjectService';
import SubjectList from '../components/SubjectList';

const FavouriteSubjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslations({
        keys: [
            'favouriteSubjects.title',
            'favouriteSubjects.subtitle',
            'favouriteSubjects.loading',
            'favouriteSubjects.error',
            'favouriteSubjects.success',
            'favouriteSubjects.noFavourites',
            'favouriteSubjects.browseAll',
            'favouriteSubjects.viewRecommended',
            'favouriteSubjects.refresh'
        ]
    });

    // State
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Load favourite subjects on component mount
    useEffect(() => {
        loadFavouriteSubjects();
    }, []);

    // Clear messages when component unmounts
    useEffect(() => {
        return () => {
            setSuccess(null);
            setError(null);
        };
    }, []);

    const loadFavouriteSubjects = async (showSuccessMessage: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            const data = await subjectService.getFavouriteSubjects();
            setSubjects(data);
            // Only show success message when explicitly requested (e.g., refresh button)
            if (showSuccessMessage) {
                const message = t('favouriteSubjects.success') || 'Favourites loaded successfully';
                setSuccess(message);
                // Auto-clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('404')) {
                    setError(t('favouriteSubjects.noFavourites') || 'No favourite subjects found');
                } else if (err.message.includes('401')) {
                    setError(t('favouriteSubjects.error') || 'Unauthorized access');
                } else {
                    setError(err.message);
                }
            } else {
                setError(t('favouriteSubjects.error') || 'Failed to load favourite subjects');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4">
            <Row>
                <Col>
                    {/* Header */}
                    <div className="mb-4 d-flex justify-content-between align-items-start">
                        <div>
                            <h1 className="h2 fw-bold text-light-custom mb-1">
                                {t('favouriteSubjects.title') || 'Favourite Subjects'}
                            </h1>
                            <p className="text-muted-custom mb-0">
                                {t('favouriteSubjects.subtitle') || 'Your saved elective modules'}
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate('/subjects')}
                            >
                                {t('favouriteSubjects.browseAll') || 'Browse All'}
                            </Button>
                            <Button
                                variant="outline-info"
                                onClick={() => navigate('/subjects/recommended')}
                            >
                                {t('favouriteSubjects.viewRecommended') || 'Recommended'}
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={() => loadFavouriteSubjects(true)}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    t('favouriteSubjects.refresh') || 'Refresh'
                                )}
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

                    {/* Loading State */}
                    {loading && (
                        <Card className="bg-medium-dark-custom border-dark-custom shadow">
                            <Card.Body className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="text-muted-custom mt-3">
                                    {t('favouriteSubjects.loading') || 'Loading favourite subjects...'}
                                </p>
                            </Card.Body>
                        </Card>
                    )}

                    {/* No Favourites State */}
                    {!loading && subjects.length === 0 && !error && (
                        <Card className="bg-medium-dark-custom border-dark-custom shadow">
                            <Card.Body className="text-center py-5">
                                <div className="mb-4">
                                    <i className="fs-1 text-muted-custom">💔</i>
                                </div>
                                <p className="text-light-custom mb-3 fs-5">
                                    {t('favouriteSubjects.noFavourites') || 'No favourite subjects yet'}
                                </p>
                                <p className="text-muted-custom mb-4">
                                    Start adding subjects to your favourites by browsing all modules or checking out recommendations.
                                </p>
                                <div className="d-flex gap-2 justify-content-center">
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate('/subjects')}
                                    >
                                        {t('favouriteSubjects.browseAll') || 'Browse All Subjects'}
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => navigate('/subjects/recommended')}
                                    >
                                        {t('favouriteSubjects.viewRecommended') || 'View Recommended'}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Subject List */}
                    {!loading && subjects.length > 0 && (
                        <Card className="bg-medium-dark-custom border-dark-custom shadow">
                            <Card.Body>
                                <SubjectList
                                    subjects={subjects}
                                    loading={false}
                                    showMatchPercentage={false}
                                />
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default FavouriteSubjectsPage;