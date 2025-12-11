<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NettoyageSuperficie extends Model
{
    use HasFactory;

    protected $table = 'nettoyage_superficies';

    protected $fillable = [
        'service_id',
        'superficie',
    ];

    protected $casts = [
        'superficie' => 'decimal:2',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
