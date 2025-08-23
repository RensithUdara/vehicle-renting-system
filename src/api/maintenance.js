import api from './axios';

export const maintenanceAPI = {
    // Get maintenance records
    getMaintenanceRecords: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/maintenance${queryString ? `?${queryString}` : ''}`);
    },

    // Get maintenance record by ID
    getMaintenanceRecord: async (id) => {
        return await api.get(`/maintenance/${id}`);
    },

    // Create maintenance record
    createMaintenanceRecord: async (maintenanceData) => {
        return await api.post('/maintenance', maintenanceData);
    },

    // Update maintenance record
    updateMaintenanceRecord: async (id, maintenanceData) => {
        return await api.put(`/maintenance/${id}`, maintenanceData);
    },

    // Delete maintenance record
    deleteMaintenanceRecord: async (id) => {
        return await api.delete(`/maintenance/${id}`);
    },

    // Get maintenance history for specific vehicle
    getVehicleMaintenanceHistory: async (vehicleId) => {
        return await api.get(`/maintenance/vehicle/${vehicleId}`);
    },
};
