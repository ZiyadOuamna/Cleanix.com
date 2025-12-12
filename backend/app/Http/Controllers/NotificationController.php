<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Liste les notifications de l'utilisateur
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();

        try {
            $notifications = Notification::where('user_id', $user->id)
                ->orderBy('date_envoi', 'desc')
                ->paginate(20);

            return response()->json([
                'data' => $notifications->items(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch notifications: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère les notifications non lues
     */
    public function unread(): JsonResponse
    {
        $user = Auth::user();

        try {
            $notifications = Notification::where('user_id', $user->id)
                ->where('est_lue', false)
                ->orderBy('date_envoi', 'desc')
                ->get();

            return response()->json([
                'data' => $notifications,
                'count' => $notifications->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch unread notifications: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        $user = Auth::user();

        if ($notification->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $notification->marquerCommeLue();

            return response()->json([
                'message' => 'Notification marked as read',
                'data' => $notification
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update notification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead(): JsonResponse
    {
        $user = Auth::user();

        try {
            Notification::where('user_id', $user->id)
                ->where('est_lue', false)
                ->update(['est_lue' => true]);

            return response()->json([
                'message' => 'All notifications marked as read'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update notifications: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une notification
     */
    public function destroy(Notification $notification): JsonResponse
    {
        $user = Auth::user();

        if ($notification->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $notification->delete();

            return response()->json([
                'message' => 'Notification deleted'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete notification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Résumé des notifications par type (pour chaque type d'utilisateur)
     */
    public function summary(): JsonResponse
    {
        $user = Auth::user();

        try {
            $types = ['Commande', 'Paiement', 'Evaluation', 'Reclamation', 'Systeme'];
            $summary = [];

            foreach ($types as $type) {
                $unreadCount = Notification::where('user_id', $user->id)
                    ->where('type', $type)
                    ->where('est_lue', false)
                    ->count();

                $totalCount = Notification::where('user_id', $user->id)
                    ->where('type', $type)
                    ->count();

                $summary[] = [
                    'type' => $type,
                    'unread_count' => $unreadCount,
                    'total_count' => $totalCount
                ];
            }

            return response()->json([
                'data' => $summary,
                'user_type' => $user->user_type
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch notification summary: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les notifications par type spécifique
     */
    public function getByType($type): JsonResponse
    {
        $user = Auth::user();

        try {
            $validTypes = ['Commande', 'Paiement', 'Evaluation', 'Reclamation', 'Systeme'];

            if (!in_array($type, $validTypes)) {
                return response()->json([
                    'message' => 'Type de notification invalide'
                ], 400);
            }

            $notifications = Notification::where('user_id', $user->id)
                ->where('type', $type)
                ->orderBy('date_envoi', 'desc')
                ->paginate(20);

            return response()->json([
                'data' => $notifications->items(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch notifications: ' . $e->getMessage()
            ], 500);
        }
    }
}
