import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

// API base URL from .env
const API_BASE = process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add token to headers if exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join(''));
                const userData = JSON.parse(jsonPayload);
                setUser({
                    id: userData.id,
                    email: userData.sub,
                    fullName: userData.fullName,
                    username: userData.username,
                    name: userData.name
                });
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (e) {
                console.error('Error restoring token:', e);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, [user]);

    const signup = async (email, password, fullName) => {
        try {
            setLoading(true);
            setError('');
            const response = await api.post('/api/auth/signup', { email, password, fullName });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to sign up';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (otp) => {
        try {
            setLoading(true);
            setError('');
            const response = await api.post('/api/otp/verify', { otp });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to verify OTP';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const signin = async (email, password) => {
        try {
            setLoading(true);
            setError('');
            const response = await api.post('/api/auth/signin', { email, password });
            const token = response.data;
            if (token) {
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join(''));
                const userData = JSON.parse(jsonPayload);
                setUser({
                    id: userData.id,
                    email: userData.sub,
                    fullName: userData.fullName,
                    username: userData.username,
                    name: userData.name
                });
                return { token, user: userData };
            } else {
                throw new Error('No token received from server');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to sign in';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    };

    // Handle 401 errors
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                logout();
                window.location.href = '/signin';
            }
            return Promise.reject(error);
        }
    );

    const value = {
        user,
        loading,
        error,
        signup,
        verifyOTP,
        signin,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
