<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'make',
        'model',
        'year',
        'type',
        'rental_price',
        'status',
        'license_plate',
        'color',
        'fuel_type',
        'transmission',
        'seats',
        'image_url',
    ];

    protected $casts = [
        'year' => 'integer',
        'rental_price' => 'decimal:2',
        'seats' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the bookings for the vehicle.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the maintenance records for the vehicle.
     */
    public function maintenanceRecords()
    {
        return $this->hasMany(MaintenanceRecord::class);
    }

    /**
     * Check if vehicle is available
     */
    public function isAvailable()
    {
        return $this->status === 'available';
    }

    /**
     * Check if vehicle is rented
     */
    public function isRented()
    {
        return $this->status === 'rented';
    }

    /**
     * Check if vehicle is under maintenance
     */
    public function inMaintenance()
    {
        return $this->status === 'maintenance';
    }

    /**
     * Get the current active booking for this vehicle
     */
    public function currentBooking()
    {
        return $this->bookings()
            ->whereIn('status', ['approved', 'active'])
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();
    }

    /**
     * Scope for available vehicles
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    /**
     * Scope for vehicles by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}
