<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'client_id',
        'freelancer_id',
        'note',
        'commentaire',
    ];

    protected $casts = [
        'note' => 'integer',
    ];

    // Relations
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'freelancer_id');
    }

    // Méthodes utiles
    public function isPositive(): bool
    {
        return $this->note >= 4;
    }

    public function isNegative(): bool
    {
        return $this->note <= 2;
    }
}
