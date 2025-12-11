<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ServiceController extends Controller
{
    /**
     * Liste tous les services
     */
    public function index(): JsonResponse
    {
        try {
            $services = Service::where('est_actif', true)
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $services
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch services: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère un service spécifique
     */
    public function show(Service $service): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $service
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Crée un nouveau service (freelancer)
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'Freelancer') {
            return response()->json([
                'success' => false,
                'message' => 'Only freelancers can create services'
            ], 403);
        }

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'duree_prevue' => 'nullable|integer|min:1',
            'adresse' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        try {
            // Gérer l'upload d'image
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('services', 'public');
            }

            $service = Service::create([
                'nom' => $validated['nom'],
                'description' => $validated['description'],
                'prix' => $validated['prix'],
                'duree_prevue' => $validated['duree_prevue'],
                'adresse' => $validated['adresse'],
                'image' => $imagePath,
                'est_actif' => true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Service created successfully',
                'data' => $service
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create service: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Modifie un service
     */
    public function update(Request $request, Service $service): JsonResponse
    {
        $user = Auth::user();

        // Vérifier que le user est autorisé (c'est le créateur ou admin)
        if ($user->user_type !== 'Freelancer' && $user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'nom' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'nullable|numeric|min:0',
            'duree_prevue' => 'nullable|integer|min:1',
            'adresse' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'est_actif' => 'nullable|boolean',
        ]);

        try {
            // Gérer l'upload d'image
            if ($request->hasFile('image')) {
                $validated['image'] = $request->file('image')->store('services', 'public');
            }

            $service->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Service updated successfully',
                'data' => $service
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update service: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime un service
     */
    public function destroy(Service $service): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'Freelancer' && $user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            // Soft delete - marquer comme inactif plutôt que de supprimer
            $service->update(['est_actif' => false]);

            return response()->json([
                'success' => true,
                'message' => 'Service deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete service: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère les services d'un freelancer
     */
    public function getFreelancerServices(): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'Freelancer') {
            return response()->json([
                'success' => false,
                'message' => 'Only freelancers can access this resource'
            ], 403);
        }

        try {
            $services = Service::where('est_actif', true)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $services
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch services: ' . $e->getMessage()
            ], 500);
        }
    }
}
