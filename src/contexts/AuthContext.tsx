import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    uuid: string;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, email: string, role: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use the proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://avans-yourself.oldmartijntje.nl';

// Create axios instance with interceptor for auth token
const api = axios.create({
    baseURL: API_BASE_URL,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Set up axios interceptor to include auth token
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    const response = await api.get('/auth/profile');
                    setUser(response.data);
                    setToken(storedToken);
                } catch (error) {
                    // Token is invalid, remove it
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            console.log('Attempting login with base URL:', API_BASE_URL);
            const response = await api.post('/auth/login', {
                username,
                password
            });

            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            setToken(access_token);

            // Get user profile after successful login
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            const profileResponse = await api.get('/auth/profile');
            setUser(profileResponse.data);
        } catch (error) {
            console.error('Login error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Server responded with error status
                    console.error('Server error:', error.response.status, error.response.data);
                    throw new Error(`Login failed: ${error.response.data?.message || error.response.statusText}`);
                } else if (error.request) {
                    // Network error or no response
                    console.error('Network error:', error.message);
                    throw new Error('Network error: Unable to connect to server');
                }
            }
            throw new Error('Login failed');
        }
    };

    const register = async (username: string, password: string, email: string, role: string) => {
        try {
            console.log('Attempting registration with base URL:', API_BASE_URL);
            await api.post('/auth/register', {
                username,
                password,
                email,
                role
            });

            // Automatically login after successful registration
            await login(username, password);
        } catch (error) {
            console.error('Registration error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Server error:', error.response.status, error.response.data);
                    throw new Error(`Registration failed: ${error.response.data?.message || error.response.statusText}`);
                } else if (error.request) {
                    console.error('Network error:', error.message);
                    throw new Error('Network error: Unable to connect to server');
                }
            }
            throw new Error('Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { api };
