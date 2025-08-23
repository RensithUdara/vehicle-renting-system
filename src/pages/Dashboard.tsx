import React from 'react';
import { useAuth } from '../context/AuthContext';
import { mockVehicles, mockBookings } from '../data/mockData';
import { Car, Calendar, Users, DollarSign, TrendingUp, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();

  const stats = {
    totalVehicles: mockVehicles.length,
    availableVehicles: mockVehicles.filter(v => v.status === 'available').length,
    activeBookings: mockBookings.filter(b => b.status === 'active').length,
    totalRevenue: mockBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0)
  };

  const recentBookings = mockBookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <div className="text-sm text-gray-600 capitalize">
          {user?.role} Dashboard
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
            </div>
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableVehicles}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Booking #{booking.id}</p>
                    <p className="text-sm text-gray-600">Vehicle ID: {booking.vehicleId}</p>
                    <p className="text-sm text-gray-600">${booking.totalAmount}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Vehicle Status Overview</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {['available', 'rented', 'maintenance'].map((status) => {
                const count = mockVehicles.filter(v => v.status === status).length;
                const percentage = (count / mockVehicles.length) * 100;
                
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {status === 'maintenance' ? 'Under Maintenance' : status}
                      </span>
                      <span className="text-sm text-gray-600">{count} vehicles</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          status === 'available' ? 'bg-green-600' :
                          status === 'rented' ? 'bg-blue-600' : 'bg-orange-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hasRole(['admin', 'staff']) && (
              <>
                <a
                  href="/vehicles"
                  className="block p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <Car className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Manage Vehicles</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove vehicles</p>
                </a>
                <a
                  href="/bookings"
                  className="block p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <Calendar className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">View Bookings</h3>
                  <p className="text-sm text-gray-600">Manage rental bookings</p>
                </a>
              </>
            )}
            
            {hasRole(['customer']) && (
              <>
                <a
                  href="/browse"
                  className="block p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <Car className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Browse Vehicles</h3>
                  <p className="text-sm text-gray-600">Find your perfect rental</p>
                </a>
                <a
                  href="/my-bookings"
                  className="block p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <Calendar className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">My Bookings</h3>
                  <p className="text-sm text-gray-600">View your rental history</p>
                </a>
              </>
            )}
            
            {hasRole(['admin']) && (
              <a
                href="/reports"
                className="block p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
                <h3 className="font-medium text-gray-900">Reports</h3>
                <p className="text-sm text-gray-600">View analytics and reports</p>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;