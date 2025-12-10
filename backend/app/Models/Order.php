<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'freelancer_id',
        'service_type',
        'description',
        'location',
        'initial_price',
        'agreed_price',
        'scheduled_date',
        'completed_at',
        'status',
        'photos_before',
        'photos_after',
        'notes',
        'rating',
        'review'
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
        'completed_at' => 'datetime',
        'photos_before' => 'array',
        'photos_after' => 'array',
        'rating' => 'float'
    ];

    // Relations
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'freelancer_id');
    }

    public function proposals(): HasMany
    {
        return $this->hasMany(OrderProposal::class);
    }

    // Accesseurs pour les statuts
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isNegotiating(): bool
    {
        return $this->status === 'negotiating';
    }

    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }
}
