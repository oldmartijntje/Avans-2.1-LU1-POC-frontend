import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslations } from '../hooks/useTranslations';

const About: React.FC = () => {
    const { t } = useTranslations({
        keys: [
            'about.hero.title',
            'about.hero.electiveHub',
            'about.hero.subtitle',
            'about.mission.title',
            'about.mission.description',
            'about.vision.title',
            'about.vision.description',
            'about.whyChoose.title',
            'about.features.smartRecommendations.title',
            'about.features.smartRecommendations.description',
            'about.features.easyEnrollment.title',
            'about.features.easyEnrollment.description',
            'about.features.programIntegration.title',
            'about.features.programIntegration.description',
            'about.features.teacherSupport.title',
            'about.features.teacherSupport.description',
            'about.contact.title',
            'about.contact.email',
            'about.contact.phone',
            'about.contact.website'
        ]
    });

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={8} xl={7}>
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-light-custom mb-3">
                            {t('about.hero.title', 'About ')} <span className="text-primary">{t('about.hero.electiveHub', 'Elective Hub')}</span>
                        </h1>
                        <p className="lead text-muted-custom">
                            {t('about.hero.subtitle', 'Helping Avans students discover and enroll in the perfect elective modules')}
                        </p>
                    </div>                    <Row className="g-4">
                        <Col md={6}>
                            <Card className="h-100">
                                <Card.Body>
                                    <div className="text-center mb-3">
                                        <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                            <i className="text-white fs-4">🎓</i>
                                        </div>
                                    </div>
                                    <h5 className="text-center text-light-custom mb-3">{t('about.mission.title', 'Our Mission')}</h5>
                                    <p className="text-muted-custom text-center">
                                        {t('about.mission.description', 'To streamline the elective module selection process for Avans students, providing intelligent recommendations based on their base study programs and personal interests.')}
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="h-100">
                                <Card.Body>
                                    <div className="text-center mb-3">
                                        <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                            <i className="text-white fs-4">🚀</i>
                                        </div>
                                    </div>
                                    <h5 className="text-center text-light-custom mb-3">{t('about.vision.title', 'Our Vision')}</h5>
                                    <p className="text-muted-custom text-center">
                                        {t('about.vision.description', 'To be the leading platform for elective module discovery and enrollment at Avans, making it easier for students to find modules that enhance their academic journey.')}
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Card className="mt-4">
                        <Card.Body>
                            <h3 className="text-light-custom mb-4">{t('about.whyChoose.title', 'Why Choose Our Elective Module Platform?')}</h3>
                            <Row>
                                <Col sm={6} className="mb-3">
                                    <div className="d-flex align-items-start">
                                        <span className="text-primary me-3 fs-5">✓</span>
                                        <div>
                                            <h6 className="text-light-custom mb-1">{t('about.features.smartRecommendations.title', 'Smart Recommendations')}</h6>
                                            <p className="text-muted-custom small mb-0">
                                                {t('about.features.smartRecommendations.description', 'Find modules that match your study program and interests')}
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <div className="d-flex align-items-start">
                                        <span className="text-primary me-3 fs-5">✓</span>
                                        <div>
                                            <h6 className="text-light-custom mb-1">{t('about.features.easyEnrollment.title', 'Easy Enrollment')}</h6>
                                            <p className="text-muted-custom small mb-0">
                                                {t('about.features.easyEnrollment.description', 'Simple and secure module registration process')}
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <div className="d-flex align-items-start">
                                        <span className="text-primary me-3 fs-5">✓</span>
                                        <div>
                                            <h6 className="text-light-custom mb-1">{t('about.features.programIntegration.title', 'Program Integration')}</h6>
                                            <p className="text-muted-custom small mb-0">
                                                {t('about.features.programIntegration.description', 'Filter modules based on your base course at Avans')}
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <div className="d-flex align-items-start">
                                        <span className="text-primary me-3 fs-5">✓</span>
                                        <div>
                                            <h6 className="text-light-custom mb-1">{t('about.features.teacherSupport.title', 'Teacher Support')}</h6>
                                            <p className="text-muted-custom small mb-0">
                                                {t('about.features.teacherSupport.description', 'Tools for teachers to create and manage elective modules')}
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="mt-4">
                        <Card.Body className="text-center">
                            <h5 className="text-light-custom mb-3">{t('about.contact.title', 'Contact Information')}</h5>
                            <div className="row">
                                <div className="col-md-4 mb-2">
                                    <strong className="text-primary">📧 {t('about.contact.email', 'Email')}</strong>
                                    <br />
                                    <span className="text-muted-custom">support@avans.nl</span>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <strong className="text-primary">📞 {t('about.contact.phone', 'Phone')}</strong>
                                    <br />
                                    <span className="text-muted-custom">+31 (0)88 525 7500</span>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <strong className="text-primary">🌐 {t('about.contact.website', 'Website')}</strong>
                                    <br />
                                    <span className="text-muted-custom">www.avans.nl</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
