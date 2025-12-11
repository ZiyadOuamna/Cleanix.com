<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cles', function (Blueprint $table) {
            $table->id();
            
            // Informations selon votre UML
            $table->string('cle'); // Identifiant ou numéro de la clé
            $table->text('evenement_compartiment')->nullable(); // Détails
            $table->enum('statut', ['Disponible', 'En cours', 'Retournee'])->default('Disponible');
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cles');
    }
};