<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reclamations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Qui fait la réclamation
            $table->foreignId('commande_id')->nullable()->constrained('commandes')->onDelete('cascade');
            $table->foreignId('support_id')->nullable()->constrained('supports')->onDelete('set null'); // Qui traite
            
            $table->string('sujet');
            $table->text('message');
            $table->enum('statut', ['Ouverte', 'En cours', 'Resolue', 'Fermee'])->default('Ouverte');
            $table->text('reponse')->nullable();
            $table->date('date_ouverture');
            $table->date('date_resolution')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reclamations');
    }
};