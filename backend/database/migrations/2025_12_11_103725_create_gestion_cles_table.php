<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('service_gestion_cles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes')->onDelete('cascade');
            $table->foreignId('cle_id')->nullable()->constrained('cles')->onDelete('set null');
            
            // Informations selon votre UML
            $table->string('nom_locataire');
            $table->string('telephone_locataire')->nullable();
            $table->string('nom_proprietaire');
            $table->string('telephone_proprietaire')->nullable();
            
            // Lieu et date de prise en charge
            $table->string('lieu_prise_en_charge');
            $table->datetime('date_heure_prise_en_charge');
            $table->datetime('date_heure_retour')->nullable();
            
            // Type de déplacement selon votre UML
            $table->enum('type_deplacement', ['Pickup', 'Delivery', 'Both']);
            
            // Instructions et commentaires
            $table->text('instructions')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('service_gestion_cles');
    }
};