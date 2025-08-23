<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceRecord;
use App\Models\Vehicle;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MaintenanceController extends Controller
{
    public function index(Request $request)
    {
        $query = MaintenanceRecord::with(['vehicle']);

        // Filter by vehicle ID
        if ($request->has('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        $maintenanceRecords = $query->orderBy('date', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $maintenanceRecords
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|exists:vehicles,id',
            'date' => 'required|date',
            'type' => 'required|string|max:100',
            'description' => 'required|string|max:1000',
            'cost' => 'required|numeric|min:0',
            'performed_by' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $vehicle = Vehicle::findOrFail($request->vehicle_id);
        
        $maintenanceRecord = MaintenanceRecord::create($request->all());

        // Log activity
        Activity::create([
            'user_id' => $request->user()->id,
            'action' => 'created',
            'entity' => 'maintenance_record',
            'entity_id' => $maintenanceRecord->id,
            'details' => "Added maintenance record for vehicle: {$vehicle->make} {$vehicle->model}",
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance record created successfully',
            'data' => $maintenanceRecord->load('vehicle')
        ], 201);
    }

    public function show($id)
    {
        $maintenanceRecord = MaintenanceRecord::with('vehicle')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $maintenanceRecord
        ]);
    }

    public function update(Request $request, $id)
    {
        $maintenanceRecord = MaintenanceRecord::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'sometimes|exists:vehicles,id',
            'date' => 'sometimes|date',
            'type' => 'sometimes|string|max:100',
            'description' => 'sometimes|string|max:1000',
            'cost' => 'sometimes|numeric|min:0',
            'performed_by' => 'sometimes|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $maintenanceRecord->update($request->all());

        // Log activity
        Activity::create([
            'user_id' => $request->user()->id,
            'action' => 'updated',
            'entity' => 'maintenance_record',
            'entity_id' => $maintenanceRecord->id,
            'details' => "Updated maintenance record for vehicle: {$maintenanceRecord->vehicle->make} {$maintenanceRecord->vehicle->model}",
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance record updated successfully',
            'data' => $maintenanceRecord->load('vehicle')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $maintenanceRecord = MaintenanceRecord::findOrFail($id);
        $vehicleInfo = "{$maintenanceRecord->vehicle->make} {$maintenanceRecord->vehicle->model}";
        
        $maintenanceRecord->delete();

        // Log activity
        Activity::create([
            'user_id' => $request->user()->id,
            'action' => 'deleted',
            'entity' => 'maintenance_record',
            'entity_id' => $id,
            'details' => "Deleted maintenance record for vehicle: {$vehicleInfo}",
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance record deleted successfully'
        ]);
    }

    public function getByVehicle($vehicleId)
    {
        $vehicle = Vehicle::findOrFail($vehicleId);
        $maintenanceRecords = $vehicle->maintenanceRecords()
                                    ->orderBy('date', 'desc')
                                    ->get();

        return response()->json([
            'success' => true,
            'data' => $maintenanceRecords
        ]);
    }
}
