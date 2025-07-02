import axios from 'axios';
import { authService } from '../services/authService';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include auth headers
api.interceptors.request.use(
    (config) => {
        const authHeader = authService.getAuthHeader();
        return {
            ...config,
            headers: {
                ...config.headers,
                ...authHeader
            }
        };
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
