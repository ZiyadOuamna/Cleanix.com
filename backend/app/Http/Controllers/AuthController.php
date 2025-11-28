<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
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
            'user_type' => 'required|in:Client,Freelancer,Support,Superviseur',
        ]);

        // Create user in users table
        $user = User::create([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'genre' => $validated['genre'],
            'telephone' => $validated['telephone'],
            'user_type' => $validated['user_type'],
        ]);

        // Create profile in corresponding table based on user_type
        $this->createUserProfile($user, $validated['user_type']);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 201);
    }

    /**
     * Login user
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
        $token = $user->createToken('auth_token')->plainTextToken;

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
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ], 200);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

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
        ]);

        if ($request->hasFile('photo_profil')) {
            $path = $request->file('photo_profil')->store('photos_profil', 'public');
            $validated['photo_profil'] = $path;
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user
        ], 200);
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
        
        DB::table('password_resets')->insert([
            'email' => $validated['email'],
            'token' => Hash::make($token),
            'created_at' => now(),
        ]);

        // TODO: Send email with reset link
        // Mail::send('emails.reset-password', ['token' => $token, 'user' => $user], function($message) use ($user) {
        //     $message->to($user->email)->subject('Reset Password');
        // });

        return response()->json([
            'success' => true,
            'message' => 'Password reset link sent to your email',
            'token' => $token // In production, don't return token
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

        if (!$passwordReset || Carbon::parse($passwordReset->created_at)->addMinutes(60)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired password reset token'
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
     * Create user profile in corresponding table
     */
    private function createUserProfile(User $user, string $userType)
    {
        switch ($userType) {
            case 'Client':
                DB::table('clients')->insert([
                    'user_id' => $user->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                break;

            case 'Freelancer':
                DB::table('freelancers')->insert([
                    'user_id' => $user->id,
                    'statut_disponibilite' => 'Offline',
                    'note_moyenne' => 0,
                    'est_connecte' => false,
                    'nombre_missions' => 0,
                    'nombre_avis' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                break;

            case 'Support':
                DB::table('supports')->insert([
                    'user_id' => $user->id,
                    'est_disponible' => true,
                    'tickets_traites' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                break;

            case 'Superviseur':
                DB::table('superviseurs')->insert([
                    'user_id' => $user->id,
                    'niveau_acces' => 'Superviseur',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                break;
        }
    }
}
