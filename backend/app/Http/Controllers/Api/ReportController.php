<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Booking;
use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::with('generatedByUser');

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by user
        if ($request->has('generated_by')) {
            $query->where('generated_by', $request->generated_by);
        }

        $reports = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'type' => 'required|in:revenue,utilization,booking-trends',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $dateRange = [
            'start' => $request->start_date,
            'end' => $request->end_date
        ];

        $data = $this->generateReportData($request->type, $request->start_date, $request->end_date);

        $report = Report::create([
            'title' => $request->title,
            'type' => $request->type,
            'date_range' => $dateRange,
            'data' => $data,
            'generated_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Report generated successfully',
            'data' => $report->load('generatedByUser')
        ], 201);
    }

    public function show($id)
    {
        $report = Report::with('generatedByUser')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $report
        ]);
    }

    public function generateRevenue(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $this->generateReportData('revenue', $request->start_date, $request->end_date);

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function generateUtilization(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $this->generateReportData('utilization', $request->start_date, $request->end_date);

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function generateBookingTrends(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $this->generateReportData('booking-trends', $request->start_date, $request->end_date);

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();

        return response()->json([
            'success' => true,
            'message' => 'Report deleted successfully'
        ]);
    }

    private function generateReportData($type, $startDate, $endDate)
    {
        switch ($type) {
            case 'revenue':
                return $this->generateRevenueData($startDate, $endDate);
            case 'utilization':
                return $this->generateUtilizationData($startDate, $endDate);
            case 'booking-trends':
                return $this->generateBookingTrendsData($startDate, $endDate);
            default:
                return [];
        }
    }

    private function generateRevenueData($startDate, $endDate)
    {
        $bookings = Booking::whereBetween('start_date', [$startDate, $endDate])
                          ->whereIn('status', ['completed', 'active'])
                          ->with(['vehicle'])
                          ->get();

        $totalRevenue = $bookings->sum('total_amount');
        $bookingCount = $bookings->count();
        $averageBookingValue = $bookingCount > 0 ? $totalRevenue / $bookingCount : 0;

        // Revenue by vehicle type
        $revenueByType = $bookings->groupBy('vehicle.type')
                                ->map(function($group) {
                                    return $group->sum('total_amount');
                                });

        // Daily revenue
        $dailyRevenue = $bookings->groupBy(function($booking) {
            return Carbon::parse($booking->start_date)->format('Y-m-d');
        })->map(function($group) {
            return $group->sum('total_amount');
        });

        return [
            'total_revenue' => $totalRevenue,
            'booking_count' => $bookingCount,
            'average_booking_value' => round($averageBookingValue, 2),
            'revenue_by_type' => $revenueByType,
            'daily_revenue' => $dailyRevenue,
        ];
    }

    private function generateUtilizationData($startDate, $endDate)
    {
        $totalVehicles = Vehicle::count();
        $totalDays = Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) + 1;
        $totalVehicleDays = $totalVehicles * $totalDays;

        $bookings = Booking::whereBetween('start_date', [$startDate, $endDate])
                          ->whereIn('status', ['completed', 'active'])
                          ->with(['vehicle'])
                          ->get();

        $utilizedDays = $bookings->sum(function($booking) {
            return Carbon::parse($booking->start_date)->diffInDays(Carbon::parse($booking->end_date)) + 1;
        });

        $utilizationRate = $totalVehicleDays > 0 ? ($utilizedDays / $totalVehicleDays) * 100 : 0;

        // Utilization by vehicle type
        $utilizationByType = Vehicle::with(['bookings' => function($query) use ($startDate, $endDate) {
            $query->whereBetween('start_date', [$startDate, $endDate])
                  ->whereIn('status', ['completed', 'active']);
        }])->get()->groupBy('type')->map(function($vehicles) use ($totalDays) {
            $totalTypeVehicles = $vehicles->count();
            $totalTypeDays = $totalTypeVehicles * $totalDays;
            
            $utilizedTypeDays = $vehicles->sum(function($vehicle) {
                return $vehicle->bookings->sum(function($booking) {
                    return Carbon::parse($booking->start_date)->diffInDays(Carbon::parse($booking->end_date)) + 1;
                });
            });

            return [
                'total_vehicles' => $totalTypeVehicles,
                'utilization_rate' => $totalTypeDays > 0 ? ($utilizedTypeDays / $totalTypeDays) * 100 : 0,
            ];
        });

        return [
            'total_vehicles' => $totalVehicles,
            'total_days' => $totalDays,
            'utilized_days' => $utilizedDays,
            'utilization_rate' => round($utilizationRate, 2),
            'utilization_by_type' => $utilizationByType,
        ];
    }

    private function generateBookingTrendsData($startDate, $endDate)
    {
        $bookings = Booking::whereBetween('created_at', [$startDate, $endDate])
                          ->with(['vehicle'])
                          ->get();

        // Bookings by status
        $bookingsByStatus = $bookings->groupBy('status')->map->count();

        // Bookings by month
        $bookingsByMonth = $bookings->groupBy(function($booking) {
            return Carbon::parse($booking->created_at)->format('Y-m');
        })->map->count();

        // Bookings by vehicle type
        $bookingsByType = $bookings->groupBy('vehicle.type')->map->count();

        // Booking success rate
        $totalBookings = $bookings->count();
        $completedBookings = $bookings->where('status', 'completed')->count();
        $successRate = $totalBookings > 0 ? ($completedBookings / $totalBookings) * 100 : 0;

        // Average booking duration
        $averageDuration = $bookings->where('status', 'completed')->avg(function($booking) {
            return Carbon::parse($booking->start_date)->diffInDays(Carbon::parse($booking->end_date)) + 1;
        });

        return [
            'total_bookings' => $totalBookings,
            'bookings_by_status' => $bookingsByStatus,
            'bookings_by_month' => $bookingsByMonth,
            'bookings_by_type' => $bookingsByType,
            'success_rate' => round($successRate, 2),
            'average_duration' => round($averageDuration ?: 0, 1),
        ];
    }
}
