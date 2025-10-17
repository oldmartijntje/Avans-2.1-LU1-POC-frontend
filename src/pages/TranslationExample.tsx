import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Badge, ListGroup, ButtonGroup } from 'react-bootstrap';
import { useTranslations } from '../hooks/useTranslations';
import { useTranslation } from '../contexts/TranslationContext';
import { config } from '../config/config';

const TranslationExample: React.FC = () => {
    const [customKeys, setCustomKeys] = useState<string>('');
    const [isLoadingCustom, setIsLoadingCustom] = useState(false);

    // Example translation keys for the page
    const pageKeys = [
        'header.title',
        'header.subtitle',
        'navigation.home',
        'navigation.about',
        'navigation.dashboard',
        'button.save',
        'button.cancel',
        'button.submit',
        'form.username.label',
        'form.password.label',
        'message.welcome',
        'message.error.generic',
        'footer.copyright'
    ];

    // Use the translation hook with predefined keys
    const { t, loading, error, reload } = useTranslations({
        keys: pageKeys,
        loadOnMount: true
    });

    const { loadTranslations, clearCache, getCacheInfo, getNotFoundKeys, currentLanguage, setLanguage } = useTranslation();

    const handleLoadCustomKeys = async () => {
        if (!customKeys.trim()) return;

        setIsLoadingCustom(true);
        const keys = customKeys.split('\n').map(key => key.trim()).filter(key => key);

        try {
            await loadTranslations(keys);
        } catch (err) {
            console.error('Failed to load custom keys:', err);
        } finally {
            setIsLoadingCustom(false);
        }
    };

    const cacheInfo = getCacheInfo();

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-light-custom mb-3">
                            {t('header.title')}
                        </h1>
                        <p className="lead text-muted-custom">
                            {t('header.subtitle')}
                        </p>

                        {/* Language Switcher */}
                        <div className="mt-4">
                            <div className="mb-2">
                                <small className="text-muted-custom">Current Language:</small>
                            </div>
                            <ButtonGroup>
                                {config.LANGUAGES.map(lang => (
                                    <Button
                                        key={lang}
                                        variant={currentLanguage === lang ? 'primary' : 'outline-primary'}
                                        size="sm"
                                        onClick={() => setLanguage(lang)}
                                        disabled={loading}
                                    >
                                        {lang === 'dutch' ? '🇳🇱 Nederlands' : '🇺🇸 English'}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>
                    </div>

                    {/* Loading and Error States */}
                    {loading && (
                        <Alert variant="info" className="mb-4">
                            <div className="d-flex align-items-center">
                                <span className="spinner-avans me-2"></span>
                                Loading translations...
                            </div>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="danger" className="mb-4">
                            <strong>Translation Error:</strong> {error}
                            <Button variant="outline-danger" size="sm" className="ms-2" onClick={reload}>
                                Retry
                            </Button>
                        </Alert>
                    )}

                    <Row className="g-4">
                        {/* Example Translations Card */}
                        <Col lg={6}>
                            <Card className="h-100">
                                <Card.Header>
                                    <h5 className="card-title mb-0">
                                        <i className="me-2">🌐</i>
                                        Example Translations
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <p className="text-muted-custom mb-3">
                                        These translations are loaded from your API endpoint:
                                    </p>

                                    <ListGroup variant="flush">
                                        {pageKeys.slice(0, 8).map(key => (
                                            <ListGroup.Item key={key} className="d-flex justify-content-between align-items-start bg-transparent border-secondary">
                                                <div>
                                                    <div className="fw-medium text-light-custom">{key}</div>
                                                    <div className="text-primary small">{t(key)}</div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>

                                    <div className="mt-3">
                                        <Button variant="outline-primary" size="sm" onClick={reload}>
                                            <i className="me-1">🔄</i>
                                            Reload Translations
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Custom Translation Keys Card */}
                        <Col lg={6}>
                            <Card className="h-100">
                                <Card.Header>
                                    <h5 className="card-title mb-0">
                                        <i className="me-2">⚡</i>
                                        Test Custom Keys
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <p className="text-muted-custom mb-3">
                                        Enter your own translation keys to test the system:
                                    </p>

                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Translation Keys (one per line)</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                value={customKeys}
                                                onChange={(e) => setCustomKeys(e.target.value)}
                                                placeholder={`header.buttons.title\nheader.buttons.title.2\nheader.buttons.title.3\nheader.buttons.title.4`}
                                                disabled={isLoadingCustom}
                                            />
                                        </Form.Group>

                                        <Button
                                            variant="primary"
                                            onClick={handleLoadCustomKeys}
                                            disabled={isLoadingCustom || !customKeys.trim()}
                                        >
                                            {isLoadingCustom ? (
                                                <>
                                                    <span className="spinner-avans me-2"></span>
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="me-1">📥</i>
                                                    Load Keys
                                                </>
                                            )}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Cache Information Card */}
                        <Col xs={12}>
                            <Card>
                                <Card.Header>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="card-title mb-0">
                                            <i className="me-2">💾</i>
                                            Cache Information
                                        </h5>
                                        <Button variant="outline-warning" size="sm" onClick={clearCache}>
                                            <i className="me-1">🗑️</i>
                                            Clear Cache
                                        </Button>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    {cacheInfo.length === 0 && getNotFoundKeys().length === 0 ? (
                                        <p className="text-muted-custom mb-0">No cached translations</p>
                                    ) : (
                                        <>
                                            <div className="mb-3">
                                                <Badge bg="info" className="me-2">Cache entries: {cacheInfo.length}</Badge>
                                                <Badge bg="warning">Missing keys: {getNotFoundKeys().length}</Badge>
                                            </div>

                                            {getNotFoundKeys().length > 0 && (
                                                <div className="mb-3">
                                                    <h6 className="text-light-custom mb-2">
                                                        <i className="me-1">❌</i>
                                                        Keys Not Found (won't be re-fetched)
                                                    </h6>
                                                    <div className="bg-dark p-2 rounded small">
                                                        {getNotFoundKeys().slice(0, 10).map(key => (
                                                            <Badge key={key} bg="secondary" className="me-1 mb-1">
                                                                {key}
                                                            </Badge>
                                                        ))}
                                                        {getNotFoundKeys().length > 10 && (
                                                            <Badge bg="secondary">
                                                                +{getNotFoundKeys().length - 10} more...
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="row g-2">
                                                {cacheInfo.map((entry, index) => (
                                                    <div key={index} className="col-md-6">
                                                        <div className="border border-secondary rounded p-2 small">
                                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                                <span className="text-light-custom fw-medium">
                                                                    {entry.keys.length} keys
                                                                </span>
                                                                <Badge bg={entry.valid ? 'success' : 'warning'}>
                                                                    {entry.valid ? 'Valid' : 'Expired'}
                                                                </Badge>
                                                            </div>
                                                            <div className="text-muted-custom">
                                                                Cached: {new Date(entry.timestamp).toLocaleTimeString()}
                                                            </div>
                                                            <div className="text-primary small mt-1">
                                                                {entry.keys.slice(0, 2).join(', ')}
                                                                {entry.keys.length > 2 && ` +${entry.keys.length - 2} more`}
                                                            </div>
                                                            {entry.notFoundKeys && entry.notFoundKeys.length > 0 && (
                                                                <div className="text-warning small mt-1">
                                                                    Not found: {entry.notFoundKeys.length} keys
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* API Information Card */}
                        <Col xs={12}>
                            <Card>
                                <Card.Header>
                                    <h5 className="card-title mb-0">
                                        <i className="me-2">🔗</i>
                                        API Integration Details
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <h6 className="text-light-custom mb-2">Endpoint</h6>
                                            <code className="text-primary">POST {'{url}'}/display-text</code>
                                        </Col>
                                        <Col md={6}>
                                            <h6 className="text-light-custom mb-2">Request Body</h6>
                                            <pre className="bg-dark p-2 rounded small text-light">
                                                {`{
  "uiKeys": [
    "header.title",
    "button.save"
  ]
}`}
                                            </pre>
                                        </Col>
                                    </Row>

                                    <Row className="mt-3">
                                        <Col md={4}>
                                            <h6 className="text-light-custom mb-2">New Multi-Language Format</h6>
                                            <pre className="bg-dark p-2 rounded small text-light">
                                                {`[
  {
    "_id": "507f...",
    "uiKey": "header.title",
    "dutch": "Welkom",
    "english": "Welcome"
  },
  {
    "uiKey": "missing.key",
    "notFound": true
  }
]`}
                                            </pre>
                                        </Col>
                                        <Col md={4}>
                                            <h6 className="text-light-custom mb-2">Simple Format</h6>
                                            <pre className="bg-dark p-2 rounded small text-light">
                                                {`[
  {
    "uiKey": "header.title",
    "displayText": "Welcome"
  },
  {
    "uiKey": "missing.key",
    "notFound": true
  }
]`}
                                            </pre>
                                        </Col>
                                        <Col md={4}>
                                            <h6 className="text-light-custom mb-2">Legacy Format</h6>
                                            <pre className="bg-dark p-2 rounded small text-light">
                                                {`{
  "translations": {
    "header.title": "Welcome",
    "button.save": "Save"
  }
}`}
                                            </pre>
                                        </Col>
                                    </Row>

                                    <div className="mt-3">
                                        <h6 className="text-light-custom mb-2">Smart Translation Features</h6>
                                        <ul className="text-muted-custom">
                                            <li><strong>Multi-language support</strong> - Dutch and English with automatic language switching</li>
                                            <li><strong>5-minute cache TTL</strong> - Reduces API calls</li>
                                            <li><strong>Not-found tracking</strong> - Won't re-fetch missing keys</li>
                                            <li><strong>Multiple API formats</strong> - Supports legacy and new response formats</li>
                                            <li><strong>Fallback handling</strong> - Shows key name when translation missing</li>
                                            <li><strong>Batch requests</strong> - Multiple keys in single API call</li>
                                            <li><strong>React integration</strong> - Easy hooks and loading states</li>
                                        </ul>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default TranslationExample;