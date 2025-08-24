// Export all API modules for easy importing
export { authAPI } from './auth';
export { vehiclesAPI } from './vehicles';
export { bookingsAPI } from './bookings';
export { dashboardAPI } from './dashboard';
export { activitiesAPI } from './activities';
export { notificationsAPI } from './notifications';
export { reportsAPI } from './reports';
export { maintenanceAPI } from './maintenance';

// Export axios instance for custom requests
export { default as api } from './axios';
