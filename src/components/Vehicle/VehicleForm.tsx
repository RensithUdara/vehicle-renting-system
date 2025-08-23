import React, { useState, useEffect } from 'react';
import { Vehicle } from '../../types';
import { X, Upload } from 'lucide-react';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSubmit: (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'maintenanceHistory'>) => void;
  onCancel: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: '',
    rentalPrice: 0,
    status: 'available' as const,
    licensePlate: '',
    color: '',
    fuelType: '',
    transmission: '',
    seats: 5,
    imageUrl: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        type: vehicle.type,
        rentalPrice: vehicle.rentalPrice,
        status: vehicle.status,
        licensePlate: vehicle.licensePlate,
        color: vehicle.color,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        seats: vehicle.seats,
        imageUrl: vehicle.imageUrl
      });
    }
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'seats' || name === 'rentalPrice' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const defaultImages = [
    'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
    'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
    'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg',
    'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
    'https://images.pexels.com/photos/136872/pexels-photo-136872.jpeg'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make *
              </label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Toyota"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Camry"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Sports">Sports</option>
                <option value="Electric">Electric</option>
                <option value="Luxury SUV">Luxury SUV</option>
                <option value="Compact">Compact</option>
                <option value="Pickup">Pickup Truck</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Plate *
              </label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., ABC-1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., White"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type *
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Fuel Type</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmission *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seats *
              </label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                required
                min="2"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rental Price (per day) *
              </label>
              <input
                type="number"
                name="rentalPrice"
                value={formData.rentalPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Image
            </label>
            <div className="space-y-3">
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter image URL"
              />
              
              <div className="text-sm text-gray-600">
                Or choose from default images:
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {defaultImages.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: url }))}
                    className={`relative h-16 w-full border-2 rounded-lg overflow-hidden ${
                      formData.imageUrl === url ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              
              {formData.imageUrl && (
                <div className="mt-3">
                  <div className="text-sm text-gray-600 mb-2">Preview:</div>
                  <img
                    src={formData.imageUrl}
                    alt="Vehicle preview"
                    className="h-32 w-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;