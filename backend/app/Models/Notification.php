<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'titre',
        'message',
        'type',
        'est_lue',
        'date_envoi',
    ];

    protected $casts = [
        'est_lue' => 'boolean',
        'date_envoi' => 'datetime',
    ];

    // Types de notification
    const TYPE_COMMANDE = 'Commande';
    const TYPE_PAIEMENT = 'Paiement';
    const TYPE_EVALUATION = 'Evaluation';
    const TYPE_RECLAMATION = 'Reclamation';
    const TYPE_SYSTEME = 'Systeme';

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Marquer comme lue
    public function marquerCommeLue()
    {
        $this->est_lue = true;
        $this->save();
    }

    // Scope pour les notifications non lues
    public function scopeNonLues($query)
    {
        return $query->where('est_lue', false);
    }
}
