<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderProposal extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'freelancer_id',
        'proposed_price',
        'description',
        'estimated_completion_date',
        'estimated_duration_hours',
        'status'
    ];

    protected $casts = [
        'estimated_completion_date' => 'datetime'
    ];

    // Relations
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'freelancer_id');
    }

    // Accesseurs
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }
}
