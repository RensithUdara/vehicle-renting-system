<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working!',
        'timestamp' => now()
    ]);
});

// Temporary test login endpoint (for CORS testing)
Route::post('/login-test', function (Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'Login test successful',
        'data' => [
            'user' => [
                'id' => 1,
                'name' => 'Test User',
                'email' => $request->email ?? 'test@example.com',
                'role' => 'admin'
            ],
            'access_token' => 'test_token_123',
            'token_type' => 'Bearer',
        ]
    ]);
});

// Temporary test register endpoint (for debugging)
Route::post('/register-test', function (Request $request) {
    try {
        $user = App\Models\User::create([
            'name' => $request->name ?? 'Test User',
            'email' => $request->email ?? 'test' . rand(1000,9999) . '@example.com',
            'password' => Hash::make($request->password ?? 'password123'),
            'phone' => $request->phone,
            'address' => $request->address,
            'role' => $request->role ?? 'customer',
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => [
                'user' => $user,
                'access_token' => 'test_token_' . $user->id,
                'token_type' => 'Bearer',
            ]
        ], 201);
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Registration failed: ' . $e->getMessage(),
            'error' => $e->getTraceAsString()
        ], 500);
    }
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/stats', [DashboardController::class, 'getStats']);

    // Vehicle routes
    Route::apiResource('vehicles', VehicleController::class);
    Route::get('/vehicles-available', [VehicleController::class, 'available']);

    // Booking routes
    Route::apiResource('bookings', BookingController::class);

    // Maintenance routes
    Route::apiResource('maintenance', MaintenanceController::class);
    Route::get('/maintenance/vehicle/{vehicleId}', [MaintenanceController::class, 'getByVehicle']);

    // Activity routes
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::get('/activities/{id}', [ActivityController::class, 'show']);
    Route::get('/activities/entity/{entity}/{entityId}', [ActivityController::class, 'getByEntity']);
    Route::get('/activities/user/{userId}', [ActivityController::class, 'getUserActivities']);

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'create']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::get('/notifications/unread/count', [NotificationController::class, 'unreadCount']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Report routes
    Route::apiResource('reports', ReportController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('/reports/revenue', [ReportController::class, 'generateRevenue']);
    Route::post('/reports/utilization', [ReportController::class, 'generateUtilization']);
    Route::post('/reports/booking-trends', [ReportController::class, 'generateBookingTrends']);
});

// Fallback route for API
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found'
    ], 404);
});
