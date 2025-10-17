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
                            {t('home.hero.title')}
                            <span className="text-primary">{t('home.hero.elective')}</span>
                        </h1>
                        <p className="lead text-muted-custom mb-4">
                            {t('home.hero.subtitle')}
                        </p>
                        {!isAuthenticated && (
                            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                                <Link to="/register" className="text-decoration-none">
                                    <Button variant="primary" size="lg">{t('home.hero.browseModules')}</Button>
                                </Link>
                                <Link to="/login" className="text-decoration-none">
                                    <Button variant="outline-primary" size="lg">{t('home.hero.signIn')}</Button>
                                </Link>
                            </div>
                        )}
                        {isAuthenticated && (
                            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                                <Link to="/dashboard" className="text-decoration-none">
                                    <Button variant="primary" size="lg">{t('home.hero.myModules')}</Button>
                                </Link>
                            </div>
                        )}
                    </div>                    {/* Features Card */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h3 className="card-title mb-0">{t('home.alinea.title')}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <p className="text-muted-custom small mb-0">{t('home.alinea.text')}</p>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Quick Links */}
                    <Card>
                        <Card.Body>
                            <h5 className="card-title">{t('home.quickActions.title')}</h5>
                            <div className="d-flex flex-wrap gap-2">
                                <Link to="/about" className="text-decoration-none">
                                    <Button variant="outline-primary" size="sm">{t('home.quickActions.learnMore')}</Button>
                                </Link>
                                {isAuthenticated && (
                                    <Link to="/dashboard" className="text-decoration-none">
                                        <Button variant="primary" size="sm">{t('home.quickActions.myModules')}</Button>
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
