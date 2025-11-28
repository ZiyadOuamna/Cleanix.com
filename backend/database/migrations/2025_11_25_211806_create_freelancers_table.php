<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('freelancers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            $table->enum('statut_disponibilite', ['Available', 'Busy', 'Offline'])
                  ->default('Offline');
            $table->decimal('note_moyenne', 3, 2)->nullable(); // Note sur 5.00
            $table->string('details_compte_bancaire')->nullable(); // RIB, IBAN, etc.
            $table->boolean('est_connecte')->default(false);
            
            // Statistiques supplémentaires 
            $table->integer('nombre_missions')->default(0);
            $table->integer('nombre_avis')->default(0);
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('freelancers');
    }
};