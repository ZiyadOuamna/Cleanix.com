<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reclamation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'commande_id',
        'support_id',
        'sujet',
        'message',
        'statut',
        'reponse',
        'date_ouverture',
        'date_resolution',
    ];

    protected $casts = [
        'date_ouverture' => 'datetime',
        'date_resolution' => 'datetime',
    ];

    // Statuts
    const STATUT_OUVERTE = 'Ouverte';
    const STATUT_EN_COURS = 'En cours';
    const STATUT_RESOLUE = 'Resolue';
    const STATUT_FERMEE = 'Fermee';

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'commande_id');
    }

    public function support(): BelongsTo
    {
        return $this->belongsTo(Support::class, 'support_id');
    }

    // Méthodes utiles
    public function marquerEnCours()
    {
        $this->statut = self::STATUT_EN_COURS;
        $this->save();
    }

    public function marquerResolvue($reponse)
    {
        $this->statut = self::STATUT_RESOLUE;
        $this->reponse = $reponse;
        $this->date_resolution = now();
        $this->save();
    }

    public function marquerFermee()
    {
        $this->statut = self::STATUT_FERMEE;
        $this->save();
    }

    // Scope
    public function scopeOuvertes($query)
    {
        return $query->where('statut', self::STATUT_OUVERTE);
    }
}
