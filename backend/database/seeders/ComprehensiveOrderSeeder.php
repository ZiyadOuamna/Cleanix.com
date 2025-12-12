<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;

class ComprehensiveOrderSeeder extends Seeder
{
    public function run()
    {
        $clients = User::where('user_type', 'Client')->get();
        $freelancers = User::where('user_type', 'Freelancer')->get();
        $services = Service::all();

        if ($clients->isEmpty() || $freelancers->isEmpty() || $services->isEmpty()) {
            return;
        }

        // Commandes en attente
        Order::create([
            'client_id' => $clients[0]->id,
            'freelancer_id' => null,
            'service_id' => $services->where('nom', 'nettoyage_complet')->first()->id,
            'service_type' => 'nettoyage_complet',
            'description' => 'Besoin d\'un nettoyage complet de mon appartement',
            'adresse' => '123 Rue Principale',
            'ville' => 'Casablanca',
            'code_postal' => '20000',
            'square_meters' => 120,
            'number_of_rooms' => 3,
            'horaire_prefere' => 'Matin',
            'genre_freelancer_prefere' => 'Pas de preference',
            'initial_price' => 150.00,
            'scheduled_date' => Carbon::now()->addDays(3),
            'status' => 'pending',
        ]);

        // Commande acceptée
        Order::create([
            'client_id' => $clients[1]->id,
            'freelancer_id' => $freelancers[0]->id,
            'service_id' => $services->where('nom', 'nettoyage_vitres')->first()->id,
            'service_type' => 'nettoyage_vitres',
            'description' => 'Nettoyage des vitres de ma maison',
            'adresse' => '456 Avenue Mohamed V',
            'ville' => 'Fes',
            'code_postal' => '30000',
            'horaire_prefere' => 'Apres-midi',
            'genre_freelancer_prefere' => 'Homme',
            'initial_price' => 80.00,
            'agreed_price' => 75.00,
            'scheduled_date' => Carbon::now()->addDays(2),
            'status' => 'accepted',
        ]);

        // Commande en cours
        Order::create([
            'client_id' => $clients[2]->id,
            'freelancer_id' => $freelancers[1]->id,
            'service_id' => $services->where('nom', 'nettoyage_residential')->first()->id,
            'service_type' => 'nettoyage_residential',
            'description' => 'Nettoyage régulier de ma maison',
            'adresse' => '789 Boulevard de la Liberté',
            'ville' => 'Marrakech',
            'code_postal' => '40000',
            'square_meters' => 95,
            'number_of_rooms' => 2,
            'horaire_prefere' => 'Matin',
            'genre_freelancer_prefere' => 'Femme',
            'initial_price' => 120.00,
            'agreed_price' => 120.00,
            'scheduled_date' => Carbon::now(),
            'status' => 'in_progress',
        ]);

        // Commande terminée
        Order::create([
            'client_id' => $clients[0]->id,
            'freelancer_id' => $freelancers[2]->id,
            'service_id' => $services->where('nom', 'desinfection')->first()->id,
            'service_type' => 'desinfection',
            'description' => 'Désinfection complète après construction',
            'adresse' => '123 Rue Principale',
            'ville' => 'Casablanca',
            'code_postal' => '20000',
            'square_meters' => 150,
            'number_of_rooms' => 4,
            'horaire_prefere' => 'Soir',
            'genre_freelancer_prefere' => 'Pas de preference',
            'initial_price' => 250.00,
            'agreed_price' => 240.00,
            'montant_freelancer' => 216.00,
            'commission_plateforme' => 24.00,
            'scheduled_date' => Carbon::now()->subDays(5),
            'completed_at' => Carbon::now()->subDays(2),
            'status' => 'completed',
            'rating' => 5,
            'review' => 'Excellent travail ! Très satisfait du service.',
        ]);

        // Commande annulée
        Order::create([
            'client_id' => $clients[1]->id,
            'freelancer_id' => null,
            'service_id' => $services->where('nom', 'organisation')->first()->id,
            'service_type' => 'organisation',
            'description' => 'Organisation de ma maison',
            'adresse' => '456 Avenue Mohamed V',
            'ville' => 'Fes',
            'code_postal' => '30000',
            'horaire_prefere' => 'Matin',
            'genre_freelancer_prefere' => 'Pas de preference',
            'initial_price' => 100.00,
            'scheduled_date' => Carbon::now()->subDays(10),
            'status' => 'cancelled',
        ]);

        // Commande en négociation
        Order::create([
            'client_id' => $clients[2]->id,
            'freelancer_id' => $freelancers[0]->id,
            'service_id' => $services->where('nom', 'nettoyage_bureaux')->first()->id,
            'service_type' => 'nettoyage_bureaux',
            'description' => 'Nettoyage de nos locaux commerciaux',
            'adresse' => '789 Boulevard de la Liberté',
            'ville' => 'Marrakech',
            'code_postal' => '40000',
            'square_meters' => 200,
            'horaire_prefere' => 'Apres-midi',
            'genre_freelancer_prefere' => 'Pas de preference',
            'initial_price' => 300.00,
            'scheduled_date' => Carbon::now()->addDays(7),
            'status' => 'negotiating',
        ]);

        // Commande rejetée
        Order::create([
            'client_id' => $clients[0]->id,
            'freelancer_id' => $freelancers[1]->id,
            'service_id' => $services->where('nom', 'nettoyage_apres_renovation')->first()->id,
            'service_type' => 'nettoyage_apres_renovation',
            'description' => 'Nettoyage après travaux de rénovation',
            'adresse' => '123 Rue Principale',
            'ville' => 'Casablanca',
            'code_postal' => '20000',
            'square_meters' => 180,
            'horaire_prefere' => 'Matin',
            'genre_freelancer_prefere' => 'Pas de preference',
            'initial_price' => 350.00,
            'scheduled_date' => Carbon::now()->addDays(5),
            'status' => 'rejected',
        ]);
    }
}
