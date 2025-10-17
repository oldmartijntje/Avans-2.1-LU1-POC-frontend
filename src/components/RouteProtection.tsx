import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

interface AnonymousRouteProps {
    children: React.ReactNode;
}

export const AnonymousRoute: React.FC<AnonymousRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (isAuthenticated) {
        // Redirect to home if already authenticated
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

interface TeacherRouteProps {
    children: React.ReactNode;
}

export const TeacherRoute: React.FC<TeacherRouteProps> = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has teacher or admin role
    if (user?.role !== 'TEACHER' && user?.role !== 'ADMIN') {
        // Redirect to dashboard if not authorized
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
