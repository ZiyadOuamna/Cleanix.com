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
        'service_id',
        'service_type',
        'description',
        'adresse',
        'ville',
        'code_postal',
        'location',
        'square_meters',
        'number_of_rooms',
        'horaire_prefere',
        'genre_freelancer_prefere',
        'initial_price',
        'agreed_price',
        'commission_plateforme',
        'montant_freelancer',
        'scheduled_date',
        'date_execution',
        'heure_execution',
        'completed_at',
        'status',
        'photos_before',
        'photos_after',
        'notes',
        'notes_speciales',
        'rating',
        'review'
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
        'date_execution' => 'date',
        'heure_execution' => 'datetime',
        'completed_at' => 'datetime',
        'photos_before' => 'array',
        'photos_after' => 'array',
        'rating' => 'float',
        'initial_price' => 'decimal:2',
        'agreed_price' => 'decimal:2',
        'commission_plateforme' => 'decimal:2',
        'montant_freelancer' => 'decimal:2'
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

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function proposals(): HasMany
    {
        return $this->hasMany(OrderProposal::class);
    }

    public function gestionCle(): HasMany
    {
        return $this->hasMany(GestionCle::class, 'order_id');
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
