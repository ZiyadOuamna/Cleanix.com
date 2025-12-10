<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_proposals', function (Blueprint $table) {
            $table->id();
            
            // Relation avec la commande et l'utilisateur
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('freelancer_id')->constrained('users')->onDelete('cascade');
            
            // Détails de la proposition
            $table->decimal('proposed_price', 10, 2);
            $table->text('description')->nullable(); // Description de la proposition
            $table->datetime('estimated_completion_date')->nullable(); // Date estimée de réalisation
            $table->integer('estimated_duration_hours')->nullable(); // Durée estimée en heures
            
            // Statut
            $table->enum('status', [
                'pending',      // En attente de réaction du client
                'accepted',     // Acceptée par le client
                'rejected',     // Refusée par le client
                'cancelled'     // Annulée par le freelancer
            ])->default('pending');
            
            // Timestamps
            $table->timestamps();
            
            // Indexes
            $table->index('order_id');
            $table->index('freelancer_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_proposals');
    }
};
