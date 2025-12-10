<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Client;
use App\Models\Freelancer;
use App\Models\Order;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run()
    {
        // Create a test client if not exists
        $client = User::firstOrCreate(
            ['email' => 'client@test.com'],
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'user_type' => 'Client',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'telephone' => '0612345678',
                'genre' => 'Homme',
            ]
        );

        // Create client profile if doesn't exist
        if (!$client->client) {
            Client::create([
                'user_id' => $client->id,
                'adresse' => '123 Rue de Paris, 75001 Paris',
                'ville' => 'Paris',
                'code_postal' => '75001',
            ]);
        }

        // Create a test freelancer if not exists
        $freelancer = User::firstOrCreate(
            ['email' => 'freelancer@test.com'],
            [
                'nom' => 'Martin',
                'prenom' => 'Marie',
                'user_type' => 'Freelancer',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'telephone' => '0687654321',
                'genre' => 'Femme',
            ]
        );

        // Create freelancer profile if doesn't exist
        if (!$freelancer->freelancer) {
            Freelancer::create([
                'user_id' => $freelancer->id,
                'statut_disponibilite' => 'Available',
                'note_moyenne' => 4.8,
                'nombre_missions' => 25,
                'nombre_avis' => 18,
            ]);
        }

        // Create test orders
        Order::firstOrCreate(
            ['id' => 1],
            [
                'client_id' => $client->id,
                'freelancer_id' => null,
                'service_type' => 'Nettoyage complet',
                'description' => 'Besoin d\'un nettoyage complet de mon appartement. Tous les détails inclus.',
                'location' => '123 Rue de Paris, 75001 Paris',
                'initial_price' => 85.00,
                'agreed_price' => null,
                'scheduled_date' => Carbon::now()->addDays(3)->setTime(10, 0),
                'completed_at' => null,
                'status' => 'pending',
                'notes' => null,
                'rating' => null,
                'review' => null,
            ]
        );

        Order::firstOrCreate(
            ['id' => 2],
            [
                'client_id' => $client->id,
                'freelancer_id' => null,
                'service_type' => 'Nettoyage de vitres',
                'description' => 'Nettoyage des vitres de mon bureau. Environ 20 vitres.',
                'location' => '456 Avenue des Champs, 75008 Paris',
                'initial_price' => 120.00,
                'agreed_price' => null,
                'scheduled_date' => Carbon::now()->addDays(5)->setTime(14, 0),
                'completed_at' => null,
                'status' => 'pending',
                'notes' => null,
                'rating' => null,
                'review' => null,
            ]
        );

        Order::firstOrCreate(
            ['id' => 3],
            [
                'client_id' => $client->id,
                'freelancer_id' => null,
                'service_type' => 'Nettoyage après travaux',
                'description' => 'Nettoyage complet après travaux de rénovation. Très sales.',
                'location' => '789 Boulevard Saint-Germain, 75006 Paris',
                'initial_price' => 200.00,
                'agreed_price' => null,
                'scheduled_date' => Carbon::now()->addDays(7)->setTime(9, 0),
                'completed_at' => null,
                'status' => 'pending',
                'notes' => null,
                'rating' => null,
                'review' => null,
            ]
        );

        $this->command->info('Test orders created successfully!');
    }
}
