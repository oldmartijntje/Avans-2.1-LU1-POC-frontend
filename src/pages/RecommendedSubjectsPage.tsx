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
import { useNavigate, Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { subjectService } from '../services/subjectService';
import type { RecommendedSubject } from '../services/subjectService';
import SubjectList from '../components/SubjectList';
import { handleApiError } from '../utils/errorHandler';

const RecommendedSubjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslations({
        keys: [
            'recommendedSubjects.title',
            'recommendedSubjects.subtitle',
            'recommendedSubjects.loading',
            'recommendedSubjects.error',
            'recommendedSubjects.success',
            'recommendedSubjects.noRecommendations',
            'recommendedSubjects.browseAll',
            'recommendedSubjects.viewFavourites',
            'recommendedSubjects.refresh'
        ]
    });

    // State
    const [subjects, setSubjects] = useState<RecommendedSubject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUnauthorizedError, setIsUnauthorizedError] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    // Load recommended subjects on component mount
    useEffect(() => {
        loadRecommendedSubjects();
    }, []);

    // Clear messages when component unmounts
    useEffect(() => {
        return () => {
            setSuccess(null);
            setError(null);
        };
    }, []);

    const loadRecommendedSubjects = async (showSuccessMessage: boolean = false) => {
        setLoading(true);
        setError(null);
        setIsUnauthorizedError(false);
        try {
            const data = await subjectService.getRecommendedSubjects();
            // Sort by match percentage in descending order
            const sortedData = data.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
            setSubjects(sortedData);
            // Only show success message when explicitly requested (e.g., refresh button)
            if (showSuccessMessage) {
                const message = t('recommendedSubjects.success') || 'Recommendations loaded successfully';
                setSuccess(message);
                // Auto-clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            const errorInfo = handleApiError(err, t('recommendedSubjects.error') || 'Failed to load recommendations');
            setError(errorInfo.message);
            setIsUnauthorizedError(errorInfo.shouldShowLoginPrompt);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4">
            <Row>
                <Col>
                    {/* Header */}
                    <div className="mb-4 d-flex justify-content-between align-items-start flex-wrap">
                        <div>
                            <h1 className="h2 fw-bold text-light-custom mb-1">
                                {t('recommendedSubjects.title') || 'Recommended Subjects'}
                            </h1>
                            <p className="text-muted-custom mb-0">
                                {t('recommendedSubjects.subtitle') || 'Personalized subject recommendations based on your profile'}
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate('/subjects')}
                            >
                                {t('recommendedSubjects.browseAll') || 'Browse All'}
                            </Button>
                            <Button
                                variant="outline-warning"
                                onClick={() => navigate('/subjects/favourites')}
                            >
                                {t('recommendedSubjects.viewFavourites') || 'Favourites'}
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={() => loadRecommendedSubjects(true)}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    t('recommendedSubjects.refresh') || 'Refresh'
                                )}
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

                    {/* Loading State */}
                    {loading && (
                        <Card className="bg-medium-dark-custom border-dark-custom shadow">
                            <Card.Body className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="text-muted-custom mt-3">
                                    {t('recommendedSubjects.loading') || 'Loading personalized recommendations...'}
                                </p>
                            </Card.Body>
                        </Card>
                    )}

                    {/* No Recommendations State */}
                    {!loading && subjects.length === 0 && !error && (
                        <Card className="bg-medium-dark-custom border-dark-custom shadow">
                            <Card.Body className="text-center py-5">
                                <p className="text-light-custom mb-3 fs-5">
                                    {t('recommendedSubjects.noRecommendations') || 'No recommendations available at this time'}
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/subjects')}
                                >
                                    {t('recommendedSubjects.browseAll') || 'Browse All Subjects'}
                                </Button>
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
                                    showMatchPercentage={true}
                                />
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default RecommendedSubjectsPage;