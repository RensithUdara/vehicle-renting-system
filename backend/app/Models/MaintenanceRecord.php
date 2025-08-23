<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'date',
        'type',
        'description',
        'cost',
        'performed_by',
    ];

    protected $casts = [
        'date' => 'date',
        'cost' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the vehicle that owns the maintenance record.
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Scope for maintenance records by vehicle
     */
    public function scopeByVehicle($query, $vehicleId)
    {
        return $query->where('vehicle_id', $vehicleId);
    }

    /**
     * Scope for maintenance records by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for maintenance records by date range
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }
}
