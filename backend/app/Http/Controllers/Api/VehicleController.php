<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicle::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Search by make or model
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('make', 'LIKE', "%{$search}%")
                  ->orWhere('model', 'LIKE', "%{$search}%");
            });
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('rental_price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('rental_price', '<=', $request->max_price);
        }

        $vehicles = $query->with('maintenanceRecords')
                         ->orderBy('created_at', 'desc')
                         ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $vehicles
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'make' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'type' => 'required|string|max:50',
            'rental_price' => 'required|numeric|min:0',
            'license_plate' => 'required|string|max:20|unique:vehicles,license_plate',
            'color' => 'required|string|max:50',
            'fuel_type' => 'required|string|max:50',
            'transmission' => 'required|string|max:50',
            'seats' => 'required|integer|min:1|max:50',
            'image_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $vehicle = Vehicle::create($request->all());

        // Log activity
        Activity::create([
            'user_id' => $request->user()->id,
            'action' => 'created',
            'entity' => 'vehicle',
            'entity_id' => $vehicle->id,
            'details' => "Created vehicle: {$vehicle->make} {$vehicle->model}",
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Vehicle created successfully',
            'data' => $vehicle->load('maintenanceRecords')
        ], 201);
    }

    public function show($id)
    {
        $vehicle = Vehicle::with(['maintenanceRecords', 'bookings.customer'])
                          ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $vehicle
        ]);
    }

    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'make' => 'sometimes|string|max:100',
            'model' => 'sometimes|string|max:100',
            'year' => 'sometimes|integer|min:1900|max:' . (date('Y') + 1),
            'type' => 'sometimes|string|max:50',
            'rental_price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:available,rented,maintenance',
            'license_plate' => 'sometimes|string|max:20|unique:vehicles,license_plate,' . $id,
            'color' => 'sometimes|string|max:50',
            'fuel_type' => 'sometimes|string|max:50',
            'transmission' => 'sometimes|string|max:50',
            'seats' => 'sometimes|integer|min:1|max:50',
            'image_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $vehicle->update($request->all());

        // Log activity
        Activity::create([
            'user_id' => $request->user()->id,
            'action' => 'updated',
            'entity' => 'vehicle',
            'entity_id' => $vehicle->id,
            'details' => "Updated vehicle: {$vehicle->make} {$vehicle->model}",
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Vehicle updated successfully',
            'data' => $vehicle->load('maintenanceRecords')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        // Check if vehicle has active bookings
        $activeBookings = $vehicle->bookings()
                                 ->whereIn('status', ['approved', 'active'])
                                 ->count();

        if ($activeBookings > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete vehicle with active bookings'
            ], 422);
        }

        $vehicleInfo = "{$vehicle->make} {$vehicle->model}";
        $vehicle->delete();

        // Log activity
        Activity::create([
            'user_id' => $request->user()->id,
            'action' => 'deleted',
            'entity' => 'vehicle',
            'entity_id' => $id,
            'details' => "Deleted vehicle: {$vehicleInfo}",
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Vehicle deleted successfully'
        ]);
    }

    public function available(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = Vehicle::available();

        if ($startDate && $endDate) {
            // Exclude vehicles with bookings that overlap with the requested dates
            $query->whereDoesntHave('bookings', function($q) use ($startDate, $endDate) {
                $q->whereIn('status', ['approved', 'active'])
                  ->where(function($subQ) use ($startDate, $endDate) {
                      $subQ->whereBetween('start_date', [$startDate, $endDate])
                           ->orWhereBetween('end_date', [$startDate, $endDate])
                           ->orWhere(function($subSubQ) use ($startDate, $endDate) {
                               $subSubQ->where('start_date', '<=', $startDate)
                                       ->where('end_date', '>=', $endDate);
                           });
                  });
            });
        }

        $vehicles = $query->orderBy('rental_price', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $vehicles
        ]);
    }
}
