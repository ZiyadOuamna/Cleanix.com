<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PaiementController extends Controller
{
    /**
     * Lister les paiements de l'utilisateur
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();

        try {
            $paiements = Paiement::where('client_id', $user->id)
                ->orderBy('date_paiement', 'desc')
                ->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $paiements
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payments: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Voir un paiement
     */
    public function show(Paiement $paiement): JsonResponse
    {
        $user = Auth::user();

        if ($paiement->client_id !== $user->id && $user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $paiement->load('commande');

            return response()->json([
                'success' => true,
                'data' => $paiement
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Créer un paiement
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'montant' => 'required|numeric|min:0',
            'methode_paiement' => 'required|in:Portefeuille,Carte bancaire,Virement,Especes',
            'transaction_id' => 'nullable|string',
            'details' => 'nullable|array',
        ]);

        try {
            $paiement = Paiement::create([
                'order_id' => $validated['order_id'],
                'client_id' => $user->id,
                'montant' => $validated['montant'],
                'methode_paiement' => $validated['methode_paiement'],
                'statut' => Paiement::STATUT_EN_ATTENTE,
                'transaction_id' => $validated['transaction_id'],
                'details' => $validated['details'],
                'date_paiement' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment created successfully',
                'data' => $paiement
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirmer un paiement
     */
    public function confirm(Paiement $paiement): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Only supervisors can confirm payments'
            ], 403);
        }

        try {
            $paiement->marquerReussie();

            return response()->json([
                'success' => true,
                'message' => 'Payment confirmed successfully',
                'data' => $paiement
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to confirm payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rembourser un paiement
     */
    public function refund(Paiement $paiement): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Only supervisors can refund payments'
            ], 403);
        }

        if ($paiement->statut !== Paiement::STATUT_REUSSIE) {
            return response()->json([
                'success' => false,
                'message' => 'Only successful payments can be refunded'
            ], 400);
        }

        try {
            $paiement->rembourser();

            return response()->json([
                'success' => true,
                'message' => 'Payment refunded successfully',
                'data' => $paiement
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to refund payment: ' . $e->getMessage()
            ], 500);
        }
    }
}
