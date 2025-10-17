import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Badge,
    Button,
    Row,
    Col
} from 'react-bootstrap';
import { useTranslations } from '../hooks/useTranslations';
import { useTranslation } from '../contexts/TranslationContext';
import type { Subject, RecommendedSubject } from '../services/subjectService';

interface SubjectListProps {
    subjects: Subject[] | RecommendedSubject[];
    loading?: boolean;
    showMatchPercentage?: boolean;
}

const SubjectList: React.FC<SubjectListProps> = ({ subjects, loading = false, showMatchPercentage = false }) => {
    const navigate = useNavigate();
    const { currentLanguage } = useTranslation();
    const { t } = useTranslations({
        keys: [
            'subjectList.viewDetails',
            'subjectList.level',
            'subjectList.studyPoints',
            'subjectList.languages',
            'subjectList.tags',
            'subjectList.favourite',
            'subjectList.matchPercentage',
            'subjectList.points',
            'subjectList.noSubjects',
            'subjectList.loading'
        ]
    });

    // Helper function to get localized content
    const getLocalizedContent = (content: { dutch?: string; english?: string } | null | undefined, fallback: string = 'Not available') => {
        if (!content) return fallback;

        if (currentLanguage === 'dutch') {
            return content.dutch || content.english || fallback;
        } else {
            return content.english || content.dutch || fallback;
        }
    };

    const handleViewSubject = (subject: Subject) => {
        navigate(`/subject/${subject.uuid}`);
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <p className="text-muted-custom">
                    {t('subjectList.loading') || 'Loading subjects...'}
                </p>
            </div>
        );
    }

    if (subjects.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-muted-custom">
                    {t('subjectList.noSubjects') || 'No subjects found'}
                </p>
            </div>
        );
    }

    return (
        <Row>
            {subjects.map((subject) => (
                <Col key={subject.uuid || subject._id} md={6} lg={4} className="mb-4">
                    <Card className="bg-medium-dark-custom border-dark-custom shadow h-100">
                        <Card.Header className="bg-light-dark border-dark-custom">
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                    <h6 className="mb-1 text-light-custom fw-bold">
                                        {getLocalizedContent(subject.title, 'Unknown Subject')}
                                    </h6>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <Badge bg="info" className="small">{subject.level}</Badge>
                                        <Badge bg="success" className="small">
                                            {subject.studyPoints} {t('subjectList.points') || 'pts'}
                                        </Badge>
                                        {subject.isFavourite && (
                                            <Badge bg="warning" className="small">
                                                ⭐ {t('subjectList.favourite') || 'Fav'}
                                            </Badge>
                                        )}
                                        {showMatchPercentage && 'matchPercentage' in subject && (
                                            <Badge bg="primary" className="small">
                                                {subject.matchPercentage}% {t('subjectList.matchPercentage') || 'match'}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="d-flex flex-column">
                            {/* Description */}
                            <p className="text-light-custom mb-3 small lh-base flex-grow-1">
                                {getLocalizedContent(subject.description, 'No description available')}
                            </p>

                            {/* Languages */}
                            <div className="mb-3">
                                <small className="text-muted-custom fw-semibold d-block mb-1">
                                    {t('subjectList.languages') || 'Languages'}:
                                </small>
                                <div className="d-flex gap-1 flex-wrap">
                                    {subject.languages.map(lang => (
                                        <Badge key={lang} bg="secondary" className="small">
                                            {lang}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            {subject.tags.length > 0 && (
                                <div className="mb-3">
                                    <small className="text-muted-custom fw-semibold d-block mb-1">
                                        {t('subjectList.tags') || 'Tags'}:
                                    </small>
                                    <div className="d-flex gap-1 flex-wrap">
                                        {subject.tags.slice(0, 3).map(tag => (
                                            <Badge key={tag._id} bg="outline-primary" className="small">
                                                {tag.tagName}
                                            </Badge>
                                        ))}
                                        {subject.tags.length > 3 && (
                                            <Badge bg="outline-secondary" className="small">
                                                +{subject.tags.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* View Details Button */}
                            <div className="mt-auto">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="w-100"
                                    onClick={() => handleViewSubject(subject)}
                                >
                                    {t('subjectList.viewDetails') || 'View Details'}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default SubjectList;