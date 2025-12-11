<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            $table->string('titre');
            $table->text('message');
            $table->enum('type', [
                'Commande',
                'Paiement',
                'Evaluation',
                'Reclamation',
                'Systeme'
            ])->default('Systeme');
            
            $table->boolean('est_lue')->default(false);
            $table->timestamp('date_envoi');
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};