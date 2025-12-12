<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\ReclamationController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\SuperviseurController;
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

// NOTE: Les superviseurs ne font pas de vérification d'email
// Ils accèdent directement après connexion avec contrôle d'accès par rôle

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

    // ========== ROUTES SETTINGS ==========
    
    // Get user settings
    Route::get('/settings', [SettingsController::class, 'getSettings']);
    
    // Send email verification code
    Route::post('/settings/send-email-code', [SettingsController::class, 'sendVerificationEmail']);
    
    // Confirm email code
    Route::post('/settings/confirm-email-code', [SettingsController::class, 'confirmEmailCode']);
    
    // Change password
    Route::post('/settings/change-password', [SettingsController::class, 'changePassword']);
    
    // Update notification settings
    Route::put('/settings/notifications', [SettingsController::class, 'updateNotificationSettings']);
    
    // Update privacy settings
    Route::put('/settings/privacy', [SettingsController::class, 'updatePrivacySettings']);
    
    // Update availability settings
    Route::put('/settings/availability', [SettingsController::class, 'updateAvailabilitySettings']);
    
    // Update bank info
    Route::put('/settings/bank-info', [SettingsController::class, 'updateBankInfo']);
    
    // Upload identity documents
    Route::post('/settings/upload-identity', [SettingsController::class, 'uploadIdentityDocuments']);

    // ========== ROUTES WALLET ==========
    
    // Get wallet
    Route::get('/wallet', [WalletController::class, 'getWallet']);
    
    // Get transactions
    Route::get('/wallet/transactions', [WalletController::class, 'getTransactions']);
    
    // Get payment methods
    Route::get('/wallet/payment-methods', [WalletController::class, 'getPaymentMethods']);
    
    // Add payment method
    Route::post('/wallet/payment-methods', [WalletController::class, 'addPaymentMethod']);
    
    // Request withdrawal
    Route::post('/wallet/withdraw', [WalletController::class, 'requestWithdrawal']);

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

    // ========== ROUTES SERVICES ==========
    
    // Lister tous les services
    Route::get('/services', [ServiceController::class, 'index']);
    
    // Voir un service spécifique
    Route::get('/services/{service}', [ServiceController::class, 'show']);
    
    // Services du freelancer connecté
    Route::get('/my-services', [ServiceController::class, 'getFreelancerServices']);
    
    // Créer un service (Freelancer)
    Route::post('/services', [ServiceController::class, 'store']);
    
    // Modifier un service (Freelancer/Superviseur)
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    
    // Supprimer un service (Freelancer/Superviseur)
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    // ========== ROUTES SUPERVISEUR VALIDATION SERVICES ==========
    
    // Récupérer les services en attente de validation (Superviseur)
    Route::get('/superviseur/services/pending', [ServiceController::class, 'getPendingServices']);
    
    // Approuver un service (Superviseur)
    Route::post('/superviseur/services/{service}/approve', [ServiceController::class, 'approveService']);
    
    // Rejeter un service (Superviseur)
    Route::post('/superviseur/services/{service}/reject', [ServiceController::class, 'rejectService']);

    // ========== ROUTES NOTIFICATIONS ==========
    
    // Lister les notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    
    // Notifications non lues
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    
    // Marquer comme lue
    Route::put('/notifications/{notification}', [NotificationController::class, 'markAsRead']);
    
    // Marquer tout comme lu
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    
    // Supprimer une notification
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    // ========== ROUTES ÉVALUATIONS ==========
    
    // Lister les évaluations
    Route::get('/evaluations', [EvaluationController::class, 'index']);
    
    // Évaluer une commande
    Route::post('/orders/{order}/evaluate', [EvaluationController::class, 'store']);
    
    // Voir une évaluation
    Route::get('/evaluations/{evaluation}', [EvaluationController::class, 'show']);

    // ========== ROUTES RÉCLAMATIONS ==========
    
    // Lister les réclamations de l'utilisateur
    Route::get('/reclamations', [ReclamationController::class, 'index']);
    
    // Créer une réclamation
    Route::post('/reclamations', [ReclamationController::class, 'store']);
    
    // Voir une réclamation
    Route::get('/reclamations/{reclamation}', [ReclamationController::class, 'show']);
    
    // Répondre à une réclamation (Support)
    Route::put('/reclamations/{reclamation}', [ReclamationController::class, 'respond']);
    
    // Lister toutes les réclamations (Support/Superviseur)
    Route::get('/all-reclamations', [ReclamationController::class, 'all']);

    // ========== ROUTES PAIEMENTS ==========
    
    // Lister les paiements
    Route::get('/payments', [PaiementController::class, 'index']);
    
    // Créer un paiement
    Route::post('/payments', [PaiementController::class, 'store']);
    
    // Voir un paiement
    Route::get('/payments/{paiement}', [PaiementController::class, 'show']);
    
    // Confirmer un paiement
    Route::post('/payments/{paiement}/confirm', [PaiementController::class, 'confirm']);
    
    // Rembourser un paiement
    Route::post('/payments/{paiement}/refund', [PaiementController::class, 'refund']);

    // ========== ROUTES SUPERVISEUR ==========
    
    // Clients management
    Route::get('/superviseur/clients', [SuperviseurController::class, 'getClients']);
    Route::post('/superviseur/clients', [SuperviseurController::class, 'createClient']);
    Route::get('/superviseur/clients/{clientId}', [SuperviseurController::class, 'getClientById']);
    Route::put('/superviseur/clients/{clientId}', [SuperviseurController::class, 'updateClient']);
    Route::delete('/superviseur/clients/{clientId}', [SuperviseurController::class, 'deleteClient']);
    
    // Freelancers management
    Route::get('/superviseur/freelancers', [SuperviseurController::class, 'getFreelancers']);
    Route::post('/superviseur/freelancers', [SuperviseurController::class, 'createFreelancer']);
    Route::get('/superviseur/freelancers/{freelancerId}', [SuperviseurController::class, 'getFreelancerById']);
    Route::put('/superviseur/freelancers/{freelancerId}', [SuperviseurController::class, 'updateFreelancer']);
    Route::delete('/superviseur/freelancers/{freelancerId}', [SuperviseurController::class, 'deleteFreelancer']);
    
    // Dashboard stats
    Route::get('/superviseur/dashboard/stats', [SuperviseurController::class, 'getDashboardStats']);
    Route::get('/superviseur/stats/users', [SuperviseurController::class, 'getUsersStats']);
    Route::get('/superviseur/stats/transactions', [SuperviseurController::class, 'getTransactionStats']);
    
    // Reclamations management
    Route::get('/superviseur/reclamations', [SuperviseurController::class, 'getReclamations']);
    Route::get('/superviseur/reclamations/{reclamationId}', [SuperviseurController::class, 'getReclamationById']);
    Route::put('/superviseur/reclamations/{reclamationId}', [SuperviseurController::class, 'updateReclamation']);
    Route::post('/superviseur/reclamations/{reclamationId}/resolve', [SuperviseurController::class, 'resolveReclamation']);
    
    // Payments management
    Route::get('/superviseur/payments', [SuperviseurController::class, 'getPayments']);
    Route::get('/superviseur/payments/{paymentId}', [SuperviseurController::class, 'getPaymentById']);
    Route::post('/superviseur/payments/{paymentId}/refund', [SuperviseurController::class, 'processRefund']);
    
    // Orders management
    Route::get('/superviseur/orders', [SuperviseurController::class, 'getOrders']);
    Route::get('/superviseur/orders/{orderId}', [SuperviseurController::class, 'getOrderById']);
    Route::put('/superviseur/orders/{orderId}', [SuperviseurController::class, 'updateOrderStatus']);
    
    // Superviseur management (only for main superviseur)
    Route::get('/superviseur/superviseurs', [SuperviseurController::class, 'getSuperviseurs']);
    Route::post('/superviseur/superviseurs', [SuperviseurController::class, 'createSuperviseur']);
    Route::get('/superviseur/superviseurs/{superviseurId}', [SuperviseurController::class, 'getSuperviseurById']);
    Route::put('/superviseur/superviseurs/{superviseurId}', [SuperviseurController::class, 'updateSuperviseur']);
    Route::delete('/superviseur/superviseurs/{superviseurId}', [SuperviseurController::class, 'deleteSuperviseur']);
});
