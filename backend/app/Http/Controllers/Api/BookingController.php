<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Vehicle;
use App\Models\Activity;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['customer', 'vehicle']);

        // Filter by customer (for customers to see their own bookings)
        if ($request->user()->role === 'customer') {
            $query->where('customer_id', $request->user()->id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by customer ID (for admin/staff)
        if ($request->has('customer_id') && $request->user()->role !== 'customer') {
            $query->where('customer_id', $request->customer_id);
        }

        // Filter by vehicle ID
        if ($request->has('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('start_date', [$request->start_date, $request->end_date]);
        }

        $bookings = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date|after:today',
            'end_date' => 'required|date|after:start_date',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $vehicle = Vehicle::findOrFail($request->vehicle_id);

        // Check if vehicle is available
        if (!$vehicle->isAvailable()) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle is not available'
            ], 422);
        }

        // Check for conflicting bookings
        $conflictingBookings = Booking::where('vehicle_id', $request->vehicle_id)
            ->whereIn('status', ['approved', 'active'])
            ->where(function($q) use ($request) {
                $q->whereBetween('start_date', [$request->start_date, $request->end_date])
                  ->orWhereBetween('end_date', [$request->start_date, $request->end_date])
                  ->orWhere(function($subQ) use ($request) {
                      $subQ->where('start_date', '<=', $request->start_date)
                           ->where('end_date', '>=', $request->end_date);
                  });
            })
            ->count();

        if ($conflictingBookings > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle is already booked for the selected dates'
            ], 422);
        }

        // Calculate total amount
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $days = $startDate->diffInDays($endDate) + 1;
        $totalAmount = $days * $vehicle->rental_price;

        $booking = Booking::create([
            'customer_id' => $request->user()->id,
            'vehicle_id' => $request->vehicle_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total_amount' => $totalAmount,
            'notes' => $request->notes,
        ]);

        // Log activity
        Activity::create([
            'user_id' => $request->user()->id,
            'action' => 'created',
            'entity' => 'booking',
            'entity_id' => $booking->id,
            'details' => "Created booking for vehicle: {$vehicle->make} {$vehicle->model}",
            'timestamp' => now(),
        ]);

        // Create notification for admin/staff
        $adminUsers = \App\Models\User::whereIn('role', ['admin', 'staff'])->get();
        foreach ($adminUsers as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'New Booking Request',
                'message' => "New booking request for {$vehicle->make} {$vehicle->model} from {$request->user()->name}",
                'type' => 'info',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully',
            'data' => $booking->load(['customer', 'vehicle'])
        ], 201);
    }

    public function show($id)
    {
        $booking = Booking::with(['customer', 'vehicle'])->findOrFail($id);

        // Check authorization
        if ($booking->customer_id !== auth()->id() && !auth()->user()->isAdmin() && !auth()->user()->isStaff()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        // Only admin/staff can update booking status
        if (!$request->user()->isAdmin() && !$request->user()->isStaff()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,rejected,active,completed,cancelled',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $oldStatus = $booking->status;
        $booking->update($request->only(['status', 'notes']));

        // Update vehicle status based on booking status
        $vehicle = $booking->vehicle;
        if ($request->status === 'active' && $oldStatus !== 'active') {
            $vehicle->update(['status' => 'rented']);
        } elseif (in_array($oldStatus, ['active']) && in_array($request->status, ['completed', 'cancelled'])) {
            $vehicle->update(['status' => 'available']);
        }

        // Log activity
        Activity::create([
            'user_id' => $request->user()->id,
            'action' => 'updated',
            'entity' => 'booking',
            'entity_id' => $booking->id,
            'details' => "Updated booking status from {$oldStatus} to {$request->status}",
            'timestamp' => now(),
        ]);

        // Create notification for customer
        Notification::create([
            'user_id' => $booking->customer_id,
            'title' => 'Booking Status Updated',
            'message' => "Your booking for {$vehicle->make} {$vehicle->model} has been {$request->status}",
            'type' => $request->status === 'approved' ? 'success' : 
                     ($request->status === 'rejected' ? 'error' : 'info'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking updated successfully',
            'data' => $booking->load(['customer', 'vehicle'])
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        // Only customer can cancel their own booking or admin/staff can cancel any
        if ($booking->customer_id !== $request->user()->id && 
            !$request->user()->isAdmin() && 
            !$request->user()->isStaff()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Only pending or approved bookings can be cancelled
        if (!in_array($booking->status, ['pending', 'approved'])) {
            return response()->json([
                'success' => false,
                'message' => 'Booking cannot be cancelled'
            ], 422);
        }

        $booking->update(['status' => 'cancelled']);

        // Update vehicle status if needed
        if ($booking->vehicle->status === 'rented') {
            $booking->vehicle->update(['status' => 'available']);
        }

        // Log activity
        Activity::create([
            'user_id' => $request->user()->id,
            'action' => 'cancelled',
            'entity' => 'booking',
            'entity_id' => $booking->id,
            'details' => "Cancelled booking for vehicle: {$booking->vehicle->make} {$booking->vehicle->model}",
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking cancelled successfully'
        ]);
    }
}
