import api from './axios';

export const dashboardAPI = {
  // Get dashboard data (role-specific)
  getDashboardData: async () => {
    return await api.get('/dashboard');
  },

  // Get system statistics (admin/staff only)
  getStats: async () => {
    return await api.get('/stats');
  },
};
