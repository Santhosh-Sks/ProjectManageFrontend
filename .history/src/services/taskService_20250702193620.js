import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;
const API_URL = `${API_BASE}/api`;

const authenticatedApi = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

authenticatedApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const taskService = {
    getAllTasks: async () => {
        const response = await authenticatedApi.get(`${API_URL}/tasks`);
        return response.data;
    },

    getTaskById: async (id) => {
        const response = await authenticatedApi.get(`${API_URL}/tasks/${id}`);
        return response.data;
    },

    createTask: async (taskData) => {
        if (!taskData.title || !taskData.assignedTo) {
            throw new Error('Title and assigned user are required');
        }
        const response = await authenticatedApi.post(`${API_URL}/tasks`, taskData);
        return response.data;
    },

    updateTask: async (id, taskData) => {
        const response = await authenticatedApi.put(`${API_URL}/tasks/${id}`, taskData);
        return response.data;
    },

    deleteTask: async (id) => {
        const response = await authenticatedApi.delete(`${API_URL}/tasks/${id}`);
        return response.data;
    },

    getTasksByProjectId: async (projectId) => {
        try {
            const response = await authenticatedApi.get(`${API_URL}/tasks`);
            const allTasks = response.data;
            return allTasks.filter(task => task.projectId === projectId);
        } catch (error) {
            if (error.response?.status === 404) return [];
            throw error.response?.data || error.message;
        }
    },

    updateTaskStatus: async (taskId, status) => {
        const response = await authenticatedApi.patch(`${API_URL}/tasks/${taskId}/status`, { status });
        return response.data;
    },

    addComment: async (taskId, comment) => {
        const response = await authenticatedApi.post(`${API_URL}/comments`, {
            content: comment,
            taskId,
            createdAt: new Date().toISOString()
        });
        return response.data;
    }
};
