<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->foreignId('freelancer_id')->after('id')->constrained('users')->onDelete('cascade');
            $table->string('category')->nullable()->after('nom');
            $table->json('zones')->nullable()->after('adresse');
            $table->json('availability')->nullable()->after('zones');
            $table->json('included_items')->nullable()->after('availability');
            $table->string('status')->default('pending_review')->after('est_actif');
            $table->text('detailed_description')->nullable()->after('description');
            $table->dateTime('reviewed_at')->nullable()->after('status');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('rejection_reason')->nullable()->after('reviewed_by');
        });
    }

    public function down()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropForeignIdFor('users', 'freelancer_id');
            $table->dropForeignIdFor('users', 'reviewed_by');
            $table->dropColumn([
                'freelancer_id',
                'category',
                'zones',
                'availability',
                'included_items',
                'status',
                'detailed_description',
                'reviewed_at',
                'reviewed_by',
                'rejection_reason'
            ]);
        });
    }
};
