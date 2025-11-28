<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('supports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('departement')->nullable();
            $table->boolean('est_disponible')->default(true);//Savoir si l'agent de support est disponible pour prendre des tickets
            $table->integer('tickets_traites')->default(0); //Compter combien de tickets/réclamations l'agent a traité
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('supports');
    }
};