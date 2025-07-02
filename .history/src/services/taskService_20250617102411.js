import api from '../utils/api';

export const taskService = {
    getAllTasks: async () => {
        const response = await api.get('/api/tasks');
        return response.data;
    },

    getTaskById: async (id) => {
        const response = await api.get(`/api/tasks/${id}`);
        return response.data;
    },

    createTask: async (task) => {
        // Ensure required fields are present
        if (!task.title) {
            throw new Error('Title is mandatory');
        }
        if (!task.assignedTo) {
            throw new Error('Assigned user is required');
        }
        
        const response = await api.post('/api/tasks', task);
        return response.data;
    },

    updateTask: async (id, task) => {
        const response = await api.put(`/api/tasks/${id}`, task);
        return response.data;
    },

    deleteTask: async (id) => {
        await api.delete(`/api/tasks/${id}`);
    },

    getTasksByProjectId: async (projectId) => {
        const response = await api.get(`/api/tasks?projectId=${projectId}`);
        return response.data;
    }
}; 