<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'Vehicle Renting System API',
        'version' => '1.0.0',
        'endpoints' => [
            'authentication' => '/api/login',
            'registration' => '/api/register',
            'vehicles' => '/api/vehicles',
            'bookings' => '/api/bookings',
            'dashboard' => '/api/dashboard'
        ]
    ]);
});
