import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockBookings, mockVehicles } from '../../data/mockData';
import { Booking } from '../../types';
import { Search, Filter, Calendar, User, Car, DollarSign, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';

const BookingList: React.FC = () => {
  const { hasRole, logActivity, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings.map(booking => ({
    ...booking,
    customer: { id: '3', name: 'Bob Customer', email: 'customer@rental.com', role: 'customer' as const, createdAt: '2024-01-01' },
    vehicle: mockVehicles.find(v => v.id === booking.vehicleId)
  })));
  
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(bookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter bookings based on user role
  const userBookings = hasRole(['customer']) 
    ? bookings.filter(b => b.customerId === user?.id)
    : bookings;

  React.useEffect(() => {
    let filtered = userBookings.filter(booking => {
      const matchesSearch = booking.id.includes(searchTerm) ||
                           booking.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.vehicle?.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, userBookings]);

  const handleUpdateStatus = (bookingId: string, newStatus: Booking['status']) => {
    const updatedBookings = bookings.map(booking => {
      if (booking.id === bookingId) {
        const updatedBooking = { ...booking, status: newStatus, updatedAt: new Date().toISOString() };
        logActivity('update', 'booking', bookingId, `Updated booking status to ${newStatus}`);
        return updatedBooking;
      }
      return booking;
    });
    
    setBookings(updatedBookings);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'rejected': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {hasRole(['customer']) ? 'My Bookings' : 'Booking Management'}
        </h1>
        <div className="text-sm text-gray-600">
          Total: {filteredBookings.length} bookings
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {paginatedBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Booking Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Booking #{booking.id}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{booking.customer?.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4" />
                    <span>{booking.vehicle?.make} {booking.vehicle?.model}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">${booking.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              {booking.vehicle && (
                <div className="flex items-center space-x-4">
                  <img
                    src={booking.vehicle.imageUrl}
                    alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {booking.vehicle.make} {booking.vehicle.model}
                    </h4>
                    <p className="text-sm text-gray-600">{booking.vehicle.year}</p>
                    <p className="text-sm text-gray-600">{booking.vehicle.licensePlate}</p>
                    <p className="text-xs text-gray-500">${booking.vehicle.rentalPrice}/day</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2">
                {hasRole(['admin', 'staff']) && booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'approved')}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {hasRole(['admin', 'staff']) && booking.status === 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(booking.id, 'active')}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Start Rental</span>
                  </button>
                )}

                {hasRole(['admin', 'staff']) && booking.status === 'active' && (
                  <button
                    onClick={() => handleUpdateStatus(booking.id, 'completed')}
                    className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Complete</span>
                  </button>
                )}

                {hasRole(['customer']) && booking.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                    className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                )}

                <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Notes:</span> {booking.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {paginatedBookings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
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
    </div>
  );
};

export default BookingList;