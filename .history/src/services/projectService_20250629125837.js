import axios from 'axios';

const API_URL = 'http://localhost:8080/api/projects';

function getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const projectService = {
    getAllProjects: async () => {
        const response = await axios.get(API_URL, { headers: getAuthHeader() });
        return response.data;
    },

    getProjectById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    createProject: async (projectData) => {
        const response = await axios.post(API_URL, projectData, { headers: getAuthHeader() });
        return response.data;
    },

    updateProject: async (id, projectData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, projectData, { headers: getAuthHeader() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteProject: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    addMemberToProject: async (projectId, email) => {
        try {
            const response = await axios.post(`${API_URL}/${projectId}/add-member?memberId=${encodeURIComponent(email)}`, {}, { headers: getAuthHeader() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    addTaskToProject: async (projectId, taskData) => {
        try {
            const response = await axios.post(`${API_URL}/${projectId}/tasks`, taskData, { headers: getAuthHeader() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getProjectsByUser: async (userId) => {
        const response = await axios.get(`${API_URL}/user/${userId}`, { headers: getAuthHeader() });
        return response.data;
    }
}; 