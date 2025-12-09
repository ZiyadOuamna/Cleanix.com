<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Superviseur;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Exception;

class CreateSuperviseur extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'superviseur:create {--email=} {--password=} {--nom=} {--prenom=} {--telephone=}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Create a new Superviseur user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            // Get input
            $email = $this->option('email') ?? $this->ask('Enter email');
            $password = $this->option('password') ?? $this->secret('Enter password');
            $nom = $this->option('nom') ?? $this->ask('Enter nom');
            $prenom = $this->option('prenom') ?? $this->ask('Enter prenom');
            $telephone = $this->option('telephone') ?? $this->ask('Enter telephone');
            $genre = $this->choice('Select gender', ['Homme', 'Femme']);

            // Check if email already exists
            if (User::where('email', $email)->exists()) {
                $this->error('Email already exists!');
                return Command::FAILURE;
            }

            // Check if telephone already exists
            if (User::where('telephone', $telephone)->exists()) {
                $this->error('Telephone already exists!');
                return Command::FAILURE;
            }

            DB::beginTransaction();

            try {
                // Create user
                $user = User::create([
                    'nom' => $nom,
                    'prenom' => $prenom,
                    'email' => $email,
                    'password' => Hash::make($password),
                    'genre' => $genre,
                    'telephone' => $telephone,
                    'user_type' => 'Superviseur',
                    'photo_profil' => null,
                ]);

                // Create superviseur profile
                Superviseur::create([
                    'user_id' => $user->id,
                    'niveau_acces' => 'Superviseur',
                ]);

                DB::commit();

                $this->info('Superviseur created successfully!');
                $this->line('');
                $this->table(
                    ['Field', 'Value'],
                    [
                        ['ID', $user->id],
                        ['Name', $user->nom . ' ' . $user->prenom],
                        ['Email', $user->email],
                        ['Telephone', $user->telephone],
                        ['Gender', $user->genre],
                        ['Type', $user->user_type],
                    ]
                );

                return Command::SUCCESS;

            } catch (Exception $e) {
                DB::rollBack();
                $this->error('Error creating superviseur: ' . $e->getMessage());
                return Command::FAILURE;
            }

        } catch (Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
