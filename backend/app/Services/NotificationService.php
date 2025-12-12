<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Models\Order;

class NotificationService
{
    /**
     * Créer une notification pour un utilisateur
     */
    public static function create($userId, $titre, $message, $type = 'Systeme')
    {
        return Notification::create([
            'user_id' => $userId,
            'titre' => $titre,
            'message' => $message,
            'type' => $type,
            'est_lue' => false,
            'date_envoi' => now()
        ]);
    }

    /**
     * Notifier un client quand une commande est créée
     */
    public static function notifyClientOrderCreated(Order $order): void
    {
        self::create(
            $order->client_id,
            'Commande créée',
            "Votre commande de {$order->service_type} a été créée avec succès. Attendez les propositions des freelancers.",
            'Commande'
        );
    }

    /**
     * Notifier les freelancers d'une nouvelle demande
     */
    public static function notifyFreelancersNewOrder(Order $order): void
    {
        // Récupérer les freelancers actifs du même domaine
        $freelancers = User::where('user_type', 'Freelancer')
            ->where('statut', 'actif')
            ->get();

        foreach ($freelancers as $freelancer) {
            self::create(
                $freelancer->id,
                'Nouvelle demande de service',
                "Une nouvelle demande de {$order->service_type} a été créée à {$order->ville}. Consultez-la pour proposer un prix.",
                'Commande'
            );
        }
    }

    /**
     * Notifier un client quand un freelancer propose un prix
     */
    public static function notifyClientProposalReceived(Order $order, User $freelancer): void
    {
        self::create(
            $order->client_id,
            'Proposition reçue',
            "{$freelancer->firstname} {$freelancer->lastname} a proposé un prix pour votre commande de {$order->service_type}.",
            'Commande'
        );
    }

    /**
     * Notifier un freelancer que sa proposition a été acceptée
     */
    public static function notifyFreelancerProposalAccepted(Order $order): void
    {
        if ($order->freelancer_id) {
            self::create(
                $order->freelancer_id,
                'Proposition acceptée',
                "Votre proposition pour la commande de {$order->service_type} a été acceptée. Préparez-vous pour le service.",
                'Commande'
            );
        }
    }

    /**
     * Notifier un freelancer que sa proposition a été rejetée
     */
    public static function notifyFreelancerProposalRejected(Order $order): void
    {
        if ($order->freelancer_id) {
            self::create(
                $order->freelancer_id,
                'Proposition rejetée',
                "Votre proposition pour la commande de {$order->service_type} a été rejetée.",
                'Commande'
            );
        }
    }

    /**
     * Notifier un client quand le service est commencé
     */
    public static function notifyClientServiceStarted(Order $order): void
    {
        self::create(
            $order->client_id,
            'Service en cours',
            "Le service de {$order->service_type} a commencé. Le freelancer est sur place.",
            'Commande'
        );
    }

    /**
     * Notifier un client quand le service est terminé
     */
    public static function notifyClientServiceCompleted(Order $order): void
    {
        self::create(
            $order->client_id,
            'Service terminé',
            "Le service de {$order->service_type} est terminé. Veuillez vérifier le travail et laisser un avis.",
            'Commande'
        );
    }

    /**
     * Notifier un freelancer qu'il a reçu une évaluation
     */
    public static function notifyFreelancerEvaluationReceived(User $freelancer, Order $order, float $rating): void
    {
        self::create(
            $freelancer->id,
            'Nouvelle évaluation',
            "Vous avez reçu une évaluation de {$rating}/5 pour la commande de {$order->service_type}.",
            'Evaluation'
        );
    }

    /**
     * Notifier un superviseur d'une réclamation
     */
    public static function notifySuperviseurReclamation(int $superviseurId, string $subject, string $details): void
    {
        self::create(
            $superviseurId,
            'Nouvelle réclamation',
            $subject . ': ' . $details,
            'Reclamation'
        );
    }

    /**
     * Notifier un client d'une résolution de réclamation
     */
    public static function notifyClientReclamationResolved(int $clientId, string $resolution): void
    {
        self::create(
            $clientId,
            'Réclamation résolue',
            'Votre réclamation a été résolue: ' . $resolution,
            'Reclamation'
        );
    }

    /**
     * Notifier un utilisateur de mises à jour de paiement
     */
    public static function notifyPaymentUpdate(int $userId, string $status, float $amount): void
    {
        $message = match($status) {
            'completed' => "Paiement de {$amount}DH complété avec succès.",
            'pending' => "Paiement de {$amount}DH en attente de confirmation.",
            'failed' => "Paiement de {$amount}DH a échoué. Veuillez réessayer.",
            default => "Mise à jour de paiement: {$status}"
        };

        self::create(
            $userId,
            'Notification de paiement',
            $message,
            'Paiement'
        );
    }

    /**
     * Notifier un superviseur d'une action système importante
     */
    public static function notifySuperviseurSystemAlert(string $titre, string $message): void
    {
        // Notifier tous les superviseurs
        $superviseurs = User::where('user_type', 'Superviseur')->get();
        
        foreach ($superviseurs as $superviseur) {
            self::create(
                $superviseur->id,
                $titre,
                $message,
                'Systeme'
            );
        }
    }

    /**
     * Récupérer les notifications filtées par type d'utilisateur
     */
    public static function getNotificationsByUserType(User $user, $type = null)
    {
        $query = Notification::where('user_id', $user->id);

        if ($type) {
            $query->where('type', $type);
        }

        return $query->orderBy('date_envoi', 'desc')->get();
    }

    /**
     * Récupérer le nombre de notifications non lues par type
     */
    public static function getUnreadCountByType(User $user)
    {
        $types = ['Commande', 'Paiement', 'Evaluation', 'Reclamation', 'Systeme'];
        $counts = [];

        foreach ($types as $type) {
            $counts[$type] = Notification::where('user_id', $user->id)
                ->where('type', $type)
                ->where('est_lue', false)
                ->count();
        }

        return $counts;
    }
}
