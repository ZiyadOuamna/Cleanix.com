<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserSettings;
use App\Models\BankInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class SettingsController extends Controller
{
    /**
     * Send email verification code
     */
    public function sendVerificationEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email'
        ]);

        $user = $request->user();
        
        $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store in cache for 10 minutes
        cache()->put("email_verification_{$user->id}", [
            'code' => $verificationCode,
            'email' => $validated['email']
        ], now()->addMinutes(10));

        // Send email with verification code
        try {
            Mail::send('emails.verify-email', ['code' => $verificationCode], function($message) use ($validated) {
                $message->to($validated['email'])
                        ->subject('Code de Vérification Email - Cleanix.com');
            });
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::error('Email verification code failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi du code. Veuillez vérifier votre adresse email.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Code de vérification envoyé',
            'email' => $validated['email']
        ]);
    }

    /**
     * Confirm email verification code
     */
    public function confirmEmailCode(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|size:6',
            'email' => 'required|email'
        ]);

        $user = $request->user();
        
        \Log::info('Email verification attempt', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'new_email' => $validated['email'],
            'code' => $validated['code']
        ]);
        
        $cached = cache()->get("email_verification_{$user->id}");

        if (!$cached) {
            \Log::warning('No cache found for email verification', ['user_id' => $user->id]);
            return response()->json([
                'success' => false,
                'message' => 'Aucun code en cache. Veuillez renvoyer le code.'
            ], 422);
        }

        if ($cached['code'] !== $validated['code']) {
            \Log::warning('Code mismatch', [
                'user_id' => $user->id,
                'cached_code' => $cached['code'],
                'provided_code' => $validated['code']
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Code de vérification invalide ou expiré'
            ], 422);
        }

        if ($cached['email'] !== $validated['email']) {
            \Log::warning('Email mismatch', [
                'user_id' => $user->id,
                'cached_email' => $cached['email'],
                'provided_email' => $validated['email']
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Email ne correspond pas'
            ], 422);
        }

        // Update user email and mark as verified
        \Log::info('Updating user email verification', [
            'user_id' => $user->id,
            'new_email' => $validated['email']
        ]);
        
        $user->update([
            'email' => $validated['email'],
            'email_verified_at' => now()
        ]);

        // Refresh to get the updated values
        $user->refresh();

        // Clear cache
        cache()->forget("email_verification_{$user->id}");

        \Log::info('Email verified successfully', [
            'user_id' => $user->id,
            'email_verified_at' => $user->email_verified_at
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Email vérifié avec succès',
            'user' => $user
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed'
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Le mot de passe actuel est incorrect'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe changé avec succès'
        ]);
    }

    /**
     * Update notification settings
     */
    public function updateNotificationSettings(Request $request)
    {
        $validated = $request->validate([
            'emailNotifications' => 'sometimes|boolean',
            'smsNotifications' => 'sometimes|boolean',
            'newProposals' => 'sometimes|boolean',
            'serviceReminders' => 'sometimes|boolean',
            'promotions' => 'sometimes|boolean',
            'news' => 'sometimes|boolean',
            // Also accept alternative field names
            'email' => 'sometimes|boolean',
            'push' => 'sometimes|boolean',
            'sms' => 'sometimes|boolean',
            'new_orders' => 'sometimes|boolean',
            'messages' => 'sometimes|boolean'
        ]);

        $user = $request->user();
        
        // Normalize the data
        $notificationData = [
            'emailNotifications' => $validated['emailNotifications'] ?? $validated['email'] ?? false,
            'smsNotifications' => $validated['smsNotifications'] ?? $validated['sms'] ?? false,
            'newProposals' => $validated['newProposals'] ?? $validated['new_orders'] ?? false,
            'serviceReminders' => $validated['serviceReminders'] ?? false,
            'promotions' => $validated['promotions'] ?? false,
            'news' => $validated['news'] ?? false,
            'messages' => $validated['messages'] ?? false
        ];
        
        $settings = UserSettings::updateOrCreate(
            ['user_id' => $user->id],
            [
                'notifications' => json_encode($notificationData)
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Paramètres de notification mis à jour',
            'settings' => $settings
        ]);
    }

    /**
     * Update privacy settings
     */
    public function updatePrivacySettings(Request $request)
    {
        $validated = $request->validate([
            'profileVisible' => 'sometimes|boolean',
            'showEmail' => 'sometimes|boolean',
            'showPhone' => 'sometimes|boolean',
            'allowMessages' => 'sometimes|boolean',
            'shareLocation' => 'sometimes|boolean',
            // Also accept alternative field names
            'profile_visible' => 'sometimes|boolean',
            'show_earnings' => 'sometimes|boolean',
            'show_phone_number' => 'sometimes|boolean',
            'show_email' => 'sometimes|boolean',
            'share_location' => 'sometimes|boolean'
        ]);

        $user = $request->user();

        // Normalize the data
        $privacyData = [
            'profileVisible' => $validated['profileVisible'] ?? $validated['profile_visible'] ?? false,
            'showEmail' => $validated['showEmail'] ?? $validated['show_email'] ?? false,
            'showPhone' => $validated['showPhone'] ?? $validated['show_phone_number'] ?? false,
            'allowMessages' => $validated['allowMessages'] ?? false,
            'shareLocation' => $validated['shareLocation'] ?? $validated['share_location'] ?? false,
            'show_earnings' => $validated['show_earnings'] ?? false
        ];

        $settings = UserSettings::updateOrCreate(
            ['user_id' => $user->id],
            [
                'privacy' => json_encode($privacyData)
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Paramètres de confidentialité mis à jour',
            'settings' => $settings
        ]);
    }

    /**
     * Update availability settings
     */
    public function updateAvailabilitySettings(Request $request)
    {
        $validated = $request->validate([
            'availability' => 'required|array'
        ]);

        $user = $request->user();

        $settings = UserSettings::updateOrCreate(
            ['user_id' => $user->id],
            [
                'availability' => json_encode($validated['availability'])
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Paramètres de disponibilité mis à jour',
            'settings' => $settings
        ]);
    }

    /**
     * Update bank information
     */
    public function updateBankInfo(Request $request)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string',
            'account_number' => 'required|string',
            'iban' => 'required|string',
            'swift' => 'nullable|string'
        ]);

        $user = $request->user();

        $bankInfo = BankInfo::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Informations bancaires mises à jour',
            'bank_info' => $bankInfo
        ]);
    }

    /**
     * Get user settings
     */
    public function getSettings(Request $request)
    {
        $user = $request->user();
        $settings = UserSettings::where('user_id', $user->id)->first();
        $bankInfo = BankInfo::where('user_id', $user->id)->first();

        return response()->json([
            'success' => true,
            'user' => $user,
            'settings' => $settings,
            'bank_info' => $bankInfo
        ]);
    }

    /**
     * Upload identity verification documents
     */
    public function uploadIdentityDocuments(Request $request)
    {
        $validated = $request->validate([
            'cin_number' => 'required|string',
            'cin_front' => 'nullable|image|max:5120',
            'cin_back' => 'nullable|image|max:5120',
            'selfie_photo' => 'nullable|image|max:5120'
        ]);

        $user = $request->user();
        $paths = [];

        // Store files
        if ($request->hasFile('cin_front')) {
            $paths['cin_front'] = $request->file('cin_front')->store('identity/cin_front', 'public');
        }
        if ($request->hasFile('cin_back')) {
            $paths['cin_back'] = $request->file('cin_back')->store('identity/cin_back', 'public');
        }
        if ($request->hasFile('selfie_photo')) {
            $paths['selfie_photo'] = $request->file('selfie_photo')->store('identity/selfie', 'public');
        }

        // Update user identity info
        $user->update([
            'cin_number' => $validated['cin_number'],
            'identity_verified_at' => $paths['cin_front'] && $paths['cin_back'] && $paths['selfie_photo'] ? null : $user->identity_verified_at,
            'identity_status' => 'pending'
        ]);

        // Store paths in settings
        $settings = UserSettings::updateOrCreate(
            ['user_id' => $user->id],
            [
                'identity_documents' => json_encode($paths)
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Documents d\'identité soumis pour vérification',
            'paths' => $paths,
            'status' => 'pending'
        ]);
    }

    /**
     * Send verification email to a newly created supervisor
     * Used when admin creates a supervisor via SQL/API
     */
    public function sendSupervisorVerificationEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = User::where('email', $validated['email'])->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        if ($user->user_type !== 'Superviseur') {
            return response()->json([
                'success' => false,
                'message' => 'Cet endpoint est réservé aux superviseurs'
            ], 403);
        }

        $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store in cache for 10 minutes
        cache()->put("email_verification_{$user->id}", [
            'code' => $verificationCode,
            'email' => $validated['email']
        ], now()->addMinutes(10));

        // Send email with verification code
        try {
            \Log::info('Sending verification email to supervisor', [
                'user_id' => $user->id,
                'email' => $validated['email']
            ]);

            Mail::send('emails.verify-email', ['code' => $verificationCode], function($message) use ($validated) {
                $message->to($validated['email'])
                        ->subject('Code de Vérification Email - Cleanix.com (Superviseur)');
            });

            \Log::info('Verification email sent to supervisor successfully', [
                'user_id' => $user->id,
                'email' => $validated['email']
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to send verification email to supervisor: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'email' => $validated['email']
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi du code. Veuillez vérifier votre adresse email.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Code de vérification envoyé au superviseur',
            'email' => $validated['email']
        ]);
    }
}

