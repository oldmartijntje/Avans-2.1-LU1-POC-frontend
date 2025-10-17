import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslations({
        keys: [
            'register.title',
            'register.subtitle',
            'register.form.username',
            'register.form.email',
            'register.form.role',
            'register.form.password',
            'register.form.confirmPassword',
            'register.form.role.student',
            'register.form.role.teacher',
            'register.form.role.admin',
            'register.form.placeholder.username',
            'register.form.placeholder.email',
            'register.form.placeholder.password',
            'register.form.placeholder.confirmPassword',
            'register.button.creating',
            'register.button.create',
            'register.footer.hasAccount',
            'register.footer.signInHere',
            'register.error.passwordMatch',
            'register.error.passwordLength',
            'register.error.failed'
        ]
    });

    const handleChange = (e: React.ChangeEvent<any>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError(t('register.error.passwordMatch'));
            return;
        }

        if (formData.password.length < 3) {
            setError(t('register.error.passwordLength'));
            return;
        }

        setLoading(true);

        try {
            await register(formData.username, formData.password, formData.email, formData.role);
            navigate('/', { replace: true });
        } catch (err) {
            setError(t('register.error.failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                    <Card className="shadow">
                        <Card.Body className="p-4 p-sm-5">
                            <div className="text-center mb-4">
                                <h2 className="h3 fw-bold text-light-custom mb-2">{t('register.title')}</h2>
                                <p className="text-muted-custom">{t('register.subtitle')}</p>
                            </div>                            {error && (
                                <Alert variant="danger" className="mb-4">
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('register.form.username')}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder={t('register.form.placeholder.username')}
                                                required
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('register.form.email')}</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder={t('register.form.placeholder.email')}
                                                required
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('register.form.role')}</Form.Label>
                                    <Form.Select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    >
                                        <option value="STUDENT">{t('register.form.role.student')}</option>
                                        <option value="TEACHER">{t('register.form.role.teacher')}</option>
                                        <option value="ADMIN">{t('register.form.role.admin')}</option>
                                    </Form.Select>
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('register.form.password')}</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder={t('register.form.placeholder.password')}
                                                required
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>{t('register.form.confirmPassword')}</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder={t('register.form.placeholder.confirmPassword')}
                                                required
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-grid mb-4">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-avans me-2"></span>
                                                {t('register.button.creating')}
                                            </>
                                        ) : (
                                            t('register.button.create')
                                        )}
                                    </Button>
                                </div>
                            </Form>

                            <div className="text-center">
                                <p className="text-muted-custom small mb-0">
                                    {t('register.footer.hasAccount')}{' '}
                                    <Link to="/login" className="text-primary">
                                        {t('register.footer.signInHere')}
                                    </Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
