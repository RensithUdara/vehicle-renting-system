<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use App\Models\Vehicle;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $data = [];

        if ($user->role === 'admin' || $user->role === 'staff') {
            $data = $this->getAdminDashboardData();
        } else {
            $data = $this->getCustomerDashboardData($user);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    private function getAdminDashboardData()
    {
        // Get counts
        $totalVehicles = Vehicle::count();
        $availableVehicles = Vehicle::where('status', 'available')->count();
        $rentedVehicles = Vehicle::where('status', 'rented')->count();
        $maintenanceVehicles = Vehicle::where('status', 'maintenance')->count();

        $totalUsers = User::where('role', 'customer')->count();
        $totalBookings = Booking::count();
        $pendingBookings = Booking::where('status', 'pending')->count();
        $activeBookings = Booking::where('status', 'active')->count();

        // Revenue this month
        $monthlyRevenue = Booking::whereMonth('created_at', now()->month)
                                ->whereYear('created_at', now()->year)
                                ->whereIn('status', ['completed', 'active'])
                                ->sum('total_amount');

        // Recent bookings
        $recentBookings = Booking::with(['customer', 'vehicle'])
                                ->orderBy('created_at', 'desc')
                                ->limit(5)
                                ->get();

        // Recent activities
        $recentActivities = Activity::with('user')
                                  ->orderBy('timestamp', 'desc')
                                  ->limit(10)
                                  ->get();

        // Vehicle utilization
        $vehicleTypes = Vehicle::selectRaw('type, COUNT(*) as count')
                              ->groupBy('type')
                              ->get();

        // Booking trends (last 7 days)
        $bookingTrends = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $count = Booking::whereDate('created_at', $date)->count();
            $bookingTrends[] = [
                'date' => $date,
                'count' => $count
            ];
        }

        return [
            'stats' => [
                'total_vehicles' => $totalVehicles,
                'available_vehicles' => $availableVehicles,
                'rented_vehicles' => $rentedVehicles,
                'maintenance_vehicles' => $maintenanceVehicles,
                'total_users' => $totalUsers,
                'total_bookings' => $totalBookings,
                'pending_bookings' => $pendingBookings,
                'active_bookings' => $activeBookings,
                'monthly_revenue' => $monthlyRevenue,
            ],
            'recent_bookings' => $recentBookings,
            'recent_activities' => $recentActivities,
            'vehicle_types' => $vehicleTypes,
            'booking_trends' => $bookingTrends,
        ];
    }

    private function getCustomerDashboardData($user)
    {
        // Customer's bookings
        $totalBookings = Booking::where('customer_id', $user->id)->count();
        $activeBookings = Booking::where('customer_id', $user->id)
                                ->where('status', 'active')
                                ->count();
        $pendingBookings = Booking::where('customer_id', $user->id)
                                ->where('status', 'pending')
                                ->count();
        $completedBookings = Booking::where('customer_id', $user->id)
                                   ->where('status', 'completed')
                                   ->count();

        // Recent bookings
        $recentBookings = Booking::with('vehicle')
                                ->where('customer_id', $user->id)
                                ->orderBy('created_at', 'desc')
                                ->limit(5)
                                ->get();

        // Current active booking
        $currentBooking = Booking::with('vehicle')
                                ->where('customer_id', $user->id)
                                ->where('status', 'active')
                                ->where('start_date', '<=', now())
                                ->where('end_date', '>=', now())
                                ->first();

        // Available vehicles
        $availableVehicles = Vehicle::available()->limit(6)->get();

        // Customer's activities
        $recentActivities = Activity::where('user_id', $user->id)
                                  ->orderBy('timestamp', 'desc')
                                  ->limit(5)
                                  ->get();

        return [
            'stats' => [
                'total_bookings' => $totalBookings,
                'active_bookings' => $activeBookings,
                'pending_bookings' => $pendingBookings,
                'completed_bookings' => $completedBookings,
            ],
            'recent_bookings' => $recentBookings,
            'current_booking' => $currentBooking,
            'available_vehicles' => $availableVehicles,
            'recent_activities' => $recentActivities,
        ];
    }

    public function getStats(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'customer') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'vehicles' => [
                'total' => Vehicle::count(),
                'available' => Vehicle::where('status', 'available')->count(),
                'rented' => Vehicle::where('status', 'rented')->count(),
                'maintenance' => Vehicle::where('status', 'maintenance')->count(),
            ],
            'bookings' => [
                'total' => Booking::count(),
                'pending' => Booking::where('status', 'pending')->count(),
                'approved' => Booking::where('status', 'approved')->count(),
                'active' => Booking::where('status', 'active')->count(),
                'completed' => Booking::where('status', 'completed')->count(),
                'cancelled' => Booking::where('status', 'cancelled')->count(),
            ],
            'users' => [
                'total' => User::count(),
                'customers' => User::where('role', 'customer')->count(),
                'staff' => User::where('role', 'staff')->count(),
                'admins' => User::where('role', 'admin')->count(),
            ],
            'revenue' => [
                'total' => Booking::whereIn('status', ['completed', 'active'])->sum('total_amount'),
                'this_month' => Booking::whereMonth('created_at', now()->month)
                                     ->whereYear('created_at', now()->year)
                                     ->whereIn('status', ['completed', 'active'])
                                     ->sum('total_amount'),
                'this_year' => Booking::whereYear('created_at', now()->year)
                                    ->whereIn('status', ['completed', 'active'])
                                    ->sum('total_amount'),
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
