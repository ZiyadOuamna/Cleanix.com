<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Client;
use App\Models\Freelancer;
use App\Models\Support;
use App\Models\Superviseur;
use App\Models\Portefeuille;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Exception;

class AuthController extends Controller
{
    /**
     * Register a new user (Client or Freelancer only)
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'genre' => 'required|in:Homme,Femme',
            'telephone' => 'required|string|unique:users',
            'user_type' => 'required|in:Client,Freelancer', // Only Client and Freelancer can register
            'photo_profil' => 'nullable|image|max:2048',
            
            // Optional fields for Client
            'adresse' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:100',
            'code_postal' => 'nullable|string|max:10',
            
            // Optional fields for Freelancer
            'details_compte_bancaire' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        
        try {
            // Handle photo upload
            $photoPath = null;
            if ($request->hasFile('photo_profil')) {
                $photoPath = $request->file('photo_profil')->store('photos_profil', 'public');
            }

            // Create user in users table
            $user = User::create([
                'name' => $validated['prenom'] . ' ' . $validated['nom'],
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'genre' => $validated['genre'],
                'telephone' => $validated['telephone'],
                'user_type' => $validated['user_type'],
                'photo_profil' => $photoPath,
            ]);

            // Create profile in corresponding table based on user_type
            $this->createUserProfile($user, $validated);

            DB::commit();

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Load the specific profile
            $user->load($this->getProfileRelation($user->user_type));

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                    'token_type' => 'Bearer',
                ]
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user (all types)
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($validated)) {
            return response()->json([
                'success' => false,
                'message' => 'The provided credentials are incorrect.'
            ], 401);
        }

        $user = Auth::user();
        
        // Update connection status for Freelancers
        if ($user->isFreelancer() && $user->freelancer) {
            $user->freelancer->setConnecte(true);
            $user->freelancer->setStatut('Available');
        }

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Load the specific profile
        $user->load($this->getProfileRelation($user->user_type));

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        $user = $request->user();
        
        // Load the specific profile
        $user->load($this->getProfileRelation($user->user_type));

        return response()->json([
            'success' => true,
            'data' => $user
        ], 200);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Update connection status for Freelancers
        if ($user->isFreelancer() && $user->freelancer) {
            $user->freelancer->setConnecte(false);
            $user->freelancer->setStatut('Offline');
        }

        // Delete current token
        $user->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ], 200);
    }

    /**
     * Refresh token
     */
    public function refreshToken(Request $request)
    {
        $user = $request->user();
        
        // Delete old token
        $user->currentAccessToken()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Token refreshed successfully',
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string|unique:users,telephone,' . $user->id,
            'genre' => 'sometimes|in:Homme,Femme',
            'photo_profil' => 'sometimes|image|max:2048',
            
            // Client specific fields
            'adresse' => 'sometimes|string|max:255',
            'ville' => 'sometimes|string|max:100',
            'code_postal' => 'sometimes|string|max:10',
            
            // Freelancer specific fields
            'details_compte_bancaire' => 'sometimes|string|max:255',
        ]);

        DB::beginTransaction();
        
        try {
            // Handle photo upload
            if ($request->hasFile('photo_profil')) {
                $validated['photo_profil'] = $request->file('photo_profil')->store('photos_profil', 'public');
            }

            // Update user table
            $user->update(array_intersect_key($validated, array_flip([
                'nom', 'prenom', 'telephone', 'genre', 'photo_profil'
            ])));

            // Update profile specific table
            if ($user->isClient() && $user->client) {
                $user->client->update(array_intersect_key($validated, array_flip([
                    'adresse', 'ville', 'code_postal'
                ])));
            } elseif ($user->isFreelancer() && $user->freelancer) {
                $user->freelancer->update(array_intersect_key($validated, array_flip([
                    'details_compte_bancaire'
                ])));
            }

            DB::commit();

            // Reload the profile
            $user->load($this->getProfileRelation($user->user_type));

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $user
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'The current password is incorrect.'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully'
        ], 200);
    }

    /**
     * Forgot password - send reset link
     */
    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|exists:users,email',
        ]);

        $user = User::where('email', $validated['email'])->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Generate reset token
        $token = Str::random(60);
        
        DB::table('password_resets')->updateOrInsert(
            ['email' => $validated['email']],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        // Send email with reset link
        try {
            Mail::to($user->email)->send(new \App\Mail\ResetPasswordMail(
                $user->email,
                $token,
                $user->nom . ' ' . $user->prenom
            ));
        } catch (\Exception $e) {
            // If email fails, still return success but log the error
            Log::error('Reset password email failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Password reset link sent to your email'
        ], 200);
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $passwordReset = DB::table('password_resets')
            ->where('email', $validated['email'])
            ->latest('created_at')
            ->first();

        if (!$passwordReset) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password reset token'
            ], 422);
        }

        // Check if token is expired (60 minutes)
        if (Carbon::parse($passwordReset->created_at)->addMinutes(60)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Password reset token has expired'
            ], 422);
        }

        // Verify token
        if (!Hash::check($validated['token'], $passwordReset->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password reset token'
            ], 422);
        }

        $user = User::where('email', $validated['email'])->first();
        $user->update(['password' => Hash::make($validated['password'])]);

        // Delete the reset token
        DB::table('password_resets')->where('email', $validated['email'])->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully'
        ], 200);
    }

    /**
     * Change freelancer status (Freelancers only)
     */
    public function changeStatut(Request $request)
    {
        $user = $request->user();

        if (!$user->isFreelancer()) {
            return response()->json([
                'success' => false,
                'message' => 'This action is only available for freelancers'
            ], 403);
        }

        $validated = $request->validate([
            'statut' => 'required|in:Available,Busy,Offline',
        ]);

        $user->freelancer->setStatut($validated['statut']);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => [
                'statut' => $user->freelancer->statut_disponibilite
            ]
        ], 200);
    }

    /**
     * Create user profile in corresponding table
     */
    private function createUserProfile(User $user, array $validated)
    {
        switch ($user->user_type) {
            case 'Client':
                $client = Client::create([
                    'user_id' => $user->id,
                    'adresse' => $validated['adresse'] ?? null,
                    'ville' => $validated['ville'] ?? null,
                    'code_postal' => $validated['code_postal'] ?? null,
                ]);
                
                // Create portefeuille for client
                Portefeuille::create([
                    'client_id' => $client->id,
                    'solde' => 0,
                ]);
                break;

            case 'Freelancer':
                $freelancer = Freelancer::create([
                    'user_id' => $user->id,
                    'statut_disponibilite' => 'Offline',
                    'details_compte_bancaire' => $validated['details_compte_bancaire'] ?? null,
                    'est_connecte' => false,
                    'nombre_missions' => 0,
                    'nombre_avis' => 0,
                ]);
                
                // Create portefeuille for freelancer
                Portefeuille::create([
                    'freelancer_id' => $freelancer->id,
                    'solde' => 0,
                ]);
                break;

            case 'Support':
                Support::create([
                    'user_id' => $user->id,
                    'est_disponible' => true,
                    'tickets_traites' => 0,
                ]);
                break;

            case 'Superviseur':
                Superviseur::create([
                    'user_id' => $user->id,
                    'niveau_acces' => 'Superviseur',
                ]);
                break;
        }
    }

    /**
     * Get profile relation name based on user type
     */
    private function getProfileRelation(string $userType): string
    {
        return match($userType) {
            'Client' => 'client.portefeuille',
            'Freelancer' => 'freelancer.portefeuille',
            'Support' => 'support',
            'Superviseur' => 'superviseur',
            default => '',
        };
    }
}