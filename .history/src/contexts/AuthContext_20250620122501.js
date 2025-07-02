import React, { createContext, useContext, useState, useEffect } from 'react';
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
    }
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        // Add token if it exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const userData = JSON.parse(jsonPayload);
                setUser({
                    id: userData.id,
                    email: userData.sub,
                    fullName: userData.fullName,
                    username: userData.username,
                    name: userData.name
                });
            } catch (e) {
                localStorage.removeItem('token');
            }
        }
    }, []);

    const signup = async (email, password) => {
        try {
            setLoading(true);
            setError('');
            const response = await api.post('/api/auth/signup', { email, password });
            return response.data;
        } catch (err) {
            console.error('Signup error:', err.response?.data);
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
            console.error('OTP verification error:', err.response?.data);
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
            console.log('Attempting signin with:', { email }); // Debug log
            
            const response = await api.post('/api/auth/signin', { 
                email, 
                password 
            });
            
            console.log('Signin response:', response.data); // Debug log
            
            // Handle the token response
            const token = response.data;
            if (token) {
                // Save token and set auth header
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Decode token to get user info
                let userData;
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    userData = JSON.parse(jsonPayload);
                    setUser({
                        id: userData.id,
                        email: userData.sub,
                        fullName: userData.fullName,
                        username: userData.username,
                        name: userData.name
                    });
                } catch (e) {
                    console.error('Error decoding token:', e);
                    userData = { email };
                    setUser({ email });
                }
                
                return { token, user: userData };
            } else {
                throw new Error('No token received from server');
            }
        } catch (err) {
            console.error('Signin error details:', err.response?.data); // Debug log
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

    // Add response interceptor for error handling
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