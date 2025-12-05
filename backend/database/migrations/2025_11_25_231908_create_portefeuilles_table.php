<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('portefeuilles', function (Blueprint $table) {
            $table->id(); 

            // Peut appartenir à un Client OU un Freelancer
            $table->foreignId('client_id')->nullable()->constrained('clients')->onDelete('cascade');
            $table->foreignId('freelancer_id')->nullable()->constrained('freelancers')->onDelete('cascade');
            
            $table->decimal('solde', 10, 2)->default(0);
            
            $table->timestamps();
            
            // Contrainte : Un portefeuille appartient à UN SEUL (client OU freelancer)
            // On ne peut pas avoir les deux à la fois
        });
    }

    public function down()
    {
        Schema::dropIfExists('portefeuilles');
    }
};