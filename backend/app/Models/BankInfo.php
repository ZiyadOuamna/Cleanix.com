<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankInfo extends Model
{
    protected $table = 'bank_info';
    protected $fillable = [
        'user_id',
        'bank_name',
        'account_number',
        'iban',
        'swift'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
