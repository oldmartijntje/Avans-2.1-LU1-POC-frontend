import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const { t } = useTranslations({
        keys: [
            'nav.home',
            'nav.about',
            'nav.dashboard',
            'nav.login',
            'nav.register',
            'nav.translations',
            'nav.translationManagement',
            'nav.welcome',
            'nav.logout'
        ]
    });

    const handleLogout = () => {
        logout();
        navigate('/');
        setExpanded(false);
    };

    const handleNavClick = () => {
        setExpanded(false);
    };

    return (
        <Navbar bg="darker-custom" variant="dark" expand="lg" expanded={expanded} onToggle={setExpanded} className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" onClick={handleNavClick}>
                    Avans Elective Hub
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" onClick={handleNavClick}>
                            {t('nav.home', 'Home')}
                        </Nav.Link>
                        <Nav.Link as={Link} to="/about" onClick={handleNavClick}>
                            {t('nav.about', 'About')}
                        </Nav.Link>
                        <Nav.Link as={Link} to="/translation-example" onClick={handleNavClick}>
                            {t('nav.translations', 'Translation Demo')}
                        </Nav.Link>
                        {isAuthenticated && (
                            <Nav.Link as={Link} to="/dashboard" onClick={handleNavClick}>
                                {t('nav.dashboard', 'Dashboard')}
                            </Nav.Link>
                        )}
                        {isAuthenticated && (user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                            <Nav.Link as={Link} to="/translation-management" onClick={handleNavClick}>
                                {t('nav.translationManagement', 'Translation Management')}
                            </Nav.Link>
                        )}
                    </Nav>

                    <Nav className="ms-auto align-items-lg-center">
                        <div className="me-3">
                            <LanguageSwitcher />
                        </div>
                        {isAuthenticated ? (
                            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
                                <span className="text-light-custom small">
                                    {t('nav.welcome', 'Welcome')}, <strong>{user?.username}</strong>
                                </span>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    {t('nav.logout', 'Logout')}
                                </Button>
                            </div>
                        ) : (
                            <div className="d-flex flex-column flex-lg-row gap-2">
                                <Link to="/login" className="text-decoration-none" onClick={handleNavClick}>
                                    <Button variant="primary" size="sm" className="w-100">
                                        {t('nav.login', 'Login')}
                                    </Button>
                                </Link>
                                <Link to="/register" className="text-decoration-none" onClick={handleNavClick}>
                                    <Button variant="outline-primary" size="sm" className="w-100">
                                        {t('nav.register', 'Register')}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
