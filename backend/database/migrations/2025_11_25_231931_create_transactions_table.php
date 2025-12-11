<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portefeuille_id')->constrained('portefeuilles')->onDelete('cascade');
            
            $table->enum('type', ['credit', 'debit', 'retrait']);
            $table->decimal('montant', 10, 2);
            $table->string('compte_bancaire')->nullable(); // Pour les retraits
            $table->enum('statut', ['en_attente', 'validee', 'refusee'])->default('en_attente');
            $table->text('description')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('transactions');
    }
};