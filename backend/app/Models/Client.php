<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'user_id',
        'adresse',
        'ville',
        'code_postal',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // public function commandes()
    // {
    //     return $this->hasMany(Commande::class); // À créer plus tard
    // }
}