<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            
            // Relation avec les utilisateurs et services
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('freelancer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('service_id')->nullable()->constrained('services')->onDelete('set null');
            
            // Détails de la commande
            $table->string('service_type'); // Type de service (nettoyage-complet, vitres, etc.)
            $table->text('description')->nullable(); // Description du service
            
            // Localisation
            $table->string('adresse'); // Adresse complète
            $table->string('ville'); // Ville
            $table->string('code_postal')->nullable(); // Code postal
            $table->string('location')->nullable(); // Lieu (backup)
            
            // Préférences
            $table->enum('horaire_prefere', ['Matin', 'Apres-midi', 'Soir'])->nullable();
            $table->enum('genre_freelancer_prefere', ['Homme', 'Femme', 'Pas de preference'])->default('Pas de preference');
            
            // Dates et horaires
            $table->datetime('scheduled_date'); // Date prévue du service
            $table->datetime('date_execution')->nullable(); // Date réelle d'exécution
            $table->time('heure_execution')->nullable(); // Heure d'exécution
            $table->datetime('completed_at')->nullable(); // Date de réalisation
            
            // Financier
            $table->decimal('initial_price', 10, 2)->nullable(); // Prix initial proposé par le client
            $table->decimal('agreed_price', 10, 2)->nullable(); // Prix convenu après négociation
            $table->decimal('commission_plateforme', 10, 2)->default(0); // Commission Cleanix
            $table->decimal('montant_freelancer', 10, 2)->nullable(); // Montant versé au freelancer
            
            // Statut
            $table->enum('status', [
                'pending',           // En attente de réponse freelancer
                'negotiating',       // En négociation (propositions en cours)
                'accepted',          // Acceptée par le freelancer
                'in_progress',       // En cours de réalisation
                'completed',         // Terminée
                'cancelled',         // Annulée
                'rejected'           // Refusée
            ])->default('pending');
            
            // Données supplémentaires
            $table->json('photos_before')->nullable(); // Photos avant nettoyage
            $table->json('photos_after')->nullable(); // Photos après nettoyage
            $table->text('notes')->nullable(); // Notes du client ou freelancer
            $table->text('notes_speciales')->nullable(); // Notes spéciales du client
            $table->decimal('rating', 3, 2)->nullable(); // Note de la commande (1-5)
            $table->text('review')->nullable(); // Avis client
            
            // Timestamps
            $table->timestamps();
            
            // Indexes
            $table->index('client_id');
            $table->index('freelancer_id');
            $table->index('service_id');
            $table->index('status');
            $table->index('scheduled_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
