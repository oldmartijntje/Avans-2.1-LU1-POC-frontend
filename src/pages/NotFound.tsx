import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';

function NotFound() {
    const { t } = useTranslations({
        keys: ['pageNotFound', 'pageNotFoundMessage', 'goHome', 'goBack']
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we're on GitHub Pages and handle client-side routing
        const path = window.location.pathname;
        const basePath = '/Avans-2.1-LU1-POC-frontend';

        // If we're on a path that should be handled by React Router
        if (path.startsWith(basePath) && path !== basePath && path !== `${basePath}/`) {
            const routePath = path.replace(basePath, '') || '/';
            // Replace the current history entry to avoid redirect loops
            window.history.replaceState(null, '', `${basePath}${routePath}`);
            navigate(routePath, { replace: true });
        }
    }, [navigate]);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6 text-center">
                    <div className="card bg-dark text-light border-primary">
                        <div className="card-body py-5">
                            <h1 className="display-1 text-primary mb-4">404</h1>
                            <h2 className="h3 mb-4">{t('pageNotFound')}</h2>
                            <p className="mb-4">
                                {t('pageNotFoundMessage')}
                            </p>
                            <div className="d-flex gap-3 justify-content-center flex-wrap">
                                <Link to="/" className="btn text-bg-primary btn-primary">
                                    {t('goHome')}
                                </Link>
                                <button
                                    onClick={() => window.history.back()}
                                    className="btn btn-outline-light"
                                >
                                    {t('goBack')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;