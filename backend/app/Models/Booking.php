<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'vehicle_id',
        'start_date',
        'end_date',
        'total_amount',
        'status',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the customer that owns the booking.
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Get the vehicle that belongs to the booking.
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Calculate the duration of the booking in days
     */
    public function getDurationAttribute()
    {
        return Carbon::parse($this->start_date)->diffInDays(Carbon::parse($this->end_date)) + 1;
    }

    /**
     * Check if booking is pending
     */
    public function isPending()
    {
        return $this->status === 'pending';
    }

    /**
     * Check if booking is approved
     */
    public function isApproved()
    {
        return $this->status === 'approved';
    }

    /**
     * Check if booking is active
     */
    public function isActive()
    {
        return $this->status === 'active';
    }

    /**
     * Check if booking is completed
     */
    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    /**
     * Check if booking is cancelled
     */
    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }

    /**
     * Scope for active bookings
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for pending bookings
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for bookings by customer
     */
    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    /**
     * Scope for bookings by date range
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                          ->where('end_date', '>=', $endDate);
                    });
    }
}
