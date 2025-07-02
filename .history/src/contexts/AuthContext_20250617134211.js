import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Configure axios defaults
    axios.defaults.baseURL = 'http://localhost:8080'; // Update with your backend URL
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    // Add token to requests if it exists
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const signup = async (email, password) => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.post('/api/auth/signup', { email, password });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sign up');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (otp) => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.post('/api/auth/verify-otp', { otp });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to verify OTP');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signin = async (email, password) => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.post('/api/auth/signin', { email, password });
            const { token, user } = response.data;
            
            // Save token and set auth header
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(user);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sign in');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    // Add axios interceptor for token refresh
    axios.interceptors.response.use(
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