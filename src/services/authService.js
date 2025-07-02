import api from '../utils/api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    isAuthenticated: () => {
        const user = authService.getCurrentUser();
        return !!user;
    },

    getAuthHeader: () => {
        const user = authService.getCurrentUser();
        if (user && user.token) {
            return { Authorization: `Bearer ${user.token}` };
        }
        return {};
    }
}; 