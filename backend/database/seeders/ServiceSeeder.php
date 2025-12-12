<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\User;

class ServiceSeeder extends Seeder
{
    public function run()
    {
        // Récupérer les freelancers
        $freelancers = User::where('user_type', 'Freelancer')->get();
        
        if ($freelancers->isEmpty()) {
            return; // Pas de freelancers, ne pas créer de services
        }

        $services = [
            [
                'nom' => 'nettoyage_complet',
                'description' => 'Nettoyage complet de votre domicile',
                'duree_prevue' => 120,
                'freelancer_id' => $freelancers[0]->id,
            ],
            [
                'nom' => 'nettoyage_residential',
                'description' => 'Nettoyage résidentiel standard',
                'duree_prevue' => 90,
                'freelancer_id' => $freelancers[0]->id,
            ],
            [
                'nom' => 'nettoyage_vitres',
                'description' => 'Nettoyage professionnel des vitres',
                'duree_prevue' => 60,
                'freelancer_id' => $freelancers[1]->id ?? $freelancers[0]->id,
            ],
            [
                'nom' => 'nettoyage_bureaux',
                'description' => 'Nettoyage complet des bureaux',
                'duree_prevue' => 120,
                'freelancer_id' => $freelancers[1]->id ?? $freelancers[0]->id,
            ],
            [
                'nom' => 'nettoyage_superficie',
                'description' => 'Nettoyage spécifique par type de surface',
                'duree_prevue' => 75,
                'freelancer_id' => $freelancers[2]->id ?? $freelancers[0]->id,
            ],
            [
                'nom' => 'desinfection',
                'description' => 'Service de désinfection complet',
                'duree_prevue' => 150,
                'freelancer_id' => $freelancers[2]->id ?? $freelancers[0]->id,
            ],
            [
                'nom' => 'organisation',
                'description' => 'Service d\'organisation et de rangement',
                'duree_prevue' => 120,
                'freelancer_id' => $freelancers[1]->id ?? $freelancers[0]->id,
            ],
            [
                'nom' => 'nettoyage_apres_renovation',
                'description' => 'Nettoyage professionnel après rénovation',
                'duree_prevue' => 180,
                'freelancer_id' => $freelancers[0]->id,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
