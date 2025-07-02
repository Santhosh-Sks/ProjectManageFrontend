import api from '../utils/api';

export const projectService = {
    getAllProjects: async () => {
        const response = await api.get('/api/projects');
        return response.data;
    },

    getProjectById: async (id) => {
        const response = await api.get(`/api/projects/${id}`);
        return response.data;
    },

    createProject: async (project) => {
        const response = await api.post('/api/projects', project);
        return response.data;
    },

    updateProject: async (id, project) => {
        const response = await api.put(`/api/projects/${id}`, project);
        return response.data;
    },

    deleteProject: async (id) => {
        await api.delete(`/api/projects/${id}`);
    },

    addMemberToProject: async (projectId, memberEmail) => {
        const response = await api.post(`/api/projects/${projectId}/add-member?memberId=${memberEmail}`);
        return response.data;
    },

    addTaskToProject: async (projectId, taskId) => {
        const response = await api.post(`/api/projects/${projectId}/add-task?taskId=${taskId}`);
        return response.data;
    },

    getProjectsByUser: async (userId) => {
        const response = await api.get(`/api/projects/user/${userId}`);
        return response.data;
    }
}; 