<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Freelancer extends Model
{
    protected $fillable = [
        'user_id',
        'statut_disponibilite',
        'competences',
        'est_connecte',
        'solde',
        'nombre_missions',
        'note_moyenne',
        'nombre_avis',
    ];

    protected $casts = [
        'est_connecte' => 'boolean',
        'solde' => 'decimal:2',
        'note_moyenne' => 'decimal:2',
    ];

    // Statuts de disponibilité
    const STATUT_AVAILABLE = 'Available';
    const STATUT_BUSY = 'Busy';
    const STATUT_OFFLINE = 'Offline';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Méthodes utiles
    public function setStatut($statut)
    {
        $this->statut_disponibilite = $statut;
        $this->save();
    }

    public function setConnecte($connecte)
    {
        $this->est_connecte = $connecte;
        $this->save();
    }

    public function isAvailable()
    {
        return $this->statut_disponibilite === self::STATUT_AVAILABLE;
    }

    public function portefeuille()
    {
        return $this->hasOne(Portefeuille::class); 
    }
}