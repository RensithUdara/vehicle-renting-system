import { Vehicle, Booking, MaintenanceRecord } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    type: 'Sedan',
    rentalPrice: 45.00,
    status: 'available',
    licensePlate: 'ABC-1234',
    color: 'White',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    seats: 5,
    imageUrl: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
    maintenanceHistory: [
      {
        id: '1',
        vehicleId: '1',
        date: '2024-01-15T10:00:00Z',
        type: 'Oil Change',
        description: 'Regular maintenance oil change',
        cost: 45.00,
        performedBy: 'Mike Johnson'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    year: 2022,
    type: 'SUV',
    rentalPrice: 55.00,
    status: 'rented',
    licensePlate: 'XYZ-5678',
    color: 'Blue',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    imageUrl: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
    maintenanceHistory: [],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z'
  },
  {
    id: '3',
    make: 'Ford',
    model: 'Mustang',
    year: 2024,
    type: 'Sports',
    rentalPrice: 85.00,
    status: 'available',
    licensePlate: 'SPT-9999',
    color: 'Red',
    fuelType: 'Gasoline',
    transmission: 'Manual',
    seats: 4,
    imageUrl: 'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg',
    maintenanceHistory: [],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    type: 'Electric',
    rentalPrice: 75.00,
    status: 'maintenance',
    licensePlate: 'ELC-2024',
    color: 'Black',
    fuelType: 'Electric',
    transmission: 'Automatic',
    seats: 5,
    imageUrl: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
    maintenanceHistory: [
      {
        id: '2',
        vehicleId: '4',
        date: '2024-01-25T09:00:00Z',
        type: 'Software Update',
        description: 'Tesla software update and diagnostic check',
        cost: 0.00,
        performedBy: 'Tesla Service'
      }
    ],
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-25T11:00:00Z'
  },
  {
    id: '5',
    make: 'BMW',
    model: 'X5',
    year: 2023,
    type: 'Luxury SUV',
    rentalPrice: 95.00,
    status: 'available',
    licensePlate: 'LUX-7777',
    color: 'Silver',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 7,
    imageUrl: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
    maintenanceHistory: [],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    customerId: '3',
    vehicleId: '2',
    startDate: '2024-01-20T09:00:00Z',
    endDate: '2024-01-25T09:00:00Z',
    totalAmount: 275.00,
    status: 'active',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
    notes: 'Business trip to downtown'
  },
  {
    id: '2',
    customerId: '3',
    vehicleId: '1',
    startDate: '2024-02-01T10:00:00Z',
    endDate: '2024-02-03T10:00:00Z',
    totalAmount: 90.00,
    status: 'pending',
    createdAt: '2024-01-28T14:30:00Z',
    updatedAt: '2024-01-28T14:30:00Z',
    notes: 'Weekend getaway'
  },
  {
    id: '3',
    customerId: '3',
    vehicleId: '3',
    startDate: '2024-01-10T12:00:00Z',
    endDate: '2024-01-12T12:00:00Z',
    totalAmount: 170.00,
    status: 'completed',
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-12T12:30:00Z',
    notes: 'Special occasion rental'
  }
];