<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NettoyageResidentiel extends Model
{
    use HasFactory;

    protected $table = 'nettoyage_residentiels';

    protected $fillable = [
        'service_id',
        'nombre_pieces',
        'superficie_totale',
    ];

    protected $casts = [
        'nombre_pieces' => 'integer',
        'superficie_totale' => 'decimal:2',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
