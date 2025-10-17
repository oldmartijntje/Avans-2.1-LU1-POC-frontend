import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { usePWA } from '../hooks/usePWA';
import { useTranslations } from '../hooks/useTranslations';

export const InstallAppPrompt: React.FC = () => {
    const { isInstallable, showInstallPrompt, installApp, dismissInstallPrompt } = usePWA();
    const { t } = useTranslations({
        keys: [
            'pwa.install.title',
            'pwa.install.description',
            'pwa.install.button',
            'pwa.install.dismiss'
        ]
    });

    if (!isInstallable || !showInstallPrompt) {
        return null;
    }

    return (
        <Alert variant="primary" className="mb-3 d-flex align-items-center justify-content-between">
            <div>
                <Alert.Heading className="h6 mb-1">
                    📱 {t('pwa.install.title') || 'Install Elective Hub'}
                </Alert.Heading>
                <p className="mb-0 small">
                    {t('pwa.install.description') || 'Install this app on your device for a better experience and offline access.'}
                </p>
            </div>
            <div className="d-flex gap-2 ms-3">
                <Button variant="primary" size="sm" onClick={installApp}>
                    {t('pwa.install.button') || 'Install'}
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={dismissInstallPrompt}>
                    {t('pwa.install.dismiss') || 'Not now'}
                </Button>
            </div>
        </Alert>
    );
};

export const OfflineIndicator: React.FC = () => {
    const { isOffline } = usePWA();
    const { t } = useTranslations({
        keys: [
            'pwa.offline.title',
            'pwa.offline.description'
        ]
    });

    if (!isOffline) {
        return null;
    }

    return (
        <Alert variant="warning" className="mb-3">
            <Alert.Heading className="h6 mb-1">
                📡 {t('pwa.offline.title') || 'You\'re Offline'}
            </Alert.Heading>
            <p className="mb-0 small">
                {t('pwa.offline.description') || 'Some features may not be available. You\'ll be able to use all features when you\'re back online.'}
            </p>
        </Alert>
    );
};

export const PWAStatus: React.FC = () => {
    return (
        <>
            <InstallAppPrompt />
            <OfflineIndicator />
        </>
    );
};