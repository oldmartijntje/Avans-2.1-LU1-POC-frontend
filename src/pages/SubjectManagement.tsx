import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Modal,
    Form,
    Alert,
    Badge,
    Spinner,
    ButtonGroup
} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';
import type {
    Subject,
    CreateSubjectRequest
} from '../services/subjectService';
import { subjectService } from '../services/subjectService';

const SubjectManagement: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslations({
        keys: [
            'subjectManagement.title',
            'subjectManagement.subtitle',
            'subjectManagement.accessDenied',
            'subjectManagement.loadSubjects',
            'subjectManagement.createNew',
            'subjectManagement.noSubjects',
            'subjectManagement.loading',
            'subjectManagement.error',
            'subjectManagement.success',
            'subjectManagement.delete.confirm',
            'subjectManagement.delete.success',
            'subjectManagement.delete.error',
            'subjectManagement.form.title',
            'subjectManagement.form.titleNL',
            'subjectManagement.form.titleEN',
            'subjectManagement.form.descriptionNL',
            'subjectManagement.form.descriptionEN',
            'subjectManagement.form.moreInfoNL',
            'subjectManagement.form.moreInfoEN',
            'subjectManagement.form.level',
            'subjectManagement.form.studyPoints',
            'subjectManagement.form.languages',
            'subjectManagement.form.tags',
            'subjectManagement.form.save',
            'subjectManagement.form.cancel',
            'subjectManagement.form.creating',
            'subjectManagement.form.updating',
            'subjectManagement.table.title',
            'subjectManagement.table.level',
            'subjectManagement.table.points',
            'subjectManagement.table.languages',
            'subjectManagement.table.tags',
            'subjectManagement.table.actions',
            'subjectManagement.actions.view',
            'subjectManagement.actions.edit',
            'subjectManagement.actions.delete',
            'subjectManagement.filters.level',
            'subjectManagement.filters.points',
            'subjectManagement.filters.tag',
            'subjectManagement.filters.clear'
        ]
    });

    // State
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState<CreateSubjectRequest>({
        titleNL: '',
        titleEN: '',
        descriptionNL: '',
        descriptionEN: '',
        moreInfoNL: '',
        moreInfoEN: '',
        level: 'NLQF-5',
        studyPoints: 3,
        languages: ['NL', 'EN'],
        tags: []
    });

    // Tags input state (temporary input value)
    const [tagsInput, setTagsInput] = useState('');

    // Filter state
    const [filters, setFilters] = useState({
        level: '',
        points: '',
        tag: ''
    });

    // Check access
    const hasAccess = user?.role === 'TEACHER' || user?.role === 'ADMIN';

    useEffect(() => {
        if (hasAccess) {
            loadSubjects();
        }
    }, [hasAccess]);

    const loadSubjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const filterParams = {
                ...(filters.level && { level: filters.level }),
                ...(filters.points && { points: parseInt(filters.points) }),
                ...(filters.tag && { tag: filters.tag })
            };

            const data = await subjectService.getAllSubjects(filterParams);
            setSubjects(data);
            setSuccess(t('subjectManagement.success') || 'Subjects loaded successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : t('subjectManagement.error') || 'Failed to load subjects');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingSubject(null);
        setFormData({
            titleNL: '',
            titleEN: '',
            descriptionNL: '',
            descriptionEN: '',
            moreInfoNL: '',
            moreInfoEN: '',
            level: 'NLQF-5',
            studyPoints: 3,
            languages: ['NL', 'EN'],
            tags: []
        });
        setTagsInput('');
        setShowModal(true);
    };

    const handleEdit = (subject: Subject) => {
        setEditingSubject(subject);
        setFormData({
            titleNL: subject.title?.dutch || '',
            titleEN: subject.title?.english || '',
            descriptionNL: subject.description?.dutch || '',
            descriptionEN: subject.description?.english || '',
            moreInfoNL: subject.moreInfo?.dutch || '',
            moreInfoEN: subject.moreInfo?.english || '',
            level: subject.level,
            studyPoints: subject.studyPoints,
            languages: subject.languages,
            tags: subject.tags.map(tag => tag.tagName)
        });
        setTagsInput(subject.tags.map(tag => tag.tagName).join(', '));
        setShowModal(true);
    };

    const handleView = (subject: Subject) => {
        navigate(`/subject/${subject.uuid}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (editingSubject) {
                await subjectService.updateSubject(editingSubject.uuid!, formData);
                setSuccess(t('subjectManagement.success') || 'Subject updated successfully');
            } else {
                await subjectService.createSubject(formData);
                setSuccess(t('subjectManagement.success') || 'Subject created successfully');
            }
            setShowModal(false);
            loadSubjects();
        } catch (err) {
            setError(err instanceof Error ? err.message : t('subjectManagement.error') || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (subject: Subject) => {
        if (!subject.uuid) return;

        if (window.confirm(t('subjectManagement.delete.confirm') || 'Are you sure you want to delete this subject?')) {
            try {
                await subjectService.deleteSubject(subject.uuid);
                setSuccess(t('subjectManagement.delete.success') || 'Subject deleted successfully');
                loadSubjects();
            } catch (err) {
                setError(err instanceof Error ? err.message : t('subjectManagement.delete.error') || 'Failed to delete subject');
            }
        }
    };

    const handleInputChange = (field: keyof CreateSubjectRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLanguageChange = (language: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            languages: checked
                ? [...prev.languages, language]
                : prev.languages.filter(l => l !== language)
        }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagsInput(e.target.value);
    };

    // Parse tags when the input loses focus or on Enter
    const handleTagsBlur = () => {
        const tags = tagsInput
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        setFormData(prev => ({
            ...prev,
            tags
        }));
    };

    const clearFilters = () => {
        setFilters({ level: '', points: '', tag: '' });
        loadSubjects();
    };

    if (!hasAccess) {
        return (
            <Container className="py-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="bg-darker-custom border-danger">
                            <Card.Header className="bg-danger text-white">
                                <h4 className="mb-0">{t('subjectManagement.accessDenied')}</h4>
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
            <Row>
                <Col>
                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="h2 fw-bold text-light-custom mb-1">
                            {t('subjectManagement.title') || 'Subject Management'}
                        </h1>
                        <p className="text-muted-custom mb-0">
                            {t('subjectManagement.subtitle') || 'Manage elective modules and courses'}
                        </p>
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

                    {/* Filters and Actions */}
                    <Card className="bg-darker-custom border-dark mb-4">
                        <Card.Body>
                            <Row className="align-items-end">
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="text-light-custom">
                                            {t('subjectManagement.filters.level') || 'Level'}
                                        </Form.Label>
                                        <Form.Select
                                            value={filters.level}
                                            onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                                            className="bg-dark-custom text-light-custom border-dark"
                                        >
                                            <option value="">All Levels</option>
                                            <option value="NLQF-5">NLQF-5</option>
                                            <option value="NLQF-6">NLQF-6</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="text-light-custom">
                                            {t('subjectManagement.filters.points') || 'Study Points'}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={filters.points}
                                            onChange={(e) => setFilters(prev => ({ ...prev, points: e.target.value }))}
                                            placeholder="Study points"
                                            className="bg-dark-custom text-light-custom border-dark"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="text-light-custom">
                                            {t('subjectManagement.filters.tag') || 'Tag'}
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={filters.tag}
                                            onChange={(e) => setFilters(prev => ({ ...prev, tag: e.target.value }))}
                                            placeholder="Tag name"
                                            className="bg-dark-custom text-light-custom border-dark"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <ButtonGroup className="w-100">
                                        <Button variant="outline-primary" onClick={loadSubjects}>
                                            {loading ? (
                                                <Spinner size="sm" />
                                            ) : (
                                                t('subjectManagement.loadSubjects') || 'Load Subjects'
                                            )}
                                        </Button>
                                        <Button variant="outline-secondary" onClick={clearFilters}>
                                            {t('subjectManagement.filters.clear') || 'Clear'}
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <Button variant="primary" onClick={handleCreateNew}>
                                        {t('subjectManagement.createNew') || 'Create New Subject'}
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Subjects Table */}
                    <Card className="bg-darker-custom border-dark">
                        <Card.Body>
                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="text-muted-custom mt-2">
                                        {t('subjectManagement.loading') || 'Loading subjects...'}
                                    </p>
                                </div>
                            ) : subjects.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted-custom">
                                        {t('subjectManagement.noSubjects') || 'No subjects found'}
                                    </p>
                                </div>
                            ) : (
                                <Table responsive className="table-dark">
                                    <thead>
                                        <tr>
                                            <th>{t('subjectManagement.table.title') || 'Title'}</th>
                                            <th>{t('subjectManagement.table.level') || 'Level'}</th>
                                            <th>{t('subjectManagement.table.points') || 'Points'}</th>
                                            <th>{t('subjectManagement.table.languages') || 'Languages'}</th>
                                            <th>{t('subjectManagement.table.tags') || 'Tags'}</th>
                                            <th>{t('subjectManagement.table.actions') || 'Actions'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subjects.map((subject) => (
                                            <tr key={subject.uuid || subject._id}>
                                                <td>
                                                    <div>
                                                        <div className="fw-bold">
                                                            {subject.title?.english || 'No title'}
                                                        </div>
                                                        <small className="text-muted">
                                                            {subject.title?.dutch || 'Geen titel'}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Badge bg="info">{subject.level}</Badge>
                                                </td>
                                                <td>{subject.studyPoints}</td>
                                                <td>
                                                    {subject.languages.map(lang => (
                                                        <Badge key={lang} bg="secondary" className="me-1">
                                                            {lang}
                                                        </Badge>
                                                    ))}
                                                </td>
                                                <td>
                                                    {subject.tags.slice(0, 2).map(tag => (
                                                        <Badge key={tag._id} bg="outline-primary" className="me-1">
                                                            {tag.tagName}
                                                        </Badge>
                                                    ))}
                                                    {subject.tags.length > 2 && (
                                                        <Badge bg="outline-secondary">
                                                            +{subject.tags.length - 2}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    <ButtonGroup size="sm">
                                                        <Button
                                                            variant="outline-info"
                                                            onClick={() => handleView(subject)}
                                                        >
                                                            {t('subjectManagement.actions.view') || 'View'}
                                                        </Button>
                                                        <Button
                                                            variant="outline-warning"
                                                            onClick={() => handleEdit(subject)}
                                                        >
                                                            {t('subjectManagement.actions.edit') || 'Edit'}
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() => handleDelete(subject)}
                                                        >
                                                            {t('subjectManagement.actions.delete') || 'Delete'}
                                                        </Button>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Create/Edit Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                className="modal-dark"
            >
                <Modal.Header closeButton className="bg-dark-custom border-dark">
                    <Modal.Title className="text-light-custom">
                        {editingSubject
                            ? `Edit Subject: ${editingSubject.title?.english || 'Unknown'}`
                            : (t('subjectManagement.createNew') || 'Create New Subject')
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-darker-custom">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('subjectManagement.form.titleNL') || 'Title (Dutch)'}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.titleNL}
                                        onChange={(e) => handleInputChange('titleNL', e.target.value)}
                                        required
                                        className="bg-dark-custom text-light-custom border-dark"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('subjectManagement.form.titleEN') || 'Title (English)'}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.titleEN}
                                        onChange={(e) => handleInputChange('titleEN', e.target.value)}
                                        required
                                        className="bg-dark-custom text-light-custom border-dark"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('subjectManagement.form.descriptionNL') || 'Description (Dutch)'}
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.descriptionNL}
                                        onChange={(e) => handleInputChange('descriptionNL', e.target.value)}
                                        required
                                        className="bg-dark-custom text-light-custom border-dark"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('subjectManagement.form.descriptionEN') || 'Description (English)'}
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.descriptionEN}
                                        onChange={(e) => handleInputChange('descriptionEN', e.target.value)}
                                        required
                                        className="bg-dark-custom text-light-custom border-dark"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('subjectManagement.form.moreInfoNL') || 'More Info (Dutch)'}
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={formData.moreInfoNL}
                                        onChange={(e) => handleInputChange('moreInfoNL', e.target.value)}
                                        className="bg-dark-custom text-light-custom border-dark"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('subjectManagement.form.moreInfoEN') || 'More Info (English)'}
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={formData.moreInfoEN}
                                        onChange={(e) => handleInputChange('moreInfoEN', e.target.value)}
                                        className="bg-dark-custom text-light-custom border-dark"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('subjectManagement.form.level') || 'Level'}
                                    </Form.Label>
                                    <Form.Select
                                        value={formData.level}
                                        onChange={(e) => handleInputChange('level', e.target.value)}
                                        required
                                        className="bg-dark-custom text-light-custom border-dark"
                                    >
                                        <option value="NLQF-5">NLQF-5</option>
                                        <option value="NLQF-6">NLQF-6</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('subjectManagement.form.studyPoints') || 'Study Points'}
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.studyPoints}
                                        onChange={(e) => handleInputChange('studyPoints', parseInt(e.target.value))}
                                        required
                                        className="bg-dark-custom text-light-custom border-dark"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light-custom">
                                        {t('subjectManagement.form.languages') || 'Languages'}
                                    </Form.Label>
                                    <div>
                                        {['NL', 'EN', 'DE', 'FR'].map(lang => (
                                            <Form.Check
                                                key={lang}
                                                type="checkbox"
                                                id={`lang-${lang}`}
                                                label={lang}
                                                checked={formData.languages.includes(lang)}
                                                onChange={(e) => handleLanguageChange(lang, e.target.checked)}
                                                className="text-light-custom"
                                            />
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-light-custom">
                                {t('subjectManagement.form.tags') || 'Tags (comma-separated)'}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={tagsInput}
                                onChange={handleTagsChange}
                                onBlur={handleTagsBlur}
                                placeholder="programming, web development, react"
                                className="bg-dark-custom text-light-custom border-dark"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="bg-dark-custom border-dark">
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        {t('subjectManagement.form.cancel') || 'Cancel'}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner size="sm" className="me-2" />
                                {editingSubject
                                    ? (t('subjectManagement.form.updating') || 'Updating...')
                                    : (t('subjectManagement.form.creating') || 'Creating...')
                                }
                            </>
                        ) : (
                            t('subjectManagement.form.save') || 'Save'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default SubjectManagement;