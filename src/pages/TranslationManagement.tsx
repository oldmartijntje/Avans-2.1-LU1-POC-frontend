import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';

interface Translation {
    _id: string;
    uiKey: string;
    dutch?: string;
    english?: string;
    creatorUuid?: string;
    __v?: number;
}

const TranslationManagement: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslations({
        keys: [
            'translationManagement.title',
            'translationManagement.subtitle',
            'translationManagement.loadTranslations',
            'translationManagement.uiKey',
            'translationManagement.dutch',
            'translationManagement.english',
            'translationManagement.actions',
            'translationManagement.edit',
            'translationManagement.editTitle',
            'translationManagement.save',
            'translationManagement.cancel',
            'translationManagement.loading',
            'translationManagement.success',
            'translationManagement.error',
            'translationManagement.accessDenied',
            'translationManagement.noTranslations'
        ]
    });

    const [translations, setTranslations] = useState<Translation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
    const [editForm, setEditForm] = useState({ dutch: '', english: '' });

    // Check if user has access
    const hasAccess = user?.role === 'TEACHER' || user?.role === 'ADMIN';

    const loadAllTranslations = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching all translations with JWT token');
            const response = await api.get('/display-text');

            if (Array.isArray(response.data)) {
                setTranslations(response.data);
                setSuccess(t('translationManagement.success', 'Translations loaded successfully'));
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            console.error('Error loading translations:', err);
            setError(err.response?.data?.message || err.message || t('translationManagement.error', 'Failed to load translations'));
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (translation: Translation) => {
        setEditingTranslation(translation);
        setEditForm({
            dutch: translation.dutch || '',
            english: translation.english || ''
        });
        setShowEditModal(true);
    };

    const handleSaveTranslation = async () => {
        if (!editingTranslation) return;

        setLoading(true);
        setError(null);

        try {
            console.log(`Updating translation ${editingTranslation.uiKey} with JWT token`);
            await api.patch(`/display-text/${editingTranslation.uiKey}`, {
                dutch: editForm.dutch,
                english: editForm.english
            });

            // Update local state
            setTranslations(prev => prev.map(t =>
                t.uiKey === editingTranslation.uiKey
                    ? { ...t, dutch: editForm.dutch, english: editForm.english }
                    : t
            ));

            setSuccess(`Translation for "${editingTranslation.uiKey}" updated successfully`);
            setShowEditModal(false);
            setEditingTranslation(null);
        } catch (err: any) {
            console.error('Error updating translation:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update translation');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setEditingTranslation(null);
        setEditForm({ dutch: '', english: '' });
    };

    // Auto-dismiss alerts
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 8000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    if (!hasAccess) {
        return (
            <Container className="py-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Alert variant="danger">
                            <Alert.Heading>{t('translationManagement.accessDenied', 'Access Denied')}</Alert.Heading>
                            <p>This page is only accessible to Teachers and Administrators.</p>
                        </Alert>
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
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
                        <div>
                            <h1 className="h2 fw-bold text-light-custom mb-1">
                                {t('translationManagement.title', 'Translation Management')}
                            </h1>
                            <p className="text-muted-custom mb-0">
                                {t('translationManagement.subtitle', 'Manage translations for the application')}
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={loadAllTranslations}
                            disabled={loading}
                            className="mt-3 mt-sm-0"
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    {t('translationManagement.loading', 'Loading...')}
                                </>
                            ) : (
                                t('translationManagement.loadTranslations', 'Load Translations')
                            )}
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

                    {/* Translations Table */}
                    <Card className="bg-darker-custom border-dark">
                        <Card.Header className="bg-dark-custom border-dark">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 text-light-custom">All Translations</h5>
                                <Badge bg="primary">{translations.length} translations</Badge>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0 bg-darker-custom">
                            {translations.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted-custom">
                                        {t('translationManagement.noTranslations', 'No translations loaded. Click "Load Translations" to fetch all translations.')}
                                    </p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <Table variant="dark" striped hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th className="text-light-custom">{t('translationManagement.uiKey', 'UI Key')}</th>
                                                <th className="text-light-custom">{t('translationManagement.dutch', 'Dutch')}</th>
                                                <th className="text-light-custom">{t('translationManagement.english', 'English')}</th>
                                                <th className="text-center text-light-custom">{t('translationManagement.actions', 'Actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {translations.map((translation) => (
                                                <tr key={translation._id || translation.uiKey}>
                                                    <td>
                                                        <code className="text-primary">{translation.uiKey}</code>
                                                    </td>
                                                    <td>
                                                        <span className="text-light-custom">
                                                            {translation.dutch || <em className="text-muted-custom">No Dutch translation</em>}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="text-light-custom">
                                                            {translation.english || <em className="text-muted-custom">No English translation</em>}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEditClick(translation)}
                                                            disabled={loading}
                                                        >
                                                            {t('translationManagement.edit', 'Edit')}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Edit Modal */}
                    <Modal show={showEditModal} onHide={handleCloseModal} size="lg" data-bs-theme="dark">
                        <Modal.Header closeButton className="bg-dark-custom border-dark">
                            <Modal.Title className="text-light-custom">
                                {t('translationManagement.editTitle', 'Edit Translation')}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="bg-darker-custom">
                            {editingTranslation && (
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-light-custom">UI Key</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editingTranslation.uiKey}
                                            disabled
                                            className="bg-dark text-light border-dark"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-light-custom">{t('translationManagement.dutch', 'Dutch Translation')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={editForm.dutch}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, dutch: e.target.value }))}
                                            placeholder="Enter Dutch translation"
                                            className="bg-dark text-light border-dark"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-light-custom">{t('translationManagement.english', 'English Translation')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={editForm.english}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, english: e.target.value }))}
                                            placeholder="Enter English translation"
                                            className="bg-dark text-light border-dark"
                                        />
                                    </Form.Group>
                                </Form>
                            )}
                        </Modal.Body>
                        <Modal.Footer className="bg-dark-custom border-dark">
                            <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
                                {t('translationManagement.cancel', 'Cancel')}
                            </Button>
                            <Button variant="primary" onClick={handleSaveTranslation} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="me-2" />
                                        {t('translationManagement.loading', 'Loading...')}
                                    </>
                                ) : (
                                    t('translationManagement.save', 'Save Changes')
                                )}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
};

export default TranslationManagement;