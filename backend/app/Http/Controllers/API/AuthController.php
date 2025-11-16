<?php
//ce fichier est créer le 14/11/2025 (pas par default)
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    //Gère une demande d'inscription.
    
    public function register(Request $request){
        // 1. Validation des données (très important)
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 2. Création de l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 3. (Optionnel mais recommandé) Créer un token pour le connecter
        // $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Renvoyer une réponse JSON à React
        return response()->json([
            'message' => 'Utilisateur créé avec succès!',
            'user' => $user
            // 'token' => $token 
        ], 201); // 201 = Created
    }
}