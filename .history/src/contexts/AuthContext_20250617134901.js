import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Important for CORS
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Add token to requests if it exists
    const token = localStorage.getItem('token');
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const signup = async (email, password) => {
        try {
            setLoading(true);
            setError('');
            const response = await api.post('/api/auth/signup', { email, password });
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
            const response = await api.post('/api/auth/verify-otp', { otp });
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
            const { token, user } = response.data;
            
            // Save token and set auth header
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(user);
            return response.data;
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

    // Add axios interceptor for token refresh and error handling
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                // Token expired or invalid
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