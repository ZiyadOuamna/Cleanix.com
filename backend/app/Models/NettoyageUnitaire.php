<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NettoyageUnitaire extends Model
{
    use HasFactory;

    protected $table = 'nettoyage_unitaires';

    protected $fillable = [
        'service_id',
        'nom_objet',
        'prix_objet',
    ];

    protected $casts = [
        'prix_objet' => 'decimal:2',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
