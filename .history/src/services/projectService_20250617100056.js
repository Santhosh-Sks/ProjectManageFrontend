import api from '../utils/api';

export const projectService = {
    getAllProjects: async () => {
        const response = await api.get('/projects');
        return response.data;
    },

    getProjectById: async (id) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    createProject: async (project) => {
        const response = await api.post('/projects', project);
        return response.data;
    },

    updateProject: async (id, project) => {
        const response = await api.put(`/projects/${id}`, project);
        return response.data;
    },

    deleteProject: async (id) => {
        await api.delete(`/projects/${id}`);
    },

    addMemberToProject: async (projectId, memberId) => {
        const response = await api.post(`/projects/${projectId}/add-member?memberId=${memberId}`);
        return response.data;
    },

    addTaskToProject: async (projectId, taskId) => {
        const response = await api.post(`/projects/${projectId}/add-task?taskId=${taskId}`);
        return response.data;
    }
}; 