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
            'home.alinea.title',
            'home.alinea.text',
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
                            <h3 className="card-title mb-0">{t('home.alinea.title', 'Welcome to the Elective Module selector')}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <p className="text-muted-custom small mb-0">{t('home.alinea.text', 'This is the Avans Elective Module selector, here you can choose which module you want to use')}</p>
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
