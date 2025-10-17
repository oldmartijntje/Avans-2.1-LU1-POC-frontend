import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';

const Logout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslations({
        keys: [
            'logout.title',
            'logout.message',
            'logout.redirecting'
        ]
    });

    useEffect(() => {
        // Perform logout
        logout();

        // Redirect to login page after a brief delay
        const timer = setTimeout(() => {
            navigate('/login');
        }, 1500);

        // Cleanup timer on component unmount
        return () => clearTimeout(timer);
    }, [logout, navigate]);

    return (
        <Container className="py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <Card className="bg-medium-dark-custom border-dark-custom shadow">
                        <Card.Body className="text-center py-5">
                            <div className="mb-4">
                                <Spinner animation="border" variant="primary" />
                            </div>
                            <h3 className="text-light-custom mb-3">
                                {t('logout.title') || 'Logging Out'}
                            </h3>
                            <p className="text-muted-custom mb-3">
                                {t('logout.message') || 'You have been logged out successfully.'}
                            </p>
                            <small className="text-muted-custom">
                                {t('logout.redirecting') || 'Redirecting to login page...'}
                            </small>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
};

export default Logout;