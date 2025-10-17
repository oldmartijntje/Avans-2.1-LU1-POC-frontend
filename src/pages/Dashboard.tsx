import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslations({
        keys: [
            'dashboard.title',
            'dashboard.subtitle',
            'dashboard.logout',
            'dashboard.welcome.title',
            'dashboard.welcome.description',
            'dashboard.account.title',
            'dashboard.account.username',
            'dashboard.account.email',
            'dashboard.account.role',
            'dashboard.account.userId',
            'dashboard.access.title',
            'dashboard.access.verified',
            'dashboard.access.teacherDescription',
            'dashboard.access.studentDescription',
            'dashboard.access.authenticated',
            'dashboard.access.sentencePart1',
            'dashboard.access.sentencePart2'
        ]
    });

    const handleLogout = () => {
        logout();
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'danger';
            case 'TEACHER': return 'warning';
            case 'STUDENT': return 'primary';
            default: return 'secondary';
        }
    };

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col xl={10}>
                    {/* Header */}
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
                        <div>
                            <h1 className="h2 fw-bold text-light-custom mb-1">{t('dashboard.title')}</h1>
                            <p className="text-muted-custom mb-0">{t('dashboard.subtitle')}</p>
                        </div>
                        <Button
                            variant="outline-danger"
                            onClick={handleLogout}
                            className="mt-3 mt-sm-0"
                        >
                            {t('dashboard.logout')}
                        </Button>
                    </div>

                    {/* Welcome Alert */}
                    <Card className="mb-4 border-primary">
                        <Card.Body className="bg-primary bg-opacity-10">
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                        <i className="text-white fs-4">👋</i>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-light-custom mb-1">{t('dashboard.welcome.title').replace('{{username}}', user?.username || '')}</h5>
                                    <p className="text-muted-custom mb-0">
                                        {t('dashboard.welcome.description')}
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {user && (
                        <Row className="g-4">
                            {/* User Information Card */}
                            <Col lg={6}>
                                <Card className="h-100">
                                    <Card.Header>
                                        <h5 className="card-title mb-0">
                                            <i className="me-2">👤</i>
                                            {t('dashboard.account.title')}
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="d-flex flex-column gap-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-medium text-muted-custom">{t('dashboard.account.username')}:</span>
                                                <span className="text-light-custom">{user.username}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-medium text-muted-custom">{t('dashboard.account.email')}:</span>
                                                <span className="text-light-custom">{user.email}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-medium text-muted-custom">{t('dashboard.account.role')}:</span>
                                                <Badge bg={getRoleBadgeVariant(user.role)} className="text-uppercase">
                                                    {user.role}
                                                </Badge>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-medium text-muted-custom">{t('dashboard.account.userId')}:</span>
                                                <code className="text-primary small">{user.uuid}</code>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Access Level Card */}
                            <Col lg={6}>
                                <Card className="h-100">
                                    <Card.Header>
                                        <h5 className="card-title mb-0">
                                            <i className="me-2">🔐</i>
                                            {t('dashboard.access.title')}
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="text-center">
                                            <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                                                <i className="text-white fs-2">✓</i>
                                            </div>
                                            <h6 className="text-light-custom mb-2">{t('dashboard.access.verified')}</h6>
                                            <p className="text-muted-custom mb-3">
                                                {t('dashboard.access.sentencePart1')}<strong className="text-primary">{user.role}</strong>{t('dashboard.access.sentencePart2')}{user.role === 'TEACHER' ? t('dashboard.access.teacherDescription') : t('dashboard.access.studentDescription')}.
                                            </p>
                                            <Badge bg="success" className="px-3 py-2">
                                                <i className="me-1">🛡️</i>
                                                {t('dashboard.access.authenticated')}
                                            </Badge>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
