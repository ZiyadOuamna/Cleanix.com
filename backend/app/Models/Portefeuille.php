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

    // Relation vers les transactions
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Récupérer le propriétaire du portefeuille (Client ou Freelancer)
    public function getProprietaire()
    {
        return $this->client ?? $this->freelancer;
    }

    // Vérifier si c'est un portefeuille de client
    public function isClientPortefeuille()
    {
        return $this->client_id !== null;
    }

    // Vérifier si c'est un portefeuille de freelancer
    public function isFreelancerPortefeuille()
    {
        return $this->freelancer_id !== null;
    }

    public function crediter($montant)
    {
        $this->solde += $montant;
        $this->save();

        // Enregistrer la transaction
        $this->transactions()->create([
            'type' => 'credit',
            'montant' => $montant,
            'statut' => 'validee',
            'description' => 'Crédit de ' . $montant . ' DH',
        ]);

        return true;
    }

    public function debiter($montant)
    {
        if ($this->solde >= $montant) {
            $this->solde -= $montant;
            $this->save();

            // Enregistrer la transaction
            $this->transactions()->create([
                'type' => 'debit',
                'montant' => $montant,
                'statut' => 'validee',
                'description' => 'Débit de ' . $montant . ' DH',
            ]);

            return true;
        }

        return false; // Solde insuffisant
    }

    // Méthode demanderRetrait selon votre UML (UNIQUEMENT pour Freelancers)
    public function demanderRetrait($montant, $compteBancaire)
    {
        // Vérifier que c'est un portefeuille de freelancer
        if (!$this->isFreelancerPortefeuille()) {
            return false; // Les clients ne peuvent pas faire de retraits
        }

        if ($this->solde >= $montant) {
            // Créer une demande de retrait en attente
            $transaction = $this->transactions()->create([
                'type' => 'retrait',
                'montant' => $montant,
                'compte_bancaire' => $compteBancaire,
                'statut' => 'en_attente',
                'description' => 'Demande de retrait de ' . $montant . ' DH',
            ]);

            return $transaction;
        }

        return false; // Solde insuffisant
    }

    // Méthodes utiles supplémentaires
    public function getSolde()
    {
        return $this->solde;
    }

    public function hasEnoughBalance($montant)
    {
        return $this->solde >= $montant;
    }
}