<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'commande_id',
        'client_id',
        'montant',
        'methode_paiement',
        'statut',
        'transaction_id',
        'details',
        'date_paiement',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_paiement' => 'datetime',
        'details' => 'array',
    ];

    // Méthodes de paiement
    const METHODE_PORTEFEUILLE = 'Portefeuille';
    const METHODE_CARTE = 'Carte bancaire';
    const METHODE_VIREMENT = 'Virement';
    const METHODE_ESPECES = 'Especes';

    // Statuts de paiement
    const STATUT_EN_ATTENTE = 'En attente';
    const STATUT_REUSSIE = 'Reussie';
    const STATUT_ECHOUEE = 'Echouee';
    const STATUT_REMBOURSE = 'Rembourse';

    // Relations
    public function commande(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'commande_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    // Méthodes utiles
    public function marquerReussie()
    {
        $this->statut = self::STATUT_REUSSIE;
        $this->date_paiement = now();
        $this->save();
    }

    public function marquerEchouee()
    {
        $this->statut = self::STATUT_ECHOUEE;
        $this->save();
    }

    public function rembourser()
    {
        $this->statut = self::STATUT_REMBOURSE;
        $this->save();
    }

    // Scopes
    public function scopeReussies($query)
    {
        return $query->where('statut', self::STATUT_REUSSIE);
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut', self::STATUT_EN_ATTENTE);
    }
}
