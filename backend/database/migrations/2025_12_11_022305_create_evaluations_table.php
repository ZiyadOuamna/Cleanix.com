<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('freelancer_id')->constrained('freelancers')->onDelete('cascade');
            
            $table->integer('note'); // Note de 1 à 5
            $table->text('commentaire')->nullable();
            
            $table->timestamps();
            
            // Un client ne peut évaluer qu'une seule fois par commande
            $table->unique('order_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('evaluations');
    }
};