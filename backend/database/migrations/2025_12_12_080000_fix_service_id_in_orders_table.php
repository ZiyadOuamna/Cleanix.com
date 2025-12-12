<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Vérifier si la colonne n'existe pas déjà
            if (!Schema::hasColumn('orders', 'service_id')) {
                $table->foreignId('service_id')->nullable()->after('freelancer_id')->constrained('services')->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'service_id')) {
                $table->dropForeign(['service_id']);
                $table->dropColumn('service_id');
            }
        });
    }
};
