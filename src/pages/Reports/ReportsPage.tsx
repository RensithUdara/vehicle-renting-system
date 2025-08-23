import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockVehicles, mockBookings } from '../../data/mockData';
import { TrendingUp, DollarSign, Calendar, FileText, Download, Car, Users, Activity } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const ReportsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [reportType, setReportType] = useState('overview');

  if (!hasRole(['admin'])) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <FileText className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to view reports</p>
      </div>
    );
  }

  // Calculate date range based on selected period
  const getDateRange = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'thisMonth':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'lastMonth':
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case 'last3Months':
        return { start: subMonths(startOfMonth(now), 3), end: endOfMonth(now) };
      case 'thisYear':
        return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear(), 11, 31) };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const dateRange = getDateRange();

  // Filter bookings by date range
  const filteredBookings = mockBookings.filter(booking => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= dateRange.start && bookingDate <= dateRange.end;
  });

  // Calculate metrics
  const metrics = {
    totalRevenue: filteredBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0),
    totalBookings: filteredBookings.length,
    completedBookings: filteredBookings.filter(b => b.status === 'completed').length,
    cancelledBookings: filteredBookings.filter(b => b.status === 'cancelled').length,
    activeBookings: filteredBookings.filter(b => b.status === 'active').length,
    averageBookingValue: filteredBookings.length > 0 
      ? filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0) / filteredBookings.length 
      : 0,
    vehicleUtilization: mockVehicles.filter(v => v.status === 'rented').length / mockVehicles.length * 100
  };

  // Vehicle performance data
  const vehiclePerformance = mockVehicles.map(vehicle => {
    const vehicleBookings = filteredBookings.filter(b => b.vehicleId === vehicle.id);
    const revenue = vehicleBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    
    return {
      vehicle,
      bookings: vehicleBookings.length,
      revenue,
      utilization: vehicleBookings.length > 0 ? (vehicleBookings.length / 30 * 100) : 0
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Booking trends by status
  const bookingsByStatus = {
    pending: filteredBookings.filter(b => b.status === 'pending').length,
    approved: filteredBookings.filter(b => b.status === 'approved').length,
    active: filteredBookings.filter(b => b.status === 'active').length,
    completed: filteredBookings.filter(b => b.status === 'completed').length,
    cancelled: filteredBookings.filter(b => b.status === 'cancelled').length,
    rejected: filteredBookings.filter(b => b.status === 'rejected').length,
  };

  const handleExportPDF = () => {
    alert('PDF export functionality would be implemented here using a library like jsPDF');
  };

  const handleExportExcel = () => {
    alert('Excel export functionality would be implemented here using a library like xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="thisYear">This Year</option>
          </select>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-800">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">
            Report Period: {format(dateRange.start, 'MMM dd, yyyy')} - {format(dateRange.end, 'MMM dd, yyyy')}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Booking Value</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.averageBookingValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vehicle Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.vehicleUtilization.toFixed(1)}%</p>
            </div>
            <Activity className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Booking Status Breakdown</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(bookingsByStatus).map(([status, count]) => {
                const percentage = metrics.totalBookings > 0 ? (count / metrics.totalBookings) * 100 : 0;
                const colors = {
                  pending: 'bg-yellow-500',
                  approved: 'bg-green-500',
                  active: 'bg-blue-500',
                  completed: 'bg-purple-500',
                  cancelled: 'bg-red-500',
                  rejected: 'bg-gray-500'
                };
                
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 capitalize">{status}</span>
                      <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[status as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Performing Vehicles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Vehicles</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {vehiclePerformance.slice(0, 5).map((item, index) => (
                <div key={item.vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.vehicle.make} {item.vehicle.model}
                      </p>
                      <p className="text-sm text-gray-600">{item.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${item.revenue}</p>
                    <p className="text-sm text-gray-600">{item.utilization.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Detailed Metrics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Booking Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Bookings:</span>
                  <span className="font-medium">{metrics.completedBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Bookings:</span>
                  <span className="font-medium">{metrics.activeBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled Bookings:</span>
                  <span className="font-medium">{metrics.cancelledBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Rate:</span>
                  <span className="font-medium">
                    {metrics.totalBookings > 0 ? 
                      ((metrics.completedBookings / metrics.totalBookings) * 100).toFixed(1) : 0
                    }%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Fleet Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Vehicles:</span>
                  <span className="font-medium">{mockVehicles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium">{mockVehicles.filter(v => v.status === 'available').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rented:</span>
                  <span className="font-medium">{mockVehicles.filter(v => v.status === 'rented').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance:</span>
                  <span className="font-medium">{mockVehicles.filter(v => v.status === 'maintenance').length}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Revenue Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-medium">${metrics.totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg per Booking:</span>
                  <span className="font-medium">${metrics.averageBookingValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue per Vehicle:</span>
                  <span className="font-medium">
                    ${mockVehicles.length > 0 ? (metrics.totalRevenue / mockVehicles.length).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Utilization Rate:</span>
                  <span className="font-medium">{metrics.vehicleUtilization.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;