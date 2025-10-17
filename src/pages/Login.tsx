import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslations({
        keys: [
            'login.title',
            'login.subtitle',
            'login.form.username',
            'login.form.password',
            'login.form.placeholder.username',
            'login.form.placeholder.password',
            'login.button.signingIn',
            'login.button.signIn',
            'login.footer.noAccount',
            'login.footer.registerHere',
            'login.error.invalid'
        ]
    });

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.username, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(t('login.error.invalid'));
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
                                <h2 className="h3 fw-bold text-light-custom mb-2">{t('login.title')}</h2>
                                <p className="text-muted-custom">{t('login.subtitle')}</p>
                            </div>

                            {error && (
                                <Alert variant="danger" className="mb-4">
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('login.form.username')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder={t('login.form.placeholder.username')}
                                        required
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>{t('login.form.password')}</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder={t('login.form.placeholder.password')}
                                        required
                                        disabled={loading}
                                    />
                                </Form.Group>

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
                                                {t('login.button.signingIn')}
                                            </>
                                        ) : (
                                            t('login.button.signIn')
                                        )}
                                    </Button>
                                </div>
                            </Form>

                            <div className="text-center">
                                <p className="text-muted-custom small mb-0">
                                    {t('login.footer.noAccount')}{' '}
                                    <Link to="/register" className="text-primary">
                                        {t('login.footer.registerHere')}
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

export default Login;
