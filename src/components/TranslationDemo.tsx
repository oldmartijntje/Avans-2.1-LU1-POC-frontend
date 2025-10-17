import React from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useTranslations } from '../hooks/useTranslations';
import { useTranslation } from '../contexts/TranslationContext';
import { translationService } from '../services/translationService';

const TranslationDemo: React.FC = () => {
    const { t, loading, error } = useTranslations({
        keys: [
            'demo.title',
            'demo.description',
            'demo.current_language',
            'demo.load_translations',
            'demo.sample_keys',
            'demo.reload_button',
            'demo.error_message',
            'demo.loading_message'
        ]
    });

    const { currentLanguage, setLanguage, translations } = useTranslation();

    const sampleKeys = [
        'nav.brand',
        'nav.home',
        'nav.about',
        'home.hero.title',
        'home.hero.subtitle'
    ];

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title mb-0">
                                {t('demo.title')}
                            </h3>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted-custom mb-4">
                                {t('demo.description')}
                            </p>

                            {/* Current Language */}
                            <div className="mb-3">
                                <strong>{t('demo.current_language')}: </strong>
                                <Badge bg="primary" className="ms-2 text-capitalize">
                                    {currentLanguage}
                                </Badge>
                            </div>

                            {/* Language Switcher */}
                            <div className="mb-4">
                                <Button
                                    variant={currentLanguage === 'english' ? 'primary' : 'outline-primary'}
                                    size="sm"
                                    className="me-2"
                                    onClick={() => setLanguage('english')}
                                >
                                    🇺🇸 English
                                </Button>
                                <Button
                                    variant={currentLanguage === 'dutch' ? 'primary' : 'outline-primary'}
                                    size="sm"
                                    onClick={() => setLanguage('dutch')}
                                >
                                    🇳🇱 Nederlands
                                </Button>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <Alert variant="info">
                                    <div className="d-flex align-items-center">
                                        <div className="spinner-avans me-2"></div>
                                        {t('demo.loading_message')}
                                    </div>
                                </Alert>
                            )}

                            {/* Error State */}
                            {error && (
                                <Alert variant="danger">
                                    <strong>{t('demo.error_message')}: </strong>
                                    {error}
                                </Alert>
                            )}

                            {/* Sample Translation Keys */}
                            <Card className="mt-4">
                                <Card.Header>
                                    <h5 className="mb-0">{t('demo.sample_keys')}</h5>
                                </Card.Header>
                                <Card.Body>
                                    {sampleKeys.map(key => (
                                        <div key={key} className="mb-2">
                                            <code className="text-primary">{key}</code>:
                                            <span className="ms-2 text-light-custom">
                                                "{translations[key] || key}"
                                            </span>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>

                            {/* Language Debug Information */}
                            <Card className="mt-4">
                                <Card.Header>
                                    <h5 className="mb-0">Language Debug Information</h5>
                                </Card.Header>
                                <Card.Body>
                                    {(() => {
                                        const debugInfo = translationService.getLanguageDebugInfo();
                                        return (
                                            <div>
                                                <p className="text-muted-custom">
                                                    <strong>Current Language:</strong> <Badge bg="success">{debugInfo.current}</Badge>
                                                </p>
                                                <p className="text-muted-custom">
                                                    <strong>Stored in localStorage:</strong> {debugInfo.stored ? <Badge bg="primary">{debugInfo.stored}</Badge> : <Badge bg="secondary">None</Badge>}
                                                </p>
                                                <p className="text-muted-custom">
                                                    <strong>Device Preference:</strong> {debugInfo.devicePreference ? <Badge bg="info">{debugInfo.devicePreference}</Badge> : <Badge bg="secondary">None detected</Badge>}
                                                </p>
                                                <p className="text-muted-custom">
                                                    <strong>Browser Language:</strong> <code>{debugInfo.browserLanguage}</code>
                                                </p>
                                                <p className="text-muted-custom">
                                                    <strong>All Browser Languages:</strong> <code>{debugInfo.browserLanguages.join(', ')}</code>
                                                </p>
                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    onClick={() => {
                                                        translationService.clearStoredLanguagePreference();
                                                        window.location.reload();
                                                    }}
                                                >
                                                    Clear localStorage & Reload
                                                </Button>
                                            </div>
                                        );
                                    })()}
                                </Card.Body>
                            </Card>

                            {/* API Information */}
                            <Card className="mt-4">
                                <Card.Header>
                                    <h5 className="mb-0">API Configuration</h5>
                                </Card.Header>
                                <Card.Body>
                                    <p className="text-muted-custom">
                                        <strong>Endpoint:</strong> <code>POST /display-text</code>
                                    </p>
                                    <p className="text-muted-custom">
                                        <strong>Request Body:</strong>
                                    </p>
                                    <pre className="bg-dark-custom p-3 rounded">
                                        {`{
  "uiKeys": [
    "nav.brand",
    "nav.home",
    "nav.about"
  ]
}`}
                                    </pre>
                                    <p className="text-muted-custom mt-3">
                                        <strong>Expected Response:</strong>
                                    </p>
                                    <pre className="bg-dark-custom p-3 rounded">
                                        {`{
  "nav.brand": {
    "key": "nav.brand",
    "english": "Avans Elective Hub",
    "dutch": "Avans Keuze Module Hub"
  },
  "nav.home": {
    "key": "nav.home", 
    "english": "Home",
    "dutch": "Home"
  }
}`}
                                    </pre>
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TranslationDemo;