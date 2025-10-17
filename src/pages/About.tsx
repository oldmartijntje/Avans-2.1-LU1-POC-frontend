import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslations } from '../hooks/useTranslations';

const About: React.FC = () => {
    const { t } = useTranslations({
        keys: [
            'about.hero.title',
            'about.hero.electiveHub',
            'about.hero.subtitle',
        ]
    });

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={8} xl={7}>
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-light-custom mb-3">
                            {t('about.hero.title')} <span className="text-primary">{t('about.hero.electiveHub')}</span>
                        </h1>
                        <p className="lead text-muted-custom">
                            {t('about.hero.subtitle')}
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
