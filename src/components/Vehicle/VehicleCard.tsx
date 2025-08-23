import React from 'react';
import { Vehicle } from '../../types';
import { Edit, Trash2, Car, Users, Fuel, Calendar, DollarSign } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode: 'grid' | 'list';
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicleId: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, viewMode, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'rented': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-6">
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-24 h-16 object-cover rounded-lg"
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-sm text-gray-600">{vehicle.year} • {vehicle.licensePlate}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">${vehicle.rentalPrice}</div>
                  <div className="text-sm text-gray-500">per day</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Car className="h-4 w-4" />
                <span>{vehicle.type}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{vehicle.seats} seats</span>
              </div>
              <div className="flex items-center space-x-1">
                <Fuel className="h-4 w-4" />
                <span>{vehicle.fuelType}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium">{vehicle.transmission}</span>
              </div>
            </div>
          </div>
          
          {(onEdit || onDelete) && (
            <div className="flex items-center space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(vehicle)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(vehicle.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(vehicle.status)}`}>
            {vehicle.status}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {vehicle.make} {vehicle.model}
          </h3>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">${vehicle.rentalPrice}</div>
            <div className="text-xs text-gray-500">per day</div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{vehicle.year} • {vehicle.licensePlate}</p>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Car className="h-4 w-4" />
              <span>{vehicle.type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{vehicle.seats} seats</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Fuel className="h-4 w-4" />
              <span>{vehicle.fuelType}</span>
            </div>
            <span className="text-xs font-medium">{vehicle.transmission}</span>
          </div>
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-gray-100">
            {onEdit && (
              <button
                onClick={() => onEdit(vehicle)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(vehicle.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;