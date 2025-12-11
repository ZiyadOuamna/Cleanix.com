<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserSettings;
use App\Models\BankInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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

        // TODO: Send email with verification code
        // Mail::send('emails.verify-email', ['code' => $verificationCode], function($message) use ($validated) {
        //     $message->to($validated['email']);
        // });

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
        $cached = cache()->get("email_verification_{$user->id}");

        if (!$cached || $cached['code'] !== $validated['code']) {
            return response()->json([
                'success' => false,
                'message' => 'Code de vérification invalide ou expiré'
            ], 422);
        }

        if ($cached['email'] !== $validated['email']) {
            return response()->json([
                'success' => false,
                'message' => 'Email ne correspond pas'
            ], 422);
        }

        // Update user email
        $user->update(['email' => $validated['email']]);

        // Clear cache
        cache()->forget("email_verification_{$user->id}");

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
            'email' => 'boolean',
            'push' => 'boolean',
            'sms' => 'boolean',
            'new_orders' => 'boolean',
            'messages' => 'boolean',
            'promotions' => 'boolean'
        ]);

        $user = $request->user();
        
        $settings = UserSettings::updateOrCreate(
            ['user_id' => $user->id],
            [
                'notifications' => json_encode($validated)
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
            'profile_visible' => 'boolean',
            'show_earnings' => 'boolean',
            'allow_messages' => 'boolean',
            'show_phone_number' => 'boolean',
            'show_email' => 'boolean',
            'share_location' => 'boolean'
        ]);

        $user = $request->user();

        $settings = UserSettings::updateOrCreate(
            ['user_id' => $user->id],
            [
                'privacy' => json_encode($validated)
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
}
