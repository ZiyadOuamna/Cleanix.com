<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Superviseur extends Model
{
    protected $table = 'superviseurs';
    
    protected $fillable = [
        'user_id',
        'niveau_acces',
        'permissions',
    ];

    protected $casts = [
        'permissions' => 'array', // Cast JSON en array automatiquement
    ];

    // Niveaux d'accès
    const NIVEAU_ADMIN = 'Admin';
    const NIVEAU_MANAGER = 'Manager';
    const NIVEAU_SUPERVISEUR = 'Superviseur';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Vérifier si le superviseur a une permission spécifique
    public function hasPermission($permission)
    {
        if (!$this->permissions) {
            return false;
        }
        
        return in_array($permission, $this->permissions);
    }

    // Ajouter une permission
    public function addPermission($permission)
    {
        $permissions = $this->permissions ?? [];
        
        if (!in_array($permission, $permissions)) {
            $permissions[] = $permission;
            $this->permissions = $permissions;
            $this->save();
        }
    }

    // Retirer une permission
    public function removePermission($permission)
    {
        if (!$this->permissions) {
            return;
        }
        
        $permissions = array_diff($this->permissions, [$permission]);
        $this->permissions = array_values($permissions);
        $this->save();
    }

    // Vérifier le niveau d'accès
    public function isAdmin()
    {
        return $this->niveau_acces === self::NIVEAU_ADMIN;
    }

    public function isManager()
    {
        return $this->niveau_acces === self::NIVEAU_MANAGER;
    }

    public function isSuperviseur()
    {
        return $this->niveau_acces === self::NIVEAU_SUPERVISEUR;
    }
}