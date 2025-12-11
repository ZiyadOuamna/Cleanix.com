<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            
            $table->decimal('montant', 10, 2);
            $table->enum('methode_paiement', [
                'Portefeuille',
                'Carte bancaire',
                'Virement',
                'Especes'
            ]);
            $table->enum('statut', ['En attente', 'Reussie', 'Echouee', 'Rembourse'])->default('En attente');
            
            $table->string('transaction_id')->nullable(); // ID de la passerelle de paiement
            $table->text('details')->nullable(); // Détails supplémentaires en JSON
            
            $table->timestamp('date_paiement');
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('paiements');
    }
};