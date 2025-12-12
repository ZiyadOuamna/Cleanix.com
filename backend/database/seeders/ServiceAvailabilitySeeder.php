<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use Carbon\Carbon;

class ServiceAvailabilitySeeder extends Seeder
{
    /**
     * Seed the service availability dates.
     *
     * @return void
     */
    public function run()
    {
        // Mettre à jour les services existants avec des dates de disponibilité
        $services = Service::all();
        
        foreach ($services as $index => $service) {
            // Assigner une date à partir de demain ou dans quelques jours
            $availableDate = Carbon::now()->addDays($index % 7 + 1);
            
            $service->update([
                'available_date' => $availableDate->format('Y-m-d')
            ]);
        }

        // Si aucun service n'existe, créer des services de démonstration
        if (Service::count() === 0) {
            $categories = ['Nettoyage Résidentiel', 'Nettoyage Commercial', 'Nettoyage Spécialisé'];
            
            foreach ($categories as $index => $category) {
                Service::create([
                    'nom' => $category,
                    'category' => $category,
                    'description' => "Service de {$category}",
                    'est_actif' => true,
                    'available_date' => Carbon::now()->addDays($index + 1)->format('Y-m-d')
                ]);
            }
        }
    }
}
