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

    public function portefeuille()
    {
        return $this->hasOne(Portefeuille::class);
    }
 // Relations selon votre UML
    public function commandes()
    {
        return $this->hasMany(Commande::class);
    }

    public function passerCommande($details)
    {
        // À implémenter plus tard
    }

    public function annulerCommande($commande)
    {
        // À implémenter plus tard
    }

    public function payerCommande($commande)
    {
        // Payer depuis le portefeuille
        if ($this->portefeuille && $this->portefeuille->hasEnoughBalance($commande->montant)) {
            return $this->portefeuille->debiter($commande->montant);
        }
        return false;
    }

    public function evaluerFreelancer($commande, $note, $commentaire)
    {
        // À implémenter plus tard
    }
}