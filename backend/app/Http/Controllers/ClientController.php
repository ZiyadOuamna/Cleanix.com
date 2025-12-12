<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    /**
     * Get the list of freelancers followed by the authenticated client
     */
    public function getFollowing(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->user_type !== 'Client') {
                return response()->json([
                    'success' => false,
                    'message' => 'Seuls les clients peuvent voir leurs freelancers suivis'
                ], 403);
            }

            // Get freelancers followed by this client
            // For now, we'll return an empty array as the follow system needs to be implemented
            // In a real scenario, you'd query a 'follows' table
            $following = [];

            return response()->json([
                'success' => true,
                'message' => 'Liste des freelancers suivis récupérée avec succès',
                'data' => $following
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des freelancers suivis: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the list of followers for the authenticated client
     */
    public function getFollowers(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->user_type !== 'Client') {
                return response()->json([
                    'success' => false,
                    'message' => 'Seuls les clients peuvent voir leurs followers'
                ], 403);
            }

            // Get followers of this client
            // For now, we'll return an empty array as the follow system needs to be implemented
            $followers = [];

            return response()->json([
                'success' => true,
                'message' => 'Liste des followers récupérée avec succès',
                'data' => $followers
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des followers: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the list of reviews given by the authenticated client
     */
    public function getReviews(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->user_type !== 'Client') {
                return response()->json([
                    'success' => false,
                    'message' => 'Seuls les clients peuvent voir leurs avis'
                ], 403);
            }

            // Get evaluations (reviews) given by this client
            $reviews = Evaluation::where('client_id', $user->id)
                ->with(['freelancer' => function ($query) {
                    $query->select('id', 'prenom', 'nom', 'avatar', 'rating');
                }])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($evaluation) {
                    return [
                        'id' => $evaluation->id,
                        'freelancerId' => $evaluation->freelancer_id,
                        'freelancerName' => $evaluation->freelancer->prenom . ' ' . $evaluation->freelancer->nom,
                        'freelancerUsername' => '@' . strtolower(str_replace(' ', '', $evaluation->freelancer->prenom . $evaluation->freelancer->nom)),
                        'freelancerAvatar' => substr($evaluation->freelancer->prenom, 0, 1) . substr($evaluation->freelancer->nom, 0, 1),
                        'rating' => $evaluation->rating,
                        'date' => $evaluation->created_at->format('d M Y'),
                        'comment' => $evaluation->comment,
                        'service' => $evaluation->service_type ?? 'Service',
                        'clientComment' => $evaluation->client_response ?? '',
                        'clientCommentDate' => $evaluation->client_response_date ? date('d M Y', strtotime($evaluation->client_response_date)) : '',
                        'isClientCommenting' => false
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Liste des avis récupérée avec succès',
                'data' => $reviews
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des avis: ' . $e->getMessage()
            ], 500);
        }
    }
}
