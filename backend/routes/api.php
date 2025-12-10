<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
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
    
    // Créer un superviseur (Superviseurs uniquement)
    Route::post('/create-superviseur', [AuthController::class, 'createSuperviseur']);

    // ========== ROUTES COMMANDES (Orders) ==========
    
    // Commandes reçues (Freelancer)
    Route::get('/orders/received', [OrderController::class, 'getReceivedOrders']);
    
    // Commandes acceptées (Freelancer)
    Route::get('/orders/accepted', [OrderController::class, 'getAcceptedOrders']);
    
    // Historique des commandes
    Route::get('/orders/history', [OrderController::class, 'getOrderHistory']);
    
    // Créer une commande (Client)
    Route::post('/orders', [OrderController::class, 'createOrder']);
    
    // Proposer un prix pour une commande (Freelancer)
    Route::post('/orders/{order}/propose', [OrderController::class, 'proposePrice']);
    
    // Accepter une proposition (Client)
    Route::post('/proposals/{proposal}/accept', [OrderController::class, 'acceptProposal']);
    
    // Refuser une proposition (Client)
    Route::post('/proposals/{proposal}/reject', [OrderController::class, 'rejectProposal']);
    
    // Annuler une proposition (Freelancer)
    Route::post('/proposals/{proposal}/cancel', [OrderController::class, 'cancelProposal']);
    
    // Commencer une commande (Freelancer)
    Route::post('/orders/{order}/start', [OrderController::class, 'startOrder']);
    
    // Terminer une commande (Freelancer)
    Route::post('/orders/{order}/complete', [OrderController::class, 'completeOrder']);
    
    // Ajouter un avis (Client)
    Route::post('/orders/{order}/review', [OrderController::class, 'addReview']);
    
    // Annuler une commande (Client)
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancelOrder']);
});