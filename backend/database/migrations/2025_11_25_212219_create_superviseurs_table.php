<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('superviseurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            $table->enum('niveau_acces', ['Admin', 'Manager', 'Superviseur'])
                  ->default('Superviseur');
            $table->text('permissions')->nullable(); // JSON des permissions
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('superviseurs');
    }
};