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
            'dashboard.quickActions.title',
            'dashboard.quickActions.createModule',
            'dashboard.quickActions.myModules',
            'dashboard.quickActions.enrollments',
            'dashboard.quickActions.analytics',
            'dashboard.quickActions.browseModules',
            'dashboard.quickActions.myEnrollments',
            'dashboard.quickActions.recommendations',
            'dashboard.quickActions.schedule',
            'dashboard.quickActions.comingSoon'
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
                            <h1 className="h2 fw-bold text-light-custom mb-1">{t('dashboard.title', 'My Elective Modules')}</h1>
                            <p className="text-muted-custom mb-0">{t('dashboard.subtitle', 'Manage your elective module selections')}</p>
                        </div>
                        <Button
                            variant="outline-danger"
                            onClick={handleLogout}
                            className="mt-3 mt-sm-0"
                        >
                            {t('dashboard.logout', 'Logout')}
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
                                    <h5 className="text-light-custom mb-1">{t('dashboard.welcome.title', 'Welcome, {{username}}!').replace('{{username}}', user?.username || '')}</h5>
                                    <p className="text-muted-custom mb-0">
                                        {t('dashboard.welcome.description', 'Find and enroll in elective modules that complement your study program.')}
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
                                            {t('dashboard.account.title', 'Account Information')}
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="d-flex flex-column gap-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-medium text-muted-custom">{t('dashboard.account.username', 'Username')}:</span>
                                                <span className="text-light-custom">{user.username}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-medium text-muted-custom">{t('dashboard.account.email', 'Email')}:</span>
                                                <span className="text-light-custom">{user.email}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-medium text-muted-custom">{t('dashboard.account.role', 'Role')}:</span>
                                                <Badge bg={getRoleBadgeVariant(user.role)} className="text-uppercase">
                                                    {user.role}
                                                </Badge>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-medium text-muted-custom">{t('dashboard.account.userId', 'User ID')}:</span>
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
                                            {t('dashboard.access.title', 'Access Level')}
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="text-center">
                                            <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                                                <i className="text-white fs-2">✓</i>
                                            </div>
                                            <h6 className="text-light-custom mb-2">{t('dashboard.access.verified', 'Access Verified')}</h6>
                                            <p className="text-muted-custom mb-3">
                                                As a <strong className="text-primary">{user.role}</strong>, you can {user.role === 'TEACHER' ? t('dashboard.access.teacherDescription', 'create and manage elective modules') : t('dashboard.access.studentDescription', 'browse and enroll in available elective modules')}.
                                            </p>
                                            <Badge bg="success" className="px-3 py-2">
                                                <i className="me-1">🛡️</i>
                                                {t('dashboard.access.authenticated', 'Authenticated User')}
                                            </Badge>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Quick Actions */}
                            <Col xs={12}>
                                <Card>
                                    <Card.Header>
                                        <h5 className="card-title mb-0">
                                            <i className="me-2">⚡</i>
                                            {t('dashboard.quickActions.title', 'Quick Actions')}
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className="g-2">
                                            {user?.role === 'TEACHER' ? (
                                                <>
                                                    <Col sm={6} md={3}>
                                                        <Button variant="outline-primary" className="w-100" disabled>
                                                            <i className="me-2">➕</i>
                                                            {t('dashboard.quickActions.createModule', 'Create Module')}
                                                        </Button>
                                                    </Col>
                                                    <Col sm={6} md={3}>
                                                        <Button variant="outline-primary" className="w-100" disabled>
                                                            <i className="me-2">📚</i>
                                                            {t('dashboard.quickActions.myModules', 'My Modules')}
                                                        </Button>
                                                    </Col>
                                                    <Col sm={6} md={3}>
                                                        <Button variant="outline-primary" className="w-100" disabled>
                                                            <i className="me-2">👥</i>
                                                            {t('dashboard.quickActions.enrollments', 'Enrollments')}
                                                        </Button>
                                                    </Col>
                                                    <Col sm={6} md={3}>
                                                        <Button variant="outline-primary" className="w-100" disabled>
                                                            <i className="me-2">📊</i>
                                                            {t('dashboard.quickActions.analytics', 'Analytics')}
                                                        </Button>
                                                    </Col>
                                                </>
                                            ) : (
                                                <>
                                                    <Col sm={6} md={3}>
                                                        <Button variant="outline-primary" className="w-100" disabled>
                                                            <i className="me-2">🔍</i>
                                                            {t('dashboard.quickActions.browseModules', 'Browse Modules')}
                                                        </Button>
                                                    </Col>
                                                    <Col sm={6} md={3}>
                                                        <Button variant="outline-primary" className="w-100" disabled>
                                                            <i className="me-2">📋</i>
                                                            {t('dashboard.quickActions.myEnrollments', 'My Enrollments')}
                                                        </Button>
                                                    </Col>
                                                    <Col sm={6} md={3}>
                                                        <Button variant="outline-primary" className="w-100" disabled>
                                                            <i className="me-2">⭐</i>
                                                            {t('dashboard.quickActions.recommendations', 'Recommendations')}
                                                        </Button>
                                                    </Col>
                                                    <Col sm={6} md={3}>
                                                        <Button variant="outline-primary" className="w-100" disabled>
                                                            <i className="me-2">📅</i>
                                                            {t('dashboard.quickActions.schedule', 'Schedule')}
                                                        </Button>
                                                    </Col>
                                                </>
                                            )}
                                        </Row>
                                        <div className="mt-3">
                                            <small className="text-muted-custom">
                                                <i className="me-1">ℹ️</i>
                                                {t('dashboard.quickActions.comingSoon', 'These features are coming soon! This is a proof-of-concept demonstration.')}
                                            </small>
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
