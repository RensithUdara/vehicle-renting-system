export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  rentalPrice: number;
  status: 'available' | 'rented' | 'maintenance';
  licensePlate: string;
  color: string;
  fuelType: string;
  transmission: string;
  seats: number;
  imageUrl: string;
  maintenanceHistory: MaintenanceRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  performedBy: string;
}

export interface Booking {
  id: string;
  customerId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  customer?: User;
  vehicle?: Vehicle;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
  user?: User;
}

export interface Report {
  id: string;
  title: string;
  type: 'revenue' | 'utilization' | 'booking-trends';
  dateRange: {
    start: string;
    end: string;
  };
  data: any;
  generatedAt: string;
  generatedBy: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}