<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Support extends Model
{
    protected $table = 'supports';
    
    protected $fillable = [
        'user_id',
        'departement',
        'est_disponible',
        'tickets_traites',
    ];

    protected $casts = [
        'est_disponible' => 'boolean',
    ];

    // Relation inverse vers User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}