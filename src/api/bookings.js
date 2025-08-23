import api from './axios';

export const bookingsAPI = {
  // Get all bookings (filtered by user role)
  getBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/bookings${queryString ? `?${queryString}` : ''}`);
  },

  // Get single booking by ID
  getBooking: async (id) => {
    return await api.get(`/bookings/${id}`);
  },

  // Create new booking
  createBooking: async (bookingData) => {
    return await api.post('/bookings', bookingData);
  },

  // Update booking status (admin/staff only)
  updateBooking: async (id, updateData) => {
    return await api.put(`/bookings/${id}`, updateData);
  },

  // Cancel booking
  cancelBooking: async (id) => {
    return await api.delete(`/bookings/${id}`);
  },

  // Get customer's bookings
  getMyBookings: async (status = null) => {
    const params = status ? { status } : {};
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/bookings${queryString ? `?${queryString}` : ''}`);
  },

  // Get pending bookings (admin/staff)
  getPendingBookings: async () => {
    return await api.get('/bookings?status=pending');
  },

  // Approve booking (admin/staff)
  approveBooking: async (id, notes = '') => {
    return await api.put(`/bookings/${id}`, { status: 'approved', notes });
  },

  // Reject booking (admin/staff)
  rejectBooking: async (id, notes = '') => {
    return await api.put(`/bookings/${id}`, { status: 'rejected', notes });
  },

  // Start booking (admin/staff)
  startBooking: async (id, notes = '') => {
    return await api.put(`/bookings/${id}`, { status: 'active', notes });
  },

  // Complete booking (admin/staff)
  completeBooking: async (id, notes = '') => {
    return await api.put(`/bookings/${id}`, { status: 'completed', notes });
  },
};
