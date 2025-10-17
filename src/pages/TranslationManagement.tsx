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

interface OrphanedTranslation {
    _id: string;
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
            'translationManagement.loadOrphans',
            'translationManagement.deleteOrphans',
            'translationManagement.orphansTitle',
            'translationManagement.orphansSubtitle',
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
            'translationManagement.noTranslations',
            'translationManagement.noOrphans',
            'translationManagement.confirmDeleteOrphans'
        ]
    });

    const [translations, setTranslations] = useState<Translation[]>([]);
    const [orphanedTranslations, setOrphanedTranslations] = useState<OrphanedTranslation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
    const [editForm, setEditForm] = useState({ dutch: '', english: '' });
    const [activeTab, setActiveTab] = useState<'ui' | 'orphans'>('ui');

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
                setSuccess(t('translationManagement.success'));
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            console.error('Error loading translations:', err);
            setError(err.response?.data?.message || err.message || t('translationManagement.error'));
        } finally {
            setLoading(false);
        }
    };

    const loadOrphanedTranslations = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching orphaned translations with JWT token');
            const response = await api.get('/display-text/orphans');

            if (Array.isArray(response.data)) {
                setOrphanedTranslations(response.data);
                setSuccess(`Found ${response.data.length} orphaned translations`);
                setActiveTab('orphans');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            console.error('Error loading orphaned translations:', err);
            if (err.response?.status === 404) {
                setError('No orphaned translations found');
                setOrphanedTranslations([]);
            } else {
                setError(err.response?.data?.message || err.message || 'Failed to load orphaned translations');
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteAllOrphanedTranslations = async () => {
        if (!window.confirm(t('translationManagement.confirmDeleteOrphans') || 'Are you sure you want to delete all orphaned translations? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Deleting all orphaned translations with JWT token');
            const response = await api.delete('/display-text/orphans');

            if (response.data?.deletedCount !== undefined) {
                setSuccess(`Successfully deleted ${response.data.deletedCount} orphaned translations`);
                setOrphanedTranslations([]);
            } else {
                setSuccess('Orphaned translations deleted successfully');
                setOrphanedTranslations([]);
            }
        } catch (err: any) {
            console.error('Error deleting orphaned translations:', err);
            setError(err.response?.data?.message || err.message || 'Failed to delete orphaned translations');
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
                            <Alert.Heading>{t('translationManagement.accessDenied')}</Alert.Heading>
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
                                {t('translationManagement.title')}
                            </h1>
                            <p className="text-muted-custom mb-0">
                                {t('translationManagement.subtitle')}
                            </p>
                        </div>
                        <div className="d-flex mt-3 mt-sm-0 btn-group">
                            <Button
                                variant={activeTab === 'ui' ? 'primary' : 'outline-primary'}
                                onClick={() => setActiveTab('ui')}
                                disabled={loading}
                            >
                                UI Translations
                            </Button>
                            <Button
                                variant={activeTab === 'orphans' ? 'primary' : 'outline-primary'}
                                onClick={() => setActiveTab('orphans')}
                                disabled={loading}
                            >
                                Orphaned
                            </Button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex flex-column flex-sm-row gap-2 mb-4">
                        {activeTab === 'ui' && (
                            <Button
                                variant="success"
                                onClick={loadAllTranslations}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="me-2" />
                                        {t('translationManagement.loading')}
                                    </>
                                ) : (
                                    t('translationManagement.loadTranslations')
                                )}
                            </Button>
                        )}

                        {activeTab === 'orphans' && (
                            <>
                                <Button
                                    variant="warning"
                                    onClick={loadOrphanedTranslations}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size="sm" className="me-2" />
                                            {t('translationManagement.loading')}
                                        </>
                                    ) : (
                                        t('translationManagement.loadOrphans')
                                    )}
                                </Button>

                                {orphanedTranslations.length > 0 && (
                                    <Button
                                        variant="danger"
                                        onClick={deleteAllOrphanedTranslations}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner size="sm" className="me-2" />
                                                {t('translationManagement.loading')}
                                            </>
                                        ) : (
                                            t('translationManagement.deleteOrphans')
                                        )}
                                    </Button>
                                )}
                            </>
                        )}
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
                                <h5 className="mb-0 text-light-custom">
                                    {activeTab === 'ui' ? 'UI Translations' : 'Orphaned Translations'}
                                </h5>
                                <Badge bg="primary">
                                    {activeTab === 'ui' ? translations.length : orphanedTranslations.length} translations
                                </Badge>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0 bg-darker-custom">
                            {activeTab === 'ui' ? (
                                // UI Translations Table
                                translations.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p className="text-muted-custom">
                                            {t('translationManagement.noTranslations')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table variant="dark" striped hover className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="text-light-custom">{t('translationManagement.uiKey')}</th>
                                                    <th className="text-light-custom">{t('translationManagement.dutch')}</th>
                                                    <th className="text-light-custom">{t('translationManagement.english')}</th>
                                                    <th className="text-center text-light-custom">{t('translationManagement.actions')}</th>
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
                                                                {t('translationManagement.edit')}
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )
                            ) : (
                                // Orphaned Translations Table
                                orphanedTranslations.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p className="text-muted-custom">
                                            {t('translationManagement.noOrphans') || 'No orphaned translations found. Click "Load Orphaned" to check for unused translations.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table variant="dark" striped hover className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="text-light-custom">ID</th>
                                                    <th className="text-light-custom">{t('translationManagement.dutch')}</th>
                                                    <th className="text-light-custom">{t('translationManagement.english')}</th>
                                                    <th className="text-light-custom">Creator</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orphanedTranslations.map((orphan) => (
                                                    <tr key={orphan._id}>
                                                        <td>
                                                            <code className="text-warning">{orphan._id}</code>
                                                        </td>
                                                        <td>
                                                            <span className="text-light-custom">
                                                                {orphan.dutch || <em className="text-muted-custom">No Dutch translation</em>}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="text-light-custom">
                                                                {orphan.english || <em className="text-muted-custom">No English translation</em>}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <code className="text-muted-custom">
                                                                {orphan.creatorUuid || 'Unknown'}
                                                            </code>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )
                            )}
                        </Card.Body>
                    </Card>

                    {/* Edit Modal */}
                    <Modal show={showEditModal} onHide={handleCloseModal} size="lg" data-bs-theme="dark">
                        <Modal.Header closeButton className="bg-dark-custom border-dark">
                            <Modal.Title className="text-light-custom">
                                {t('translationManagement.editTitle')}
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
                                        <Form.Label className="text-light-custom">{t('translationManagement.dutch')}</Form.Label>
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
                                        <Form.Label className="text-light-custom">{t('translationManagement.english')}</Form.Label>
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
                                {t('translationManagement.cancel')}
                            </Button>
                            <Button variant="primary" onClick={handleSaveTranslation} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="me-2" />
                                        {t('translationManagement.loading')}
                                    </>
                                ) : (
                                    t('translationManagement.save')
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