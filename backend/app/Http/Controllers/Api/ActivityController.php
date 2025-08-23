<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with('user');

        // Filter by user (for regular users to see their own activities)
        if ($request->user()->role === 'customer') {
            $query->where('user_id', $request->user()->id);
        }

        // Filter by user ID (for admin/staff)
        if ($request->has('user_id') && $request->user()->role !== 'customer') {
            $query->where('user_id', $request->user_id);
        }

        // Filter by entity
        if ($request->has('entity')) {
            $query->where('entity', $request->entity);
        }

        // Filter by action
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('timestamp', [$request->start_date, $request->end_date]);
        }

        // Show recent activities by default
        if (!$request->has('start_date') && !$request->has('end_date')) {
            $query->recent(30); // Last 30 days
        }

        $activities = $query->orderBy('timestamp', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $activities
        ]);
    }

    public function show($id)
    {
        $activity = Activity::with('user')->findOrFail($id);

        // Check authorization
        if ($activity->user_id !== auth()->id() && 
            !auth()->user()->isAdmin() && 
            !auth()->user()->isStaff()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $activity
        ]);
    }

    public function getByEntity(Request $request, $entity, $entityId)
    {
        $activities = Activity::with('user')
                             ->where('entity', $entity)
                             ->where('entity_id', $entityId)
                             ->orderBy('timestamp', 'desc')
                             ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $activities
        ]);
    }

    public function getUserActivities(Request $request, $userId)
    {
        // Check authorization
        if ($userId != auth()->id() && 
            !auth()->user()->isAdmin() && 
            !auth()->user()->isStaff()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $activities = Activity::with('user')
                             ->where('user_id', $userId)
                             ->orderBy('timestamp', 'desc')
                             ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $activities
        ]);
    }
}
