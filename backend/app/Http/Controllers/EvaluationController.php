<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class EvaluationController extends Controller
{
    /**
     * Lister les évaluations
     */
    public function index(): JsonResponse
    {
        try {
            $evaluations = Evaluation::with(['client', 'freelancer'])
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $evaluations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch evaluations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Voir une évaluation
     */
    public function show(Evaluation $evaluation): JsonResponse
    {
        try {
            $evaluation->load(['client', 'freelancer', 'commande']);

            return response()->json([
                'success' => true,
                'data' => $evaluation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Evaluation not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Créer une évaluation pour une commande
     */
    public function store(Request $request, Order $order): JsonResponse
    {
        $user = Auth::user();

        // Vérifier que l'utilisateur est le client de la commande
        if ($order->client_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only evaluate your own orders'
            ], 403);
        }

        // Vérifier que la commande est terminée
        if ($order->status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'You can only evaluate completed orders'
            ], 400);
        }

        // Vérifier qu'il n'y a pas déjà une évaluation
        $existingEval = Evaluation::where('order_id', $order->id)
            ->where('client_id', $user->id)
            ->first();

        if ($existingEval) {
            return response()->json([
                'success' => false,
                'message' => 'You have already evaluated this order'
            ], 400);
        }

        $validated = $request->validate([
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:1000',
        ]);

        try {
            $evaluation = Evaluation::create([
                'order_id' => $order->id,
                'client_id' => $user->id,
                'freelancer_id' => $order->freelancer_id,
                'note' => $validated['note'],
                'commentaire' => $validated['commentaire'],
            ]);

            // Mettre à jour la note de la commande
            $order->update([
                'rating' => $validated['note'],
                'review' => $validated['commentaire']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Evaluation created successfully',
                'data' => $evaluation
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create evaluation: ' . $e->getMessage()
            ], 500);
        }
    }
}
