<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\NettoyageResidentiel;
use App\Models\NettoyageSuperficie;
use App\Models\NettoyageUnitaire;
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

        // Validation de base commune à tous les services
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'serviceType' => 'required|in:residentiel,superficie,unitaire',
            'description' => 'required|string',
            'detailedDescription' => 'nullable|string',
            'zones' => 'required|array|min:1',
            'zones.*' => 'string',
            'availability' => 'required|array',
            'includedItems' => 'required|array|min:1',
            'includedItems.*' => 'string',
            'termsAccepted' => 'required|boolean',
            'pricingAccepted' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
            // Champs spécifiques résidentiel
            'nombrePieces' => 'required_if:serviceType,residentiel|nullable|integer|min:1',
            'superficieTotale' => 'required_if:serviceType,residentiel|nullable|numeric|min:0.01',
            // Champs spécifiques superficie
            'superficie' => 'required_if:serviceType,superficie|nullable|numeric|min:0.01',
            // Champs spécifiques unitaire
            'nomObjet' => 'required_if:serviceType,unitaire|nullable|string|max:255',
            'prixObjet' => 'required_if:serviceType,unitaire|nullable|numeric|min:0.01',
        ]);

        // Vérifier que les checkboxes sont cochées (true)
        if (!$validated['termsAccepted'] || !$validated['pricingAccepted']) {
            return response()->json([
                'success' => false,
                'message' => 'You must accept the terms and pricing conditions.'
            ], 422);
        }

        try {
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('services', 'public');
            }

            // Créer le service de base
            $service = Service::create([
                'freelancer_id' => $user->id,
                'nom' => $validated['name'],
                'category' => $validated['category'],
                'description' => $validated['description'],
                'detailed_description' => $validated['detailedDescription'] ?? null,
                'zones' => $validated['zones'],
                'availability' => $validated['availability'],
                'included_items' => $validated['includedItems'],
                'image' => $imagePath,
                'est_actif' => true,
                'status' => 'pending_review',
            ]);

            // Créer l'enregistrement spécialisé selon le type
            switch($validated['serviceType']) {
                case 'residentiel':
                    NettoyageResidentiel::create([
                        'service_id' => $service->id,
                        'nombre_pieces' => $validated['nombrePieces'],
                        'superficie_totale' => $validated['superficieTotale'],
                    ]);
                    break;
                case 'superficie':
                    NettoyageSuperficie::create([
                        'service_id' => $service->id,
                        'superficie' => $validated['superficie'],
                    ]);
                    break;
                case 'unitaire':
                    NettoyageUnitaire::create([
                        'service_id' => $service->id,
                        'nom_objet' => $validated['nomObjet'],
                        'prix_objet' => $validated['prixObjet'],
                    ]);
                    break;
            }

            return response()->json([
                'success' => true,
                'message' => 'Service created successfully and pending review',
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
            'name' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'detailedDescription' => 'nullable|string',
            'zones' => 'nullable|array',
            'zones.*' => 'string',
            'availability' => 'nullable|array',
            'includedItems' => 'nullable|array',
            'includedItems.*' => 'string',
            'duration' => 'nullable|integer|min:1',
            'address' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'est_actif' => 'nullable|boolean',
        ]);

        try {
            // Mapper les nouveaux champs aux anciens noms
            $updateData = [];
            if (isset($validated['name'])) $updateData['nom'] = $validated['name'];
            if (isset($validated['category'])) $updateData['category'] = $validated['category'];
            if (isset($validated['description'])) $updateData['description'] = $validated['description'];
            if (isset($validated['detailedDescription'])) $updateData['detailed_description'] = $validated['detailedDescription'];
            if (isset($validated['zones'])) $updateData['zones'] = $validated['zones'];
            if (isset($validated['availability'])) $updateData['availability'] = $validated['availability'];
            if (isset($validated['includedItems'])) $updateData['included_items'] = $validated['includedItems'];
            if (isset($validated['duration'])) $updateData['duree_prevue'] = $validated['duration'];
            if (isset($validated['address'])) $updateData['adresse'] = $validated['address'];
            if (isset($validated['est_actif'])) $updateData['est_actif'] = $validated['est_actif'];

            // Gérer l'upload d'image
            if ($request->hasFile('image')) {
                $updateData['image'] = $request->file('image')->store('services', 'public');
            }

            // Si le service est modifié, repasser en pending_review
            if (!empty($updateData)) {
                $updateData['status'] = 'pending_review';
                $updateData['reviewed_at'] = null;
                $updateData['reviewed_by'] = null;
                $updateData['rejection_reason'] = null;
            }

            $service->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Service updated successfully and pending review',
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
            $services = Service::where('freelancer_id', $user->id)
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

    /**
     * Récupère tous les services en attente de validation (Superviseur)
     */
    public function getPendingServices(): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Only supervisors can access this resource'
            ], 403);
        }

        try {
            $services = Service::where('status', Service::STATUS_PENDING_REVIEW)
                ->with('freelancer')
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $services
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch pending services: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approuve un service (Superviseur)
     */
    public function approveService(Request $request, Service $service): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Only supervisors can approve services'
            ], 403);
        }

        if (!$service->isPendingReview()) {
            return response()->json([
                'success' => false,
                'message' => 'Service is not pending review'
            ], 400);
        }

        try {
            $comment = $request->input('comment');
            $service->approve($user->id, $comment);

            return response()->json([
                'success' => true,
                'message' => 'Service approved successfully',
                'data' => $service
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve service: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rejette un service (Superviseur)
     */
    public function rejectService(Request $request, Service $service): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Only supervisors can reject services'
            ], 403);
        }

        if (!$service->isPendingReview()) {
            return response()->json([
                'success' => false,
                'message' => 'Service is not pending review'
            ], 400);
        }

        $validated = $request->validate([
            'reason' => 'required|string|min:10|max:500'
        ]);

        try {
            $service->reject($user->id, $validated['reason']);

            return response()->json([
                'success' => true,
                'message' => 'Service rejected successfully',
                'data' => $service
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject service: ' . $e->getMessage()
            ], 500);
        }
    }
}
