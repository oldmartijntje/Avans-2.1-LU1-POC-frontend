import React, { useMemo } from 'react';
import { Container, Row, Col, Card, Badge, Accordion } from 'react-bootstrap';
import { useTranslations } from '../hooks/useTranslations';

const Presentation: React.FC = () => {
    const translationKeys = useMemo(() => [

    ], []);

    const { t } = useTranslations({
        keys: translationKeys
    });

    return (
        <Container className="py-4">

        </Container>
    );
};

export default Presentation;
