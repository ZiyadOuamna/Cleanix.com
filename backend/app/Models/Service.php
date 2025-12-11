<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'prix',
        'duree_prevue',
        'adresse',
        'est_actif',
        'image',
    ];

    protected $casts = [
        'prix' => 'decimal:2',
        'est_actif' => 'boolean',
        'duree_prevue' => 'integer',
    ];

    // Relations
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
