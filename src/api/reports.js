import api from './axios';

export const reportsAPI = {
    // Get all reports
    getReports: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/reports${queryString ? `?${queryString}` : ''}`);
    },

    // Get report by ID
    getReport: async (id) => {
        return await api.get(`/reports/${id}`);
    },

    // Generate and save report
    generateReport: async (reportData) => {
        return await api.post('/reports', reportData);
    },

    // Delete report
    deleteReport: async (id) => {
        return await api.delete(`/reports/${id}`);
    },

    // Generate revenue report (without saving)
    generateRevenueReport: async (startDate, endDate) => {
        return await api.post('/reports/revenue', { start_date: startDate, end_date: endDate });
    },

    // Generate utilization report (without saving)
    generateUtilizationReport: async (startDate, endDate) => {
        return await api.post('/reports/utilization', { start_date: startDate, end_date: endDate });
    },

    // Generate booking trends report (without saving)
    generateBookingTrendsReport: async (startDate, endDate) => {
        return await api.post('/reports/booking-trends', { start_date: startDate, end_date: endDate });
    },
};
