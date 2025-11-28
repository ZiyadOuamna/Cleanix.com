<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'nom',
        'prenom',
        'genre',
        'email',
        'telephone',
        'password',
        'user_type',
        'photo_profil',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Types d'utilisateurs
    const TYPE_CLIENT = 'Client';
    const TYPE_FREELANCER = 'Freelancer';
    const TYPE_SUPPORT = 'Support';
    const TYPE_SUPERVISEUR = 'Superviseur';

    // Genres
    const GENRE_HOMME = 'Homme';
    const GENRE_FEMME = 'Femme';

    // ===== RELATIONS =====
    
    public function client()
    {
        return $this->hasOne(Client::class);
    }

    public function freelancer()
    {
        return $this->hasOne(Freelancer::class);
    }

    public function support()
    {
        return $this->hasOne(Support::class);
    }

    public function superviseur()
    {
        return $this->hasOne(Superviseur::class);
    }

    // ===== MÉTHODES DE VÉRIFICATION DU TYPE =====
    
    public function isClient()
    {
        return $this->user_type === self::TYPE_CLIENT;
    }

    public function isFreelancer()
    {
        return $this->user_type === self::TYPE_FREELANCER;
    }

    public function isSupport()
    {
        return $this->user_type === self::TYPE_SUPPORT;
    }

    public function isSuperviseur()
    {
        return $this->user_type === self::TYPE_SUPERVISEUR;
    }

    // ===== MÉTHODES DE VÉRIFICATION DU GENRE =====
    
    public function isHomme()
    {
        return $this->genre === self::GENRE_HOMME;
    }

    public function isFemme()
    {
        return $this->genre === self::GENRE_FEMME;
    }

    // ===== MÉTHODES UTILITAIRES =====
    
    // Récupérer le profil spécifique selon le type
    public function getProfile()
    {
        return match($this->user_type) {
            self::TYPE_CLIENT => $this->client,
            self::TYPE_FREELANCER => $this->freelancer,
            self::TYPE_SUPPORT => $this->support,
            self::TYPE_SUPERVISEUR => $this->superviseur,
            default => null,
        };
    }

    public function resetComplete()
    {
        $this->photo_profil = null;
        $this->save();
        
        // Réinitialiser aussi le profil spécifique
        $profile = $this->getProfile();
        if ($profile && $this->isFreelancer()) {
            $profile->statut_disponibilite = 'Offline';
            $profile->est_connecte = false;
            $profile->save();
        }
    }
}