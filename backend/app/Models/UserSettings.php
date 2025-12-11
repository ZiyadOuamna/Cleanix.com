<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSettings extends Model
{
    protected $table = 'user_settings';
    protected $fillable = [
        'user_id',
        'notifications',
        'privacy',
        'availability',
        'identity_documents'
    ];

    protected $casts = [
        'notifications' => 'json',
        'privacy' => 'json',
        'availability' => 'json',
        'identity_documents' => 'json'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
