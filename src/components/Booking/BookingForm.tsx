import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { X, Calendar, DollarSign, Clock } from 'lucide-react';
import { addDays, differenceInDays, format } from 'date-fns';

interface BookingFormProps {
  vehicle: Vehicle;
  onSubmit: (bookingData: any) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ vehicle, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    notes: ''
  });

  const calculateTotal = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.max(1, differenceInDays(end, start));
    return days * vehicle.rentalPrice;
  };

  const getDays = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.max(1, differenceInDays(end, start));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData = {
      vehicleId: vehicle.id,
      customerId: user?.id,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      totalAmount: calculateTotal(),
      status: 'pending',
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(bookingData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Book Vehicle</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Vehicle Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-20 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-gray-600">{vehicle.year} • {vehicle.type}</p>
              <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-blue-600">${vehicle.rentalPrice}</div>
              <div className="text-sm text-gray-500">per day</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || format(new Date(), 'yyyy-MM-dd')}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Rental Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Rental Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span>Duration</span>
                  </div>
                  <span className="font-medium">{getDays()} day{getDays() !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <span>Daily Rate</span>
                  </div>
                  <span>${vehicle.rentalPrice}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 flex items-center justify-between">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-lg font-bold text-blue-600">${calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special requirements or notes..."
              />
            </div>

            {/* Customer Info */}
            {user && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{user.phone}</span>
                    </div>
                  )}
                  {user.address && (
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <span className="ml-2 font-medium">{user.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Booking Request
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a booking request. Your reservation will be confirmed once approved by our team. 
              You will receive an email notification with the booking status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;