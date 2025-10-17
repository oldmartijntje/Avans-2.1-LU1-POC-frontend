import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Alert,
    Badge,
    Spinner
} from 'react-bootstrap';
import { useTranslations } from '../hooks/useTranslations';
import { useTranslation } from '../contexts/TranslationContext';
import { subjectService } from '../services/subjectService';
import type { Subject } from '../services/subjectService';

const SubjectView: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();
    const { currentLanguage } = useTranslation();
    const { t } = useTranslations({
        keys: [
            'subjectView.title',
            'subjectView.loading',
            'subjectView.error',
            'subjectView.notFound',
            'subjectView.backToList',
            'subjectView.addToFavourites',
            'subjectView.removeFromFavourites',
            'subjectView.selectForCompare',
            'subjectView.compareTemplate',
            'subjectView.level',
            'subjectView.studyPoints',
            'subjectView.languages',
            'subjectView.tags',
            'subjectView.description',
            'subjectView.moreInfo',
            'subjectView.owner',
            'subjectView.success',
            'subjectView.favouriteAdded',
            'subjectView.favouriteRemoved',
            'subjectView.favouriteError',
            'subjectView.subjectDetails',
            'subjectView.actions',
            'subjectView.subjectInformation',
            'subjectView.templateOnly',
            'subjectView.ownerUuid',
            'subjectView.subjectUuid',
            'subjectView.favourite'
        ]
    });

    // State
    const [subject, setSubject] = useState<Subject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [favouriteLoading, setFavouriteLoading] = useState(false);

    // Helper function to get localized content
    const getLocalizedContent = (content: { dutch?: string; english?: string } | null | undefined, fallbackKey: string = 'common.notAvailable') => {
        if (!content) return t(fallbackKey) || 'Not available';

        if (currentLanguage === 'dutch') {
            return content.dutch || content.english || t(fallbackKey) || 'Not available';
        } else {
            return content.english || content.dutch || t(fallbackKey) || 'Not available';
        }
    };

    useEffect(() => {
        if (uuid) {
            loadSubject();
        } else {
            setError(t('subjectView.error') || 'No subject ID provided');
            setLoading(false);
        }
    }, [uuid]);

    const loadSubject = async () => {
        if (!uuid) return;

        setLoading(true);
        setError(null);
        try {
            const data = await subjectService.getSubjectById(uuid);
            setSubject(data);
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('404')) {
                    setError(t('subjectView.notFound') || 'Subject not found');
                } else if (err.message.includes('401')) {
                    setError(t('subjectView.error') || 'Unauthorized access');
                } else {
                    setError(err.message);
                }
            } else {
                setError(t('subjectView.error') || 'Failed to load subject');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFavouriteToggle = async () => {
        if (!subject?.uuid) return;

        setFavouriteLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (subject.isFavourite) {
                await subjectService.removeFromFavourites(subject.uuid);
                setSubject(prev => prev ? { ...prev, isFavourite: false } : null);
                setSuccess(t('subjectView.favouriteRemoved') || 'Removed from favourites');
            } else {
                await subjectService.addToFavourites(subject.uuid);
                setSubject(prev => prev ? { ...prev, isFavourite: true } : null);
                setSuccess(t('subjectView.favouriteAdded') || 'Added to favourites');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : t('subjectView.favouriteError') || 'Failed to update favourites');
        } finally {
            setFavouriteLoading(false);
        }
    };

    const handleCompareSelect = () => {
        // Template function - just show an alert for now
        alert(t('subjectView.compareTemplate') || 'This is a template function for comparing subjects. This feature is not yet implemented.');
    };

    if (loading) {
        return (
            <Container className="py-4">
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted-custom mt-3">
                        {t('subjectView.loading') || 'Loading subject...'}
                    </p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="bg-medium-dark-custom border-danger shadow">
                            <Card.Header className="bg-danger text-white">
                                <h4 className="mb-0">{t('subjectView.error') || 'Error'}</h4>
                            </Card.Header>
                            <Card.Body className="text-center p-4">
                                <p className="text-light-custom mb-3 fs-5">{error}</p>
                                <Button variant="outline-primary" onClick={() => navigate('/subject-management')}>
                                    {t('subjectView.backToList') || 'Back to Subject List'}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (!subject) {
        return (
            <Container className="py-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="bg-medium-dark-custom border-warning shadow">
                            <Card.Body className="text-center p-4">
                                <p className="text-light-custom mb-3 fs-5">
                                    {t('subjectView.notFound') || 'Subject not found'}
                                </p>
                                <Button variant="outline-primary" onClick={() => navigate('/subject-management')}>
                                    {t('subjectView.backToList') || 'Back to Subject List'}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Row>
                <Col>
                    {/* Header */}
                    <div className="mb-4 d-flex justify-content-between align-items-start">
                        <div>
                            <h1 className="h2 fw-bold text-light-custom mb-1">
                                {getLocalizedContent(subject.title, 'subjectView.unknownSubject')}
                            </h1>
                        </div>
                        <Button variant="outline-secondary" onClick={() => navigate('/subject-management')}>
                            {t('subjectView.backToList') || 'Back to List'}
                        </Button>
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

                    <Row>
                        <Col lg={8}>
                            {/* Main Content */}
                            <Card className="bg-medium-dark-custom border-dark-custom mb-4 shadow">
                                <Card.Header className="bg-light-dark border-dark-custom">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 text-light-custom fw-bold">{t('subjectView.subjectDetails') || 'Subject Details'}</h5>
                                        <div className="d-flex gap-2">
                                            <Badge bg="info" className="px-3 py-2 fs-6">{subject.level}</Badge>
                                            <Badge bg="success" className="px-3 py-2 fs-6">{subject.studyPoints} {t('subjectView.studyPoints') || 'points'}</Badge>
                                            {subject.isFavourite && (
                                                <Badge bg="warning" className="px-3 py-2 fs-6">⭐ {t('subjectView.favourite') || 'Favourite'}</Badge>
                                            )}
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    {/* Description */}
                                    <div className="mb-4">
                                        <h6 className="text-light-custom mb-3 fw-semibold">
                                            {t('subjectView.description') || 'Description'}
                                        </h6>
                                        <div className="bg-medium-dark-custom p-3 rounded border">
                                            <p className="text-light-custom mb-0 lh-base">
                                                {getLocalizedContent(subject.description, 'subjectView.noDescription')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* More Info */}
                                    {(subject.moreInfo?.english || subject.moreInfo?.dutch) && (
                                        <div className="mb-4">
                                            <h6 className="text-light-custom mb-3 fw-semibold">
                                                {t('subjectView.moreInfo') || 'Additional Information'}
                                            </h6>
                                            <div className="bg-medium-dark-custom p-3 rounded border">
                                                <p className="text-light-custom mb-0 lh-base">
                                                    {getLocalizedContent(subject.moreInfo, 'subjectView.noMoreInfo')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Languages */}
                                    <div className="mb-4">
                                        <h6 className="text-light-custom mb-3 fw-semibold">
                                            {t('subjectView.languages') || 'Available Languages'}
                                        </h6>
                                        <div className="d-flex gap-2">
                                            {subject.languages.map(lang => (
                                                <Badge key={lang} bg="secondary" className="px-3 py-2 fs-6">
                                                    {lang}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {subject.tags.length > 0 && (
                                        <div className="mb-4">
                                            <h6 className="text-light-custom mb-3 fw-semibold">
                                                {t('subjectView.tags') || 'Tags'}
                                            </h6>
                                            <div className="d-flex gap-2 flex-wrap">
                                                {subject.tags.map(tag => (
                                                    <Badge key={tag._id} bg="primary" className="px-3 py-2 fs-6">
                                                        {tag.tagName}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            {/* Actions Sidebar */}
                            <Card className="bg-medium-dark-custom border-dark-custom mb-4 shadow">
                                <Card.Header className="bg-light-dark border-dark-custom">
                                    <h6 className="mb-0 text-light-custom fw-bold">{t('subjectView.actions') || 'Actions'}</h6>
                                </Card.Header>
                                <Card.Body className="p-3">
                                    <div className="d-grid gap-2">
                                        {/* Favourite Toggle */}
                                        <Button
                                            variant={subject.isFavourite ? "warning" : "outline-warning"}
                                            onClick={handleFavouriteToggle}
                                            disabled={favouriteLoading}
                                        >
                                            {favouriteLoading ? (
                                                <Spinner size="sm" className="me-2" />
                                            ) : subject.isFavourite ? (
                                                '⭐ '
                                            ) : (
                                                '☆ '
                                            )}
                                            {subject.isFavourite
                                                ? (t('subjectView.removeFromFavourites') || 'Remove from Favourites')
                                                : (t('subjectView.addToFavourites') || 'Add to Favourites')
                                            }
                                        </Button>

                                        {/* Compare Template Button */}
                                        <Button
                                            variant="outline-info"
                                            onClick={handleCompareSelect}
                                        >
                                            {t('subjectView.selectForCompare') || 'Select for Compare'}
                                            <small className="d-block">
                                                ({t('subjectView.templateOnly') || 'Template Only'})
                                            </small>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Subject Info */}
                            <Card className="bg-medium-dark-custom border-dark-custom shadow">
                                <Card.Header className="bg-light-dark border-dark-custom">
                                    <h6 className="mb-0 text-light-custom fw-bold">{t('subjectView.subjectInformation') || 'Subject Information'}</h6>
                                </Card.Header>
                                <Card.Body className="p-3">
                                    <div className="mb-3">
                                        <small className="fw-semibold d-block mb-1">{t('subjectView.level') || 'Level'}:</small>
                                        <div className="text-light-custom fw-medium">{subject.level}</div>
                                    </div>
                                    <div className="mb-3">
                                        <small className="fw-semibold d-block mb-1">{t('subjectView.studyPoints') || 'Study Points'}:</small>
                                        <div className="text-light-custom fw-medium">{subject.studyPoints}</div>
                                    </div>
                                    {subject.ownerUuid && (
                                        <div className="mb-3">
                                            <small className="fw-semibold d-block mb-1">{t('subjectView.ownerUuid') || 'Owner UUID'}:</small>
                                            <div className="text-light-custom small font-monospace bg-dark-custom p-2 rounded">
                                                {subject.ownerUuid}
                                            </div>
                                        </div>
                                    )}
                                    {subject.uuid && (
                                        <div className="mb-0">
                                            <small className="fw-semibold d-block mb-1">{t('subjectView.subjectUuid') || 'Subject UUID'}:</small>
                                            <div className="text-light-custom small font-monospace bg-dark-custom p-2 rounded">
                                                {subject.uuid}
                                            </div>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default SubjectView;