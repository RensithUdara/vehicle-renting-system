import React, { useState } from 'react';
import { mockVehicles } from '../../data/mockData';
import { Vehicle } from '../../types';
import VehicleCard from '../../components/Vehicle/VehicleCard';
import BookingForm from '../../components/Booking/BookingForm';
import { Search, Filter, Grid, List, Calendar } from 'lucide-react';

const BrowseVehicles: React.FC = () => {
  const [availableVehicles] = useState<Vehicle[]>(
    mockVehicles.filter(v => v.status === 'available')
  );
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(availableVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Apply filters
  React.useEffect(() => {
    let filtered = availableVehicles.filter(vehicle => {
      const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || vehicle.type.toLowerCase().includes(typeFilter.toLowerCase());
      const matchesPrice = vehicle.rentalPrice >= priceRange.min && vehicle.rentalPrice <= priceRange.max;
      
      return matchesSearch && matchesType && matchesPrice;
    });
    
    setFilteredVehicles(filtered);
    setCurrentPage(1);
  }, [searchTerm, typeFilter, priceRange, availableVehicles]);

  const handleBookVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (bookingData: any) => {
    // In a real app, this would submit to an API
    console.log('Booking submitted:', bookingData);
    alert('Booking request submitted successfully! You will receive a confirmation email shortly.');
    setShowBookingForm(false);
    setSelectedVehicle(null);
  };

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Browse Vehicles</h1>
        <div className="text-sm text-gray-600">
          {filteredVehicles.length} vehicles available
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="sports">Sports</option>
            <option value="electric">Electric</option>
            <option value="luxury">Luxury</option>
          </select>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Price Range: $0 - ${priceRange.max}
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle Grid/List */}
      <div className={viewMode === 'grid' ? 
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 
        'space-y-4'
      }>
        {paginatedVehicles.map((vehicle) => (
          <div key={vehicle.id} className="group">
            <VehicleCard
              vehicle={vehicle}
              viewMode={viewMode}
            />
            <div className="mt-3">
              <button
                onClick={() => handleBookVehicle(vehicle)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {paginatedVehicles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm rounded-lg ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedVehicle && (
        <BookingForm
          vehicle={selectedVehicle}
          onSubmit={handleBookingSubmit}
          onCancel={() => {
            setShowBookingForm(false);
            setSelectedVehicle(null);
          }}
        />
      )}
    </div>
  );
};

export default BrowseVehicles;