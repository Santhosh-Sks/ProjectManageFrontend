import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Create authenticated axios instance
const authenticatedApi = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor to include token
authenticatedApi.interceptors.request.use(
    (config) => {
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

export const taskService = {
    // Get all tasks
    getAllTasks: async () => {
        try {
            const response = await authenticatedApi.get(`${API_URL}/tasks`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get task by ID
    getTaskById: async (id) => {
        try {
            const response = await authenticatedApi.get(`${API_URL}/tasks/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new task
    createTask: async (taskData) => {
        try {
            if (!taskData.title || !taskData.assignedTo) {
                throw new Error('Title and assigned user are required');
            }
            const response = await authenticatedApi.post(`${API_URL}/tasks`, taskData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update task
    updateTask: async (id, taskData) => {
        try {
            const response = await authenticatedApi.put(`${API_URL}/tasks/${id}`, taskData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete task
    deleteTask: async (id) => {
        try {
            const response = await authenticatedApi.delete(`${API_URL}/tasks/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get tasks by project ID
    getTasksByProjectId: async (projectId) => {
        try {
            // Use the existing getAllTasks endpoint and filter by projectId on frontend
            const response = await authenticatedApi.get(`${API_URL}/tasks`);
            const allTasks = response.data;
            
            // Filter tasks by projectId on the frontend
            const projectTasks = allTasks.filter(task => task.projectId === projectId);
            return projectTasks;
        } catch (error) {
            // If endpoint doesn't exist (404), return empty array
            if (error.response?.status === 404) {
                console.log('Tasks endpoint not found, returning empty array');
                return [];
            }
            throw error.response?.data || error.message;
        }
    },

    // Update task status
    updateTaskStatus: async (taskId, status) => {
        try {
            const response = await authenticatedApi.patch(`${API_URL}/tasks/${taskId}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add comment to task
    addComment: async (taskId, comment) => {
        try {
            const response = await authenticatedApi.post(`${API_URL}/tasks/${taskId}/comments`, { comment });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 