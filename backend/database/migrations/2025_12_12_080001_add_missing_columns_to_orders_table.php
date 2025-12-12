<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Colonnes de localisation
            if (!Schema::hasColumn('orders', 'adresse')) {
                $table->string('adresse')->nullable()->after('description');
            }
            if (!Schema::hasColumn('orders', 'ville')) {
                $table->string('ville')->nullable()->after('adresse');
            }
            if (!Schema::hasColumn('orders', 'code_postal')) {
                $table->string('code_postal')->nullable()->after('ville');
            }
            
            // Colonnes de superficie et chambres
            if (!Schema::hasColumn('orders', 'square_meters')) {
                $table->integer('square_meters')->nullable()->after('code_postal');
            }
            if (!Schema::hasColumn('orders', 'number_of_rooms')) {
                $table->integer('number_of_rooms')->nullable()->after('square_meters');
            }
            
            // Préférences
            if (!Schema::hasColumn('orders', 'horaire_prefere')) {
                $table->enum('horaire_prefere', ['Matin', 'Apres-midi', 'Soir'])->nullable()->after('number_of_rooms');
            }
            if (!Schema::hasColumn('orders', 'genre_freelancer_prefere')) {
                $table->enum('genre_freelancer_prefere', ['Homme', 'Femme', 'Pas de preference'])->default('Pas de preference')->after('horaire_prefere');
            }
            
            // Dates et horaires supplémentaires
            if (!Schema::hasColumn('orders', 'date_execution')) {
                $table->datetime('date_execution')->nullable()->after('scheduled_date');
            }
            if (!Schema::hasColumn('orders', 'heure_execution')) {
                $table->time('heure_execution')->nullable()->after('date_execution');
            }
            
            // Financier
            if (!Schema::hasColumn('orders', 'commission_plateforme')) {
                $table->decimal('commission_plateforme', 10, 2)->default(0)->after('agreed_price');
            }
            if (!Schema::hasColumn('orders', 'montant_freelancer')) {
                $table->decimal('montant_freelancer', 10, 2)->nullable()->after('commission_plateforme');
            }
            
            // Notes spéciales
            if (!Schema::hasColumn('orders', 'notes_speciales')) {
                $table->text('notes_speciales')->nullable()->after('notes');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $columns = [
                'adresse', 'ville', 'code_postal', 'square_meters', 
                'number_of_rooms', 'horaire_prefere', 'genre_freelancer_prefere',
                'date_execution', 'heure_execution', 'commission_plateforme',
                'montant_freelancer', 'notes_speciales'
            ];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('orders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
