import React, { useState } from 'react';
import { forgotPassword } from '../services/authService';
import { useNavigate } from 'react-router-dom';

// Définir les couleurs comme des variables pour faciliter la gestion
const COLORS = {
    primary: '#2d2c86',    // Indigo foncé pour les boutons et titres
    secondary: '#3ec0f0',  // Bleu clair pour les accents
    textSecondary: '#918a84', // Gris chaud pour le texte secondaire
    background: '#f0fafe',  // Blanc cassé pour le fond général
};

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const response = await forgotPassword({ email });
            setMessage("✅ Un lien de réinitialisation a été envoyé à votre adresse email.");
            
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || 'Email non trouvé ou problème de serveur.';
            setError(`❌ ${errorMsg}`);
            
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: COLORS.background }} className="min-h-screen flex flex-col items-center justify-start py-8">
            {/* Vague/Header stylisé */}
            <div className="w-full h-48 rounded-b-3xl absolute top-0 left-0"
            >
                {/* Icône Retour */}
                <button 
                    onClick={() => navigate('/login')} 
                    className="absolute top-6 left-6 text-white text-2xl"
                >
                    &lt;
                </button>
                {/* Titre "Forgot Password" */}
                <h2 className="absolute top-6 left-1/2 -translate-x-1/2 text-primary text-2xl font-bold">
                    FORGOT PASSWORD
                </h2>
                {/* Forme de vague (simulée avec un div arrondi) */}
                <div 
                    style={{ backgroundColor: COLORS.background }} 
                    className="absolute -bottom-10 left-0 right-0 h-20 rounded-t-full"
                ></div>
            </div>

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg mt-32 relative z-10"> {/* Adjusted mt- */}
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                        Mail Address Here
                    </h3>
                    <p className="mt-2 text-sm" style={{ color: COLORS.textSecondary }}>
                        Enter the email address associated with your account.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium" style={{ color: COLORS.textSecondary }}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ 
                                borderColor: COLORS.textSecondary, 
                                '--tw-ring-color': COLORS.secondary, 
                                color: COLORS.primary 
                            }}
                            className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:border-transparent outline-none"
                            placeholder="johndoe@gmail.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ backgroundColor: COLORS.primary }}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white hover:opacity-90 focus:outline-none transition duration-150"
                    >
                        {isLoading ? 'Sending...' : 'Recover Password'}
                    </button>
                </form>
                
                {/* Messages de Succès / Erreur */}
                {message && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center">{message}</div>}
                {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{error}</div>}
            </div>
        </div>
    );
}
