<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Client;
use App\Models\Freelancer;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Client 1
        $client1 = User::create([
            'nom' => 'Ahmed Alami',
            'prenom' => 'Ahmed',
            'email' => 'client1@test.com',
            'telephone' => '0612345678',
            'password' => Hash::make('password123'),
            'user_type' => 'Client',
            'email_verified_at' => now(),
        ]);
        Client::create([
            'user_id' => $client1->id,
            'adresse' => '123 Rue Principale, Casablanca',
            'ville' => 'Casablanca',
            'code_postal' => '20000',
        ]);

        // Client 2
        $client2 = User::create([
            'nom' => 'Fatima Bennani',
            'prenom' => 'Fatima',
            'email' => 'client2@test.com',
            'telephone' => '0623456789',
            'password' => Hash::make('password123'),
            'user_type' => 'Client',
            'email_verified_at' => now(),
        ]);
        Client::create([
            'user_id' => $client2->id,
            'adresse' => '456 Avenue Mohamed V, Fes',
            'ville' => 'Fes',
            'code_postal' => '30000',
        ]);

        // Client 3
        $client3 = User::create([
            'nom' => 'Karima Kabbaj',
            'prenom' => 'Karima',
            'email' => 'client3@test.com',
            'telephone' => '0634567890',
            'password' => Hash::make('password123'),
            'user_type' => 'Client',
            'email_verified_at' => now(),
        ]);
        Client::create([
            'user_id' => $client3->id,
            'adresse' => '789 Boulevard de la Liberté, Marrakech',
            'ville' => 'Marrakech',
            'code_postal' => '40000',
        ]);

        // Freelancer 1 (Homme)
        $freelancer1 = User::create([
            'nom' => 'Mohammed Saidi',
            'prenom' => 'Mohammed',
            'email' => 'freelancer1@test.com',
            'telephone' => '0645678901',
            'password' => Hash::make('password123'),
            'user_type' => 'Freelancer',
            'email_verified_at' => now(),
            'genre' => 'Homme',
        ]);
        Freelancer::create([
            'user_id' => $freelancer1->id,
            'statut_disponibilite' => 'Available',
            'note_moyenne' => 4.8,
            'nombre_missions' => 45,
            'nombre_avis' => 45,
        ]);

        // Freelancer 2 (Femme)
        $freelancer2 = User::create([
            'nom' => 'Laila Mansouri',
            'prenom' => 'Laila',
            'email' => 'freelancer2@test.com',
            'telephone' => '0656789012',
            'password' => Hash::make('password123'),
            'user_type' => 'Freelancer',
            'email_verified_at' => now(),
            'genre' => 'Femme',
        ]);
        Freelancer::create([
            'user_id' => $freelancer2->id,
            'statut_disponibilite' => 'Available',
            'note_moyenne' => 4.9,
            'nombre_missions' => 38,
            'nombre_avis' => 38,
        ]);

        // Freelancer 3 (Homme)
        $freelancer3 = User::create([
            'nom' => 'Hassan Chaoui',
            'prenom' => 'Hassan',
            'email' => 'freelancer3@test.com',
            'telephone' => '0667890123',
            'password' => Hash::make('password123'),
            'user_type' => 'Freelancer',
            'email_verified_at' => now(),
            'genre' => 'Homme',
        ]);
        Freelancer::create([
            'user_id' => $freelancer3->id,
            'statut_disponibilite' => 'Available',
            'note_moyenne' => 4.7,
            'nombre_missions' => 62,
            'nombre_avis' => 62,
        ]);
    }
}
