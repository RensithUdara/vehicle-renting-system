import React, { useState, useEffect } from 'react';
import { vehiclesAPI } from '../api';

const VehicleListExample = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });

  // Fetch vehicles when component mounts or filters change
  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Filter out empty values
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );

      const response = await vehiclesAPI.getVehicles(activeFilters);
      
      if (response.success) {
        setVehicles(response.data.data || response.data); // Handle paginated or direct data
      } else {
        setError('Failed to fetch vehicles');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  if (loading) {
    return <div className="text-center py-4">Loading vehicles...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={fetchVehicles}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Types</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Sports">Sports</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by make or model..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={vehicle.image_url || '/placeholder-car.jpg'}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-gray-600">{vehicle.year} • {vehicle.type}</p>
                
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${vehicle.rental_price}/day
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    vehicle.status === 'available' 
                      ? 'bg-green-100 text-green-800'
                      : vehicle.status === 'rented'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  <p>{vehicle.seats} seats • {vehicle.transmission} • {vehicle.fuel_type}</p>
                  <p>License: {vehicle.license_plate}</p>
                </div>

                <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400">
                  {vehicle.status === 'available' ? 'Book Now' : 'Not Available'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No vehicles found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleListExample;
