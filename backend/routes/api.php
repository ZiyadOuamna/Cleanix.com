<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ========== ROUTES PUBLIQUES ==========

// Inscription (Client et Freelancer uniquement)
Route::post('/register', [AuthController::class, 'register']);

// Connexion (tous les types)
Route::post('/login', [AuthController::class, 'login']);

// Mot de passe oublié
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// ========== ROUTES PROTÉGÉES (authentification requise) ==========

Route::middleware('auth:sanctum')->group(function () {
    
    // Récupérer l'utilisateur connecté
    Route::get('/user', [AuthController::class, 'user']);
    
    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Rafraîchir le token
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    
    // Mettre à jour le profil
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile', [AuthController::class, 'updateProfile']); // Pour les fichiers
    
    // Changer le mot de passe
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Changer le statut (Freelancers uniquement)
    Route::post('/change-statut', [AuthController::class, 'changeStatut']);
});