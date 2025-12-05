<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Exception;

class Portefeuille extends Model
{
    protected $fillable = [
        'client_id',
        'freelancer_id',
        'solde',
    ];

    protected $casts = [
        'solde' => 'decimal:2',
    ];

    // Validation avant création
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($portefeuille) {
            // Vérifier qu'il a soit client_id, soit freelancer_id (pas les deux, pas aucun)
            if (!$portefeuille->client_id && !$portefeuille->freelancer_id) {
                throw new Exception("Un portefeuille doit appartenir à un client ou un freelancer");
            }

            if ($portefeuille->client_id && $portefeuille->freelancer_id) {
                throw new Exception("Un portefeuille ne peut pas appartenir à la fois à un client et un freelancer");
            }
        });
    }

    // Relation vers Client (nullable)
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    // Relation vers Freelancer (nullable)
    public function freelancer()
    {
        return $this->belongsTo(Freelancer::class);
    }
   
}