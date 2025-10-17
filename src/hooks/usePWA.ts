import { useEffect, useState } from 'react';

interface PWAInstallPrompt {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAHookReturn {
    isInstallable: boolean;
    isInstalled: boolean;
    isOffline: boolean;
    installApp: () => Promise<void>;
    showInstallPrompt: boolean;
    dismissInstallPrompt: () => void;
}

export const usePWA = (): PWAHookReturn => {
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }

        // Check if app is already installed
        const checkIfInstalled = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isInWebAppiOS = (window.navigator as any).standalone === true;
            setIsInstalled(isStandalone || isInWebAppiOS);
        };

        checkIfInstalled();

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as any);
            setIsInstallable(true);

            // Show install prompt after a delay (don't be too aggressive)
            setTimeout(() => {
                setShowInstallPrompt(true);
            }, 10000); // Show after 10 seconds
        };

        // Listen for app installed
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setShowInstallPrompt(false);
            console.log('PWA was installed');
        };

        // Listen for online/offline status
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const installApp = async (): Promise<void> => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const dismissInstallPrompt = () => {
        setShowInstallPrompt(false);
        // Don't show again for this session
    };

    return {
        isInstallable,
        isInstalled,
        isOffline,
        installApp,
        showInstallPrompt,
        dismissInstallPrompt
    };
};