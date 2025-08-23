import api from './axios';

export const notificationsAPI = {
    // Get user notifications
    getNotifications: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/notifications${queryString ? `?${queryString}` : ''}`);
    },

    // Get notification by ID
    getNotification: async (id) => {
        return await api.get(`/notifications/${id}`);
    },

    // Mark notification as read
    markAsRead: async (id) => {
        return await api.patch(`/notifications/${id}/read`);
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        return await api.post('/notifications/mark-all-read');
    },

    // Get unread notifications count
    getUnreadCount: async () => {
        return await api.get('/notifications/unread/count');
    },

    // Delete notification
    deleteNotification: async (id) => {
        return await api.delete(`/notifications/${id}`);
    },

    // Create notification (admin/staff only)
    createNotification: async (notificationData) => {
        return await api.post('/notifications', notificationData);
    },
};
