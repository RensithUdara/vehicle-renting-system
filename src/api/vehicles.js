import api from './axios';

export const vehiclesAPI = {
  // Get all vehicles with optional filters
  getVehicles: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/vehicles${queryString ? `?${queryString}` : ''}`);
  },

  // Get single vehicle by ID
  getVehicle: async (id) => {
    return await api.get(`/vehicles/${id}`);
  },

  // Create new vehicle (admin/staff only)
  createVehicle: async (vehicleData) => {
    return await api.post('/vehicles', vehicleData);
  },

  // Update vehicle (admin/staff only)
  updateVehicle: async (id, vehicleData) => {
    return await api.put(`/vehicles/${id}`, vehicleData);
  },

  // Delete vehicle (admin/staff only)
  deleteVehicle: async (id) => {
    return await api.delete(`/vehicles/${id}`);
  },

  // Get available vehicles for booking
  getAvailableVehicles: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/vehicles-available${queryString ? `?${queryString}` : ''}`);
  },

  // Search vehicles
  searchVehicles: async (searchTerm, filters = {}) => {
    const params = { search: searchTerm, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/vehicles?${queryString}`);
  },
};
