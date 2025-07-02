import api from '../utils/api';

export const taskService = {
    getAllTasks: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },

    getTaskById: async (id) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    createTask: async (task) => {
        const response = await api.post('/tasks', task);
        return response.data;
    },

    updateTask: async (id, task) => {
        const response = await api.put(`/tasks/${id}`, task);
        return response.data;
    },

    deleteTask: async (id) => {
        await api.delete(`/tasks/${id}`);
    },

    getTasksByProjectId: async (projectId) => {
        const response = await api.get(`/tasks?projectId=${projectId}`);
        return response.data;
    }
}; 