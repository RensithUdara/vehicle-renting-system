<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'date_range',
        'data',
        'generated_by',
    ];

    protected $casts = [
        'date_range' => 'array',
        'data' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who generated the report.
     */
    public function generatedByUser()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    /**
     * Scope for reports by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for reports by user
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('generated_by', $userId);
    }
}
