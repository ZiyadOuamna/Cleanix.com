<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Ajouter les champs pour les détails de la surface et des pièces
            $table->decimal('square_meters', 8, 2)->nullable()->after('location')->comment('Surface en m²');
            $table->integer('number_of_rooms')->nullable()->after('square_meters')->comment('Nombre de pièces');
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['square_meters', 'number_of_rooms']);
        });
    }
};
