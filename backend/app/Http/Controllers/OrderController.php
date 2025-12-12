<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderProposal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Récupérer les commandes reçues (pour freelancer)
     */
    public function getReceivedOrders(): JsonResponse
    {
        $freelancer = Auth::user();
        
        if ($freelancer->user_type !== 'Freelancer') {
            return response()->json([
                'message' => 'Unauthorized. Only freelancers can access this resource.'
            ], 403);
        }

        $orders = Order::where('status', 'pending')
            ->orWhere('status', 'negotiating')
            ->with(['client', 'proposals' => function ($query) {
                $query->where('freelancer_id', Auth::id());
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Récupérer les commandes acceptées par ce freelancer
     */
    public function getAcceptedOrders(): JsonResponse
    {
        $freelancer = Auth::user();
        
        if ($freelancer->user_type !== 'Freelancer') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $orders = Order::where('freelancer_id', Auth::id())
            ->whereIn('status', ['accepted', 'in_progress'])
            ->with('client')
            ->orderBy('scheduled_date', 'asc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Le freelancer accepte une commande reçue
     */
    public function acceptOrderAsFreelancer(Order $order): JsonResponse
    {
        $freelancer = Auth::user();

        // Vérifier que c'est un freelancer
        if ($freelancer->user_type !== 'Freelancer') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only freelancers can accept orders.'
            ], 403);
        }

        // Vérifier que la commande est en attente ou en négociation
        if (!in_array($order->status, ['pending', 'negotiating'])) {
            return response()->json([
                'success' => false,
                'message' => 'This order cannot be accepted. It must be pending or negotiating.'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Mettre à jour la commande
            $order->update([
                'freelancer_id' => $freelancer->id,
                'status' => 'accepted'
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order accepted successfully',
                'data' => $order->load('client')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer l'historique des commandes
     */
    public function getOrderHistory(): JsonResponse
    {
        $user = Auth::user();
        
        // Les freelancers voient leurs commandes terminées
        // Les clients voient toutes leurs commandes
        if ($user->user_type === 'Freelancer') {
            $orders = Order::where('freelancer_id', Auth::id())
                ->whereIn('status', ['completed', 'cancelled', 'rejected'])
                ->with('client')
                ->orderBy('completed_at', 'desc')
                ->paginate(15);
        } else {
            // Client
            $orders = Order::where('client_id', Auth::id())
                ->with('freelancer')
                ->orderBy('created_at', 'desc')
                ->paginate(15);
        }

        return response()->json([
            'data' => $orders->items(),
            'current_page' => $orders->currentPage(),
            'last_page' => $orders->lastPage(),
            'total' => $orders->total(),
            'per_page' => $orders->perPage()
        ]);
    }

    /**
     * Créer une nouvelle commande (Client)
     */
    public function createOrder(Request $request): JsonResponse
    {
        try {
            // Valider les données reçues
            $validated = $request->validate([
                'service_type' => 'required|string|max:255',
                'description' => 'nullable|string',
                'adresse' => 'required|string|max:255',
                'ville' => 'required|string|max:255',
                'code_postal' => 'nullable|string|max:10',
                'square_meters' => 'nullable|numeric|min:0',
                'number_of_rooms' => 'nullable|integer|min:0',
                'horaire_prefere' => 'nullable|in:Matin,Apres-midi,Soir',
                'genre_freelancer_prefere' => 'nullable|in:Homme,Femme,Pas de preference',
                'initial_price' => 'nullable|numeric|min:0',
                'scheduled_date' => 'required|date',
                'notes_speciales' => 'nullable|string',
            ]);

            // Assurer que client_id est défini
            if (!Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentification requise'
                ], 401);
            }

            // Chercher le service_id basé sur service_type
            $service = \App\Models\Service::where('nom', $validated['service_type'])->first();
            $service_id = $service ? $service->id : null;

            $order = Order::create([
                'client_id' => Auth::id(),
                'service_id' => $service_id, // Ajouter service_id
                'service_type' => $validated['service_type'],
                'description' => $validated['description'] ?? null,
                'adresse' => $validated['adresse'],
                'ville' => $validated['ville'],
                'code_postal' => $validated['code_postal'] ?? null,
                'square_meters' => $validated['square_meters'] ?? null,
                'number_of_rooms' => $validated['number_of_rooms'] ?? null,
                'horaire_prefere' => $validated['horaire_prefere'] ?? null,
                'genre_freelancer_prefere' => $validated['genre_freelancer_prefere'] ?? 'Pas de preference',
                'initial_price' => $validated['initial_price'] ?? null,
                'scheduled_date' => $validated['scheduled_date'],
                'notes_speciales' => $validated['notes_speciales'] ?? null,
                'status' => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Commande créée avec succès',
                'data' => $order->load('client')
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la commande: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Proposer un prix pour une commande
     */
    public function proposePrice(Request $request, Order $order): JsonResponse
    {
        $freelancer = Auth::user();

        if ($freelancer->user_type !== 'Freelancer') {
            return response()->json([
                'success' => false,
                'message' => 'Only freelancers can propose prices'
            ], 403);
        }

        $request->validate([
            'proposed_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'estimated_duration_hours' => 'nullable|integer|min:1',
            'estimated_completion_date' => 'nullable|date|after:now'
        ]);

        try {
            DB::beginTransaction();

            // Créer la proposition
            $proposal = OrderProposal::create([
                'order_id' => $order->id,
                'freelancer_id' => Auth::id(),
                'proposed_price' => $request->proposed_price,
                'description' => $request->description,
                'estimated_duration_hours' => $request->estimated_duration_hours,
                'estimated_completion_date' => $request->estimated_completion_date,
                'status' => 'pending'
            ]);

            // Mettre à jour le statut de la commande en "negotiating" si elle est encore "pending"
            if ($order->status === 'pending') {
                $order->update(['status' => 'negotiating']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Price proposal submitted successfully',
                'data' => $proposal
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit proposal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Accepter une proposition (Client accepte la proposition du freelancer)
     */
    public function acceptProposal(OrderProposal $proposal): JsonResponse
    {
        $client = Auth::user();

        if ($proposal->order->client_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            DB::beginTransaction();

            // Mettre à jour la proposition
            $proposal->update(['status' => 'accepted']);

            // Mettre à jour la commande
            $order = $proposal->order;
            $order->update([
                'freelancer_id' => $proposal->freelancer_id,
                'service_id' => $order->service_id, // S'assurer que service_id est défini
                'agreed_price' => $proposal->proposed_price,
                'status' => 'accepted'
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Proposal accepted successfully',
                'data' => [
                    'proposal' => $proposal,
                    'order' => $order
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept proposal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refuser une proposition (Client refuse la proposition du freelancer)
     */
    public function rejectProposal(OrderProposal $proposal): JsonResponse
    {
        $client = Auth::user();

        if ($proposal->order->client_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $proposal->update(['status' => 'rejected']);

            return response()->json([
                'success' => true,
                'message' => 'Proposal rejected'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject proposal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Annuler la proposition (Freelancer annule sa proposition)
     */
    public function cancelProposal(OrderProposal $proposal): JsonResponse
    {
        $freelancer = Auth::user();

        if ($proposal->freelancer_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $proposal->update(['status' => 'cancelled']);

            return response()->json([
                'success' => true,
                'message' => 'Proposal cancelled'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel proposal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Commencer une commande (Freelancer commence le travail)
     */
    public function startOrder(Order $order): JsonResponse
    {
        if ($order->freelancer_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $order->update(['status' => 'in_progress']);

            return response()->json([
                'success' => true,
                'message' => 'Order started',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Terminer une commande (Freelancer termine le travail)
     */
    public function completeOrder(Request $request, Order $order): JsonResponse
    {
        if ($order->freelancer_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'photos_after' => 'nullable|array',
            'notes' => 'nullable|string'
        ]);

        try {
            $order->update([
                'status' => 'completed',
                'completed_at' => now(),
                'photos_after' => $request->photos_after,
                'notes' => $request->notes
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order completed successfully',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ajouter un avis à une commande (Client)
     */
    public function addReview(Request $request, Order $order): JsonResponse
    {
        if ($order->client_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'review' => 'nullable|string'
        ]);

        try {
            $order->update([
                'rating' => $request->rating,
                'review' => $request->review
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Review added successfully',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Annuler une commande
     */
    public function cancelOrder(Request $request, Order $order): JsonResponse
    {
        // Seul le client peut annuler une commande pending ou negotiating
        if ($order->client_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        if (!in_array($order->status, ['pending', 'negotiating'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel an order with status: ' . $order->status
            ], 400);
        }

        try {
            $order->update(['status' => 'cancelled']);

            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Demander un remboursement pour une commande
     */
    public function requestRefund(Order $order, Request $request): JsonResponse
    {
        $client = Auth::user();

        if ($order->client_id !== $client->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
            'amount' => 'required|numeric|min:0|max:' . ($order->agreed_price ?? $order->initial_price)
        ]);

        try {
            DB::beginTransaction();

            // Créer une transaction de remboursement
            $wallet = \App\Models\Wallet::firstOrCreate(
                ['user_id' => $client->id],
                ['balance' => 0, 'pending' => 0]
            );

            $refund = \App\Models\Transaction::create([
                'wallet_id' => $wallet->id,
                'user_id' => $client->id,
                'type' => 'refund',
                'montant' => $validated['amount'],
                'description' => 'Remboursement - ' . $validated['reason'],
                'statut' => 'en_attente',
                'compte_bancaire' => null
            ]);

            // Mettre à jour la commande
            $order->update([
                'status' => 'refund_requested',
                'notes' => $validated['reason']
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Remboursement demandé avec succès',
                'data' => [
                    'order' => $order,
                    'transaction' => $refund
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la demande de remboursement: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approuver un remboursement (Admin/Superviseur)
     */
    public function approveRefund(Order $order): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            DB::beginTransaction();

            // Mettre à jour la transaction associée
            $transaction = \App\Models\Transaction::where('description', 'like', '%Remboursement%')
                ->where('user_id', $order->client_id)
                ->latest()
                ->first();

            if ($transaction) {
                $transaction->update(['statut' => 'validee']);

                // Créditer le wallet du client
                $wallet = \App\Models\Wallet::where('user_id', $order->client_id)->first();
                if ($wallet) {
                    $wallet->update([
                        'balance' => $wallet->balance + $transaction->montant,
                        'pending' => max(0, $wallet->pending - $transaction->montant)
                    ]);
                }
            }

            // Mettre à jour la commande
            $order->update([
                'status' => 'refunded'
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Remboursement approuvé',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'approbation du remboursement: ' . $e->getMessage()
            ], 500);
        }
    }
}
