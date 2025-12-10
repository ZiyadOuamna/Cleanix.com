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
                'success' => false,
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

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Récupérer les commandes acceptées par ce freelancer
     */
    public function getAcceptedOrders(): JsonResponse
    {
        $freelancer = Auth::user();
        
        if ($freelancer->user_type !== 'Freelancer') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $orders = Order::where('freelancer_id', Auth::id())
            ->whereIn('status', ['accepted', 'in_progress'])
            ->with('client')
            ->orderBy('scheduled_date', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
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
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Créer une nouvelle commande (Client)
     */
    public function createOrder(Request $request): JsonResponse
    {
        $request->validate([
            'service_type' => 'required|string',
            'description' => 'required|string',
            'location' => 'required|string',
            'initial_price' => 'nullable|numeric|min:0',
            'scheduled_date' => 'required|date|after:now',
        ]);

        try {
            $order = Order::create([
                'client_id' => Auth::id(),
                'service_type' => $request->service_type,
                'description' => $request->description,
                'location' => $request->location,
                'initial_price' => $request->initial_price,
                'scheduled_date' => $request->scheduled_date,
                'status' => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $order
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
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
}
