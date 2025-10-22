import React, { useMemo } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';

const Management: React.FC = () => {
    const { user } = useAuth();

    const translationKeys = useMemo(() => [
        'management.title',
        'management.subtitle',
        'management.accessDenied',
        'management.tools.title',
        'management.tools.translationManagement.title',
        'management.tools.translationManagement.description',
        'management.tools.translationManagement.button',
        'management.tools.subjectManagement.title',
        'management.tools.subjectManagement.description',
        'management.tools.subjectManagement.button',
        'management.tools.courseManagement.title',
        'management.tools.courseManagement.description',
        'management.tools.courseManagement.button',
        'management.comingSoon.title',
        'management.comingSoon.description'
    ], []);

    const { t } = useTranslations({
        keys: translationKeys
    });

    // Check if user has access (only teachers and admins)
    const hasAccess = user?.role === 'TEACHER' || user?.role === 'ADMIN';

    if (!hasAccess) {
        return (
            <Container className="py-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="bg-darker-custom border-danger">
                            <Card.Header className="bg-danger text-white">
                                <h4 className="mb-0">{t('management.accessDenied')}</h4>
                            </Card.Header>
                            <Card.Body className="text-center">
                                <p className="text-light-custom mb-0">
                                    This page is only accessible to Teachers and Administrators.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col xl={12}>
                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="h2 fw-bold text-light-custom mb-1">
                            {t('management.title')}
                        </h1>
                        <p className="text-muted-custom mb-0">
                            {t('management.subtitle')}
                        </p>
                    </div>

                    {/* Available Tools */}
                    <Row className="mb-4">
                        <Col md={12}>
                            <h3 className="h4 text-light-custom mb-3">
                                {t('management.tools.title')}
                            </h3>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        {/* Translation Management Tool */}
                        <Col lg={6} xl={4}>
                            <Card className="bg-darker-custom border-dark h-100">
                                <Card.Header className="bg-dark-custom border-dark">
                                    <h5 className="mb-0 text-light-custom">
                                        {t('management.tools.translationManagement.title')}
                                    </h5>
                                </Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <p className="text-muted-custom flex-grow-1">
                                        {t('management.tools.translationManagement.description')}
                                    </p>
                                    <Link to="/translation-management" className="text-decoration-none">
                                        <Button variant="primary" className="w-100">
                                            {t('management.tools.translationManagement.button')}
                                        </Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Subject Management Tool */}
                        <Col lg={6} xl={4}>
                            <Card className="bg-darker-custom border-dark h-100">
                                <Card.Header className="bg-dark-custom border-dark">
                                    <h5 className="mb-0 text-light-custom">
                                        {t('management.tools.subjectManagement.title')}
                                    </h5>
                                </Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <p className="text-muted-custom flex-grow-1">
                                        {t('management.tools.subjectManagement.description')}
                                    </p>
                                    <Link to="/subject-management" className="text-decoration-none">
                                        <Button variant="primary" className="w-100">
                                            {t('management.tools.subjectManagement.button')}
                                        </Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Course Management Tool */}
                        <Col lg={6} xl={4}>
                            <Card className="bg-darker-custom border-dark h-100">
                                <Card.Header className="bg-dark-custom border-dark">
                                    <h5 className="mb-0 text-light-custom">
                                        {t('management.tools.courseManagement.title')}
                                    </h5>
                                </Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <p className="text-muted-custom flex-grow-1">
                                        {t('management.tools.courseManagement.description')}
                                    </p>
                                    <Link to="/course-management" className="text-decoration-none">
                                        <Button variant="primary" className="w-100">
                                            {t('management.tools.courseManagement.button')}
                                        </Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Management;