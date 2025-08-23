import api from './axios';

export const activitiesAPI = {
    // Get activities
    getActivities: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/activities${queryString ? `?${queryString}` : ''}`);
    },

    // Get activity by ID
    getActivity: async (id) => {
        return await api.get(`/activities/${id}`);
    },

    // Get activities for specific entity
    getEntityActivities: async (entity, entityId) => {
        return await api.get(`/activities/entity/${entity}/${entityId}`);
    },

    // Get user activities
    getUserActivities: async (userId) => {
        return await api.get(`/activities/user/${userId}`);
    },
};
