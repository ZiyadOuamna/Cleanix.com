<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'portefeuille_id',
        'type',
        'montant',
        'compte_bancaire',
        'statut',
        'description',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
    ];

    // Types de transaction
    const TYPE_CREDIT = 'credit';
    const TYPE_DEBIT = 'debit';
    const TYPE_RETRAIT = 'retrait';

    // Statuts
    const STATUT_EN_ATTENTE = 'en_attente';
    const STATUT_VALIDEE = 'validee';
    const STATUT_REFUSEE = 'refusee';

    // Relation vers Portefeuille
    public function portefeuille()
    {
        return $this->belongsTo(Portefeuille::class);
    }

    // Méthodes utiles
    public function valider()
    {
        $this->statut = self::STATUT_VALIDEE;
        
        // Si c'est un retrait validé, débiter le portefeuille
        if ($this->type === self::TYPE_RETRAIT) {
            $this->portefeuille->debiter($this->montant);
        }
        
        $this->save();
    }

    public function refuser()
    {
        $this->statut = self::STATUT_REFUSEE;
        $this->save();
    }

    public function isEnAttente()
    {
        return $this->statut === self::STATUT_EN_ATTENTE;
    }

    public function isValidee()
    {
        return $this->statut === self::STATUT_VALIDEE;
    }

    public function isRefusee()
    {
        return $this->statut === self::STATUT_REFUSEE;
    }
}