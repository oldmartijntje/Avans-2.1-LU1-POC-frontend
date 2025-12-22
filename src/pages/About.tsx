import React, { useMemo } from 'react';
import { Container, Row, Col, Card, Badge, Accordion, Button } from 'react-bootstrap';
import { useTranslations } from '../hooks/useTranslations';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
    const translationKeys = useMemo(() => [
        'about.hero.title',
        'about.hero.electiveHub',
        'about.hero.subtitle',
        'about.hero.presentation',
        'about.hero.presentation.old',
        'about.project.description',
        'about.epics.title',
        'about.epic1.title',
        'about.epic2.title',
        'about.epic3.title',
        'about.epic4.title',
        'about.epic5.title',
        'about.epic6.title',
        'about.epic7.title',
        'about.epic8.title',
        'about.epic9.title',
        'about.epic10.title',
        'about.epic11.title',
        'about.status.completed',
        'about.status.backend',
        'about.status.frontend'
    ], []);

    const { t } = useTranslations({
        keys: translationKeys
    });

    const epics = [
        {
            id: 'epic1',
            title: t('about.epic1.title'),
            icon: '🔍',
            stories: [
                'As a student, I want to see a list of available subjects so that I can explore my options.',
                'As a student, I want to filter subjects by study points (15 or 30 EC) so that I can find subjects that fit my schedule.',
                'As a student, I want to filter subjects by level (NLQF-5 or NLQF-6) so that I only see suitable subjects.',
                'As a student, I want to filter subjects by a tag so that I can focus on my interests.',
                'As a student, I want to see the list of tags so that I can know what I am able to filter on.'
            ]
        },
        {
            id: 'epic2',
            title: t('about.epic2.title'),
            icon: '📄',
            stories: [
                'As a student, I want to see detailed information about a subject including description, EC, and type so that I can make an informed choice.',
                'As a student, I want buttons to add subjects to my favorites so that I can save subjects I am interested in.',
                'As a student, I want a button for "more info" to access additional details or links.'
            ]
        },
        {
            id: 'epic3',
            title: t('about.epic3.title'),
            icon: '⭐',
            stories: [
                'As a student, I want to save subjects as favorites so that I can easily access them later.',
                'As a student, I want to remove subjects from my favorites list so that I can keep it organized.'
            ]
        },
        {
            id: 'epic4',
            title: t('about.epic4.title'),
            icon: '🎯',
            stories: [
                'As a student, I want to see recommended subjects based on my study program so that I can discover subjects I might like.',
                'As a student, I want recommendations to be generated using a static/mock algorithm so that I can get suggestions even without AI.'
            ]
        },
        {
            id: 'epic5',
            title: t('about.epic5.title'),
            icon: '🌍',
            stories: [
                'As a student, I want a language toggle (NL/EN) so that I can use the app in my preferred language.'
            ]
        },
        {
            id: 'epic6',
            title: t('about.epic6.title'),
            icon: '📱',
            stories: [
                'As a student, I want to install the app on my phone so that I can access it like a native app.'
            ]
        },
        {
            id: 'epic7',
            title: t('about.epic7.title'),
            icon: '🔒',
            stories: [
                'As a user, I want secure communication between frontend and backend using JWT so that my data is protected.',
                'As a developer, I want to ensure no secrets or API keys are hardcoded so that the app is secure.',
                'As a user, I want failed requests to be handled gracefully so that I understand what went wrong.'
            ]
        },
        {
            id: 'epic8',
            title: t('about.epic8.title'),
            icon: '👤',
            stories: [
                'As a student, I want to register for an account so that I can access personalized features.',
                'As a teacher, I want to register for an account so that I can manage subjects and translations.',
                'As a student, I want to log into my account so that I can access my favorites and recommendations.',
                'As a teacher, I want to log into my account so that I can manage subjects and translations.',
                'As a user, I want to stay logged in across browser sessions so that I don\'t have to log in repeatedly.',
                'As a user, I want to log out of my account so that I can secure my session.',
                'As a user, I want to see clear error messages if login fails so that I can correct any issues.'
            ]
        },
        {
            id: 'epic9',
            title: t('about.epic9.title'),
            icon: '📚',
            stories: [
                'As a teacher, I want to add new subjects so that I can manage the curriculum.',
                'As a teacher, I want to edit existing subjects so that I can update their details.',
                'As a teacher, I want to delete and edit subjects so that I can remove outdated or irrelevant ones.'
            ]
        },
        {
            id: 'epic10',
            title: t('about.epic10.title'),
            icon: '🌐',
            stories: [
                'As a teacher, I want a page to edit translations of subjects so that they are available in multiple languages.',
                'As a teacher, I want a page to edit translations of the website UI so that it is accessible to users in different languages.',
                'As a teacher, I want a page to be able to see all unused translations so that I can see how much database space is wasted.',
                'As a teacher, I want a page to be able to delete all unused translations to clean up database space.'
            ]
        },
        {
            id: 'epic11',
            title: t('about.epic11.title'),
            icon: '🎓',
            stories: [
                'As a student, I want to select a study so that I can tailor the app to my academic program.',
                'As a teacher, I want to add new studies so that I can manage the curriculum.',
                'As a teacher, I want to delete and edit studies so that I can remove outdated or irrelevant ones.',
                'As a student, I want be able to view the study that I am enrolled in so that I can see whether it is correct.'
            ]
        }
    ];

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={10} xl={9}>
                    {/* Hero Section */}
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-light-custom mb-3">
                            {t('about.hero.title')} <span className="text-primary">{t('about.hero.electiveHub')}</span>
                        </h1>
                        <p className="lead text-muted-custom">
                            {t('about.hero.subtitle')}
                        </p>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-2 m-5 justify-content-center">
                        <Link to="/presentation2" className="text-decoration-none">
                            <Button variant="primary" size="lg">{t('about.hero.presentation')}</Button>
                        </Link>
                        <Link to="/presentation" className="text-decoration-none">
                            <Button variant="secondary" size="lg">{t('about.hero.presentation.old')}</Button>
                        </Link>
                    </div>

                    {/* Project Description */}
                    <Card className="bg-gradient border-0 mb-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <h3 className="text-white mb-3">
                                    <i className="me-2">🚀</i>
                                    Avans Informatica Project
                                </h3>
                                <p className="text-white mb-0" style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
                                    {t('about.project.description')}
                                </p>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Project Stats */}
                    <Row className="mb-5">
                        <Col md={3} className="text-center mb-3">
                            <div className="bg-darker-custom border-dark rounded p-3">
                                <h2 className="text-primary mb-1">11</h2>
                                <p className="text-muted-custom mb-0">Epics</p>
                            </div>
                        </Col>
                        <Col md={3} className="text-center mb-3">
                            <div className="bg-darker-custom border-dark rounded p-3">
                                <h2 className="text-success mb-1">39</h2>
                                <p className="text-muted-custom mb-0">User Stories</p>
                            </div>
                        </Col>
                        <Col md={3} className="text-center mb-3">
                            <div className="bg-darker-custom border-dark rounded p-3">
                                <h2 className="text-info mb-1">100%</h2>
                                <p className="text-muted-custom mb-0">{t('about.status.completed')}</p>
                            </div>
                        </Col>
                        <Col md={3} className="text-center mb-3">
                            <div className="bg-darker-custom border-dark rounded p-3">
                                <h2 className="text-warning mb-1">⚡</h2>
                                <p className="text-muted-custom mb-0">PWA Ready</p>
                            </div>
                        </Col>
                    </Row>

                    {/* Epics and User Stories */}
                    <Card className="bg-darker-custom border-dark">
                        <Card.Header className="bg-dark-custom border-dark">
                            <h3 className="mb-0 text-light-custom">
                                <i className="me-2">📋</i>
                                {t('about.epics.title')}
                            </h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Accordion className="custom-accordion">
                                {epics.map((epic, index) => (
                                    <Accordion.Item key={epic.id} eventKey={index.toString()} className="bg-dark-custom border-secondary mb-2">
                                        <Accordion.Header className="bg-dark-custom">
                                            <div className="d-flex align-items-center w-100">
                                                <span className="me-3" style={{ fontSize: '1.5rem' }}>{epic.icon}</span>
                                                <div className="flex-grow-1">
                                                    <h5 className="mb-1 text-light-custom">{epic.title}</h5>
                                                    <Badge bg="success" className="me-2">
                                                        <i className="me-1">✓</i>
                                                        {epic.stories.length} {epic.stories.length === 1 ? 'Story' : 'Stories'}
                                                    </Badge>
                                                    <Badge bg="primary" className="me-2">{t('about.status.backend')}</Badge>
                                                    <Badge bg="info">{t('about.status.frontend')}</Badge>
                                                </div>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body className="bg-darker-custom">
                                            <div className="row">
                                                {epic.stories.map((story, storyIndex) => (
                                                    <div key={storyIndex} className="col-12 mb-3">
                                                        <Card className="bg-dark border-secondary h-100">
                                                            <Card.Body className="p-3">
                                                                <div className="d-flex align-items-start">
                                                                    <Badge bg="success" className="me-3 mt-1">
                                                                        <i>✓</i>
                                                                    </Badge>
                                                                    <p className="text-light-custom mb-0" style={{ lineHeight: '1.5' }}>
                                                                        {story}
                                                                    </p>
                                                                </div>
                                                                <div className="mt-2">
                                                                    <Badge bg="outline-primary" className="me-1" style={{ fontSize: '0.7rem' }}>
                                                                        {t('about.status.backend')} ✓
                                                                    </Badge>
                                                                    <Badge bg="outline-info" style={{ fontSize: '0.7rem' }}>
                                                                        {t('about.status.frontend')} ✓
                                                                    </Badge>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                ))}
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
