import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';

const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { t } = useTranslations({
        keys: [
            'home.hero.title',
            'home.hero.elective',
            'home.hero.subtitle',
            'home.hero.browseModules',
            'home.hero.signIn',
            'home.hero.myModules',
            'home.features.title',
            'home.features.smartMatching.title',
            'home.features.smartMatching.description',
            'home.features.teacherTools.title',
            'home.features.teacherTools.description',
            'home.features.easyEnrollment.title',
            'home.features.easyEnrollment.description',
            'home.features.programIntegration.title',
            'home.features.programIntegration.description',
            'home.quickActions.title',
            'home.quickActions.learnMore',
            'home.quickActions.myModules'
        ]
    });

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={8} xl={6}>
                    {/* Hero Section */}
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-light-custom mb-3">
                            {t('home.hero.title', 'Discover Your Perfect ')}
                            <span className="text-primary">{t('home.hero.elective', 'Elective Module')}</span>
                        </h1>
                        <p className="lead text-muted-custom mb-4">
                            {t('home.hero.subtitle', 'Find and enroll in elective modules that match your interests and career goals')}
                        </p>
                        {!isAuthenticated && (
                            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                                <Link to="/register" className="text-decoration-none">
                                    <Button variant="primary" size="lg">{t('home.hero.browseModules', 'Browse Modules')}</Button>
                                </Link>
                                <Link to="/login" className="text-decoration-none">
                                    <Button variant="outline-primary" size="lg">{t('home.hero.signIn', 'Sign In')}</Button>
                                </Link>
                            </div>
                        )}
                        {isAuthenticated && (
                            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                                <Link to="/dashboard" className="text-decoration-none">
                                    <Button variant="primary" size="lg">{t('home.hero.myModules', 'My Modules')}</Button>
                                </Link>
                            </div>
                        )}
                    </div>                    {/* Features Card */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h3 className="card-title mb-0">{t('home.features.title', 'Elective Module Platform Features')}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-start">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                <i className="text-white">🎯</i>
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="text-light-custom mb-1">{t('home.features.smartMatching.title', 'Smart Matching')}</h6>
                                            <p className="text-muted-custom small mb-0">{t('home.features.smartMatching.description', 'Find modules that align with your study program and interests')}</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-start">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                <i className="text-white">�‍🏫</i>
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="text-light-custom mb-1">{t('home.features.teacherTools.title', 'Teacher Tools')}</h6>
                                            <p className="text-muted-custom small mb-0">{t('home.features.teacherTools.description', 'Create and manage your own elective modules')}</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-start">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                <i className="text-white">�</i>
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="text-light-custom mb-1">{t('home.features.easyEnrollment.title', 'Easy Enrollment')}</h6>
                                            <p className="text-muted-custom small mb-0">{t('home.features.easyEnrollment.description', 'Simple registration process for your chosen modules')}</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-start">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                <i className="text-white">�</i>
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="text-light-custom mb-1">{t('home.features.programIntegration.title', 'Program Integration')}</h6>
                                            <p className="text-muted-custom small mb-0">{t('home.features.programIntegration.description', 'Filter modules based on your base course at Avans')}</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Quick Links */}
                    <Card>
                        <Card.Body>
                            <h5 className="card-title">{t('home.quickActions.title', 'Quick Actions')}</h5>
                            <div className="d-flex flex-wrap gap-2">
                                <Link to="/about" className="text-decoration-none">
                                    <Button variant="outline-primary" size="sm">{t('home.quickActions.learnMore', 'Learn More')}</Button>
                                </Link>
                                {isAuthenticated && (
                                    <Link to="/dashboard" className="text-decoration-none">
                                        <Button variant="primary" size="sm">{t('home.quickActions.myModules', 'My Modules')}</Button>
                                    </Link>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
