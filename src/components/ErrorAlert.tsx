import React from 'react';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface UnauthorizedErrorProps {
    message?: string;
    onClose?: () => void;
    showDismiss?: boolean;
}

export const UnauthorizedError: React.FC<UnauthorizedErrorProps> = ({
    message = 'Unauthorized access',
    onClose,
    showDismiss = true
}) => {
    return (
        <Alert
            variant="danger"
            dismissible={showDismiss}
            onClose={onClose}
        >
            {message}. <Link to="/logout" className="text-decoration-underline">You might need to log back in</Link>.
        </Alert>
    );
};

interface NotFoundErrorProps {
    message?: string;
    onClose?: () => void;
    showDismiss?: boolean;
}

export const NotFoundError: React.FC<NotFoundErrorProps> = ({
    message = 'Resource not found',
    onClose,
    showDismiss = true
}) => {
    return (
        <Alert
            variant="warning"
            dismissible={showDismiss}
            onClose={onClose}
        >
            {message}
        </Alert>
    );
};

interface ApiErrorAlertProps {
    error: string | null;
    isUnauthorized?: boolean;
    onClose?: () => void;
    showDismiss?: boolean;
}

export const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({
    error,
    isUnauthorized = false,
    onClose,
    showDismiss = true
}) => {
    if (!error) return null;

    if (isUnauthorized) {
        return <UnauthorizedError message={error} onClose={onClose} showDismiss={showDismiss} />;
    }

    return (
        <Alert
            variant="danger"
            dismissible={showDismiss}
            onClose={onClose}
        >
            {error}
        </Alert>
    );
};