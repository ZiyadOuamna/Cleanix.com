<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'freelancer_id',
        'nom',
        'category',
        'description',
        'detailed_description',
        'duree_prevue',
        'adresse',
        'zones',
        'availability',
        'available_date',
        'included_items',
        'est_actif',
        'image',
        'status',
        'reviewed_at',
        'reviewed_by',
        'rejection_reason',
    ];

    protected $casts = [
        'est_actif' => 'boolean',
        'duree_prevue' => 'integer',
        'zones' => 'array',
        'availability' => 'array',
        'available_date' => 'date',
        'included_items' => 'array',
        'reviewed_at' => 'datetime',
    ];

    const STATUS_PENDING_REVIEW = 'pending_review';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'freelancer_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ServiceReview::class, 'service_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function nettoyageResidentiel()
    {
        return $this->hasOne(NettoyageResidentiel::class);
    }

    public function nettoyageSuperficie()
    {
        return $this->hasOne(NettoyageSuperficie::class);
    }

    public function nettoyageUnitaire()
    {
        return $this->hasOne(NettoyageUnitaire::class);
    }

    public function isPendingReview(): bool
    {
        return $this->status === self::STATUS_PENDING_REVIEW;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function approve(int $supervisorId, ?string $comment = null): void
    {
        $this->update([
            'status' => self::STATUS_APPROVED,
            'reviewed_by' => $supervisorId,
            'reviewed_at' => Carbon::now(),
        ]);

        ServiceReview::create([
            'service_id' => $this->id,
            'supervisor_id' => $supervisorId,
            'action' => 'approve',
            'comment' => $comment,
            'reviewed_at' => Carbon::now(),
        ]);
    }

    public function reject(int $supervisorId, string $reason): void
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'reviewed_by' => $supervisorId,
            'reviewed_at' => Carbon::now(),
            'rejection_reason' => $reason,
        ]);

        ServiceReview::create([
            'service_id' => $this->id,
            'supervisor_id' => $supervisorId,
            'action' => 'reject',
            'comment' => $reason,
            'reviewed_at' => Carbon::now(),
        ]);
    }
}
