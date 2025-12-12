<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('nettoyage_residentiels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            
            // Champs spécifiques selon votre UML
            $table->integer('nombre_pieces');
            $table->decimal('superficie_totale', 10, 2); // En m²
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('nettoyage_residentiels');
    }
};