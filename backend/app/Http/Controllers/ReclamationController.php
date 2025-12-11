<?php

namespace App\Http\Controllers;

use App\Models\Reclamation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ReclamationController extends Controller
{
    /**
     * Lister les réclamations de l'utilisateur
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();

        try {
            $reclamations = Reclamation::where('user_id', $user->id)
                ->orderBy('date_ouverture', 'desc')
                ->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $reclamations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reclamations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lister toutes les réclamations (Support/Superviseur)
     */
    public function all(): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'Support' && $user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $reclamations = Reclamation::with(['user', 'commande'])
                ->orderBy('date_ouverture', 'desc')
                ->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $reclamations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reclamations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Voir une réclamation
     */
    public function show(Reclamation $reclamation): JsonResponse
    {
        $user = Auth::user();

        // Vérifier l'autorisation
        if ($reclamation->user_id !== $user->id && $user->user_type !== 'Support' && $user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $reclamation->load(['user', 'commande', 'support']);

            return response()->json([
                'success' => true,
                'data' => $reclamation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Reclamation not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Créer une réclamation
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'commande_id' => 'nullable|exists:orders,id',
            'sujet' => 'required|string|max:255',
            'message' => 'required|string|min:10',
        ]);

        try {
            $reclamation = Reclamation::create([
                'user_id' => $user->id,
                'commande_id' => $validated['commande_id'],
                'sujet' => $validated['sujet'],
                'message' => $validated['message'],
                'statut' => Reclamation::STATUT_OUVERTE,
                'date_ouverture' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Reclamation created successfully',
                'data' => $reclamation
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create reclamation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Répondre à une réclamation (Support)
     */
    public function respond(Request $request, Reclamation $reclamation): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'Support' && $user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Only support can respond to reclamations'
            ], 403);
        }

        $validated = $request->validate([
            'reponse' => 'required|string|min:10',
            'statut' => 'nullable|in:En cours,Resolue,Fermee',
        ]);

        try {
            $reclamation->update([
                'reponse' => $validated['reponse'],
                'support_id' => $user->id,
                'statut' => $validated['statut'] ?? Reclamation::STATUT_EN_COURS,
                'date_resolution' => in_array($validated['statut'] ?? '', [Reclamation::STATUT_RESOLUE, Reclamation::STATUT_FERMEE]) ? now() : null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Reclamation updated successfully',
                'data' => $reclamation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update reclamation: ' . $e->getMessage()
            ], 500);
        }
    }
}
