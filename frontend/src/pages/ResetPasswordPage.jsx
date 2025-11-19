/*elle récupère le token depuis le lien email,
affiche le formulaire pour le nouveau mot de passe,
et utilise tes couleurs (#2d2c86, #3ec0f0...).

1) Récupère le Token : Il lit ?token=XYZ et ?email=... depuis l'URL envoyée par email.
2) Sécurise          : Si le token n'est pas là, il bloque le formulaire et affiche une erreur.
3) Envoie à l'API    : Il appelle resetPassword (dans authService.js) avec les 4 infos requises par Laravel (email, token, password, password_confirmation).
4) Redirige          : Une fois réussi, il renvoie l'utilisateur vers /login.
*/
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';

// Configuration des couleurs (Design Cleanix)
const COLORS = {
    primary: '#2d2c86',    // Indigo foncé
    secondary: '#3ec0f0',  // Bleu clair
    textSecondary: '#918a84', // Gris chaud
    background: '#f0fafe', // Blanc cassé
};

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    
    // Récupérer le token et l'email depuis l'URL (envoyé par Laravel dans l'email)
    // URL attendue : http://votre-site.com/password-reset?token=XYZ...&email=...
    const [searchParams] = useSearchParams(); 
    const token = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);

    // Vérification au chargement : Est-ce que le lien est valide (token + email présents) ?
    useEffect(() => {
        if (!token || !emailFromUrl) {
            setError("Lien invalide ou expiré. Veuillez recommencer la procédure depuis le début.");
        } else {
            setCanSubmit(true);
        }
    }, [token, emailFromUrl]);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        // Validation simple côté client
        if (password !== passwordConfirmation) {
            setError("Les mots de passe ne correspondent pas.");
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            setIsLoading(false);
            return;
        }

        try {
            // Envoi des données à Laravel via authService
            await resetPassword({
                email: emailFromUrl,
                token: token,
                password: password,
                password_confirmation: passwordConfirmation,
            });
            
            setMessage("✅ Mot de passe modifié avec succès ! Redirection vers la connexion...");
            
            // Redirection vers le login après 3 secondes
            setTimeout(() => navigate('/login'), 3000); 

        } catch (err) {
            // Gestion des erreurs API (ex: token expiré)
            const errorMsg = err.response?.data?.message || "Erreur de réinitialisation. Le lien a peut-être expiré.";
            setError(`❌ ${errorMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: COLORS.background }} className="min-h-screen flex flex-col items-center justify-start py-8">
            {/* Header Vague (Style identique à ForgotPassword) */}
            <div 
                style={{ backgroundColor: COLORS.primary }}
                className="w-full h-48 rounded-b-3xl absolute top-0 left-0"
            >
                 {/* Titre */}
                 <h2 className="absolute top-8 left-1/2 -translate-x-1/2 text-white text-2xl font-bold w-full text-center px-4">
                    Nouveau Mot de Passe
                </h2>
                {/* Forme de vague en bas */}
                <div style={{ backgroundColor: COLORS.background }} className="absolute -bottom-10 left-0 right-0 h-20 rounded-t-full"></div>
            </div>

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg mt-32 relative z-10">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                        Réinitialisation
                    </h3>
                    {emailFromUrl && (
                        <p className="mt-2 text-sm" style={{ color: COLORS.textSecondary }}>
                            Compte : <span className="font-medium text-gray-700">{emailFromUrl}</span>
                        </p>
                    )}
                </div>
                
                {!canSubmit ? (
                    // Si le token est manquant, on affiche une erreur et un lien retour
                    <div className="text-center p-4 text-red-600 font-medium bg-red-50 rounded-lg border border-red-100">
                        {error || "Vérification du lien de sécurité..."}
                        <div className="mt-4">
                            <button onClick={() => navigate('/forgot-password')} className="text-sm underline hover:text-red-800 transition">
                                Demander un nouveau lien
                            </button>
                        </div>
                    </div>
                ) : (
                    // Sinon, on affiche le formulaire de changement de mot de passe
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Nouveau Mot de Passe */}
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>
                                Nouveau Mot de Passe
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="8"
                                style={{ borderColor: COLORS.textSecondary, color: COLORS.primary }}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Confirmer Mot de Passe */}
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>
                                Confirmer le Mot de Passe
                            </label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                style={{ borderColor: COLORS.textSecondary, color: COLORS.primary }}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ backgroundColor: COLORS.primary }}
                            className="w-full py-3 px-4 rounded-lg text-white font-bold text-lg hover:opacity-90 transition transform active:scale-95 shadow-md"
                        >
                            {isLoading ? 'Modification...' : 'Sauvegarder'}
                        </button>
                    </form>
                )}
                
                {/* Messages de feedback */}
                {message && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center font-medium">{message}</div>}
                {error && canSubmit && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">{error}</div>}
            </div>
        </div>
    );
}