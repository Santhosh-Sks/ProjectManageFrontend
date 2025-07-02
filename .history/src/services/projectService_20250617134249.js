import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const projectService = {
    getAllProjects: async () => {
        try {
            const response = await axios.get(`${API_URL}/projects`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getProjectById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/projects/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    createProject: async (projectData) => {
        try {
            const response = await axios.post(`${API_URL}/projects`, projectData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateProject: async (id, projectData) => {
        try {
            const response = await axios.put(`${API_URL}/projects/${id}`, projectData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteProject: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/projects/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    addMemberToProject: async (projectId, email) => {
        try {
            const response = await axios.post(`${API_URL}/projects/${projectId}/members`, { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    addTaskToProject: async (projectId, taskData) => {
        try {
            const response = await axios.post(`${API_URL}/projects/${projectId}/tasks`, taskData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getProjectsByUser: async (userId) => {
        const response = await axios.get(`${API_URL}/projects/user/${userId}`);
        return response.data;
    }
}; 