import React, { useState } from 'react';
import { forgotPassword } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react'; // Icônes Lucide pour un design moderne

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
        <div 
            style={{ background: `linear-gradient(135deg, ${COLORS.background} 0%, #e0f2fe 100%)` }} 
            className="min-h-screen flex flex-col items-center justify-start py-8 relative overflow-hidden"
        >
            {/* --- HEADER AVEC VAGUE STYLISÉE --- */}
            <div className="w-full h-48 relative">
                {/* Icône Retour */}
                <button 
                    onClick={() => navigate('/login')} 
                    className="absolute top-6 left-6 text-white text-2xl hover:scale-110 transition-transform duration-200 z-10"
                    title="Retour à la connexion"
                >
                    <ArrowLeft size={24} />
                </button>
                
                {/* Titre "Forgot Password" */}
                <h2 className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-2xl font-bold z-10">
                    FORGOT PASSWORD
                </h2>
                
                {/* Forme de vague SVG pour un design fluide */}
                <svg 
                    className="absolute bottom-0 w-full h-20" 
                    viewBox="0 0 1440 320" 
                    preserveAspectRatio="none"
                >
                    <path 
                        fill={COLORS.background} 
                        d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,176C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                </svg>
            </div>

            {/* --- CONTENU PRINCIPAL (FORMULAIRE) --- */}
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl mt-8 relative z-10 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center">
                        <Mail size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                        Réinitialiser le mot de passe
                    </h3>
                    <p className="mt-2 text-sm" style={{ color: COLORS.textSecondary }}>
                        Entrez l'adresse email associée à votre compte.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: COLORS.textSecondary }}>
                            Adresse Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                                style={{ 
                                    borderColor: COLORS.textSecondary, 
                                    '--tw-ring-color': COLORS.secondary, 
                                    color: COLORS.primary 
                                }}
                                placeholder="exemple@email.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: COLORS.primary, '--tw-ring-color': COLORS.primary }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin mr-2" />
                                Envoi en cours...
                            </>
                        ) : (
                            'Récupérer le mot de passe'
                        )}
                    </button>
                </form>
                
                {/* --- MESSAGES DE SUCCÈS / ERREUR (Toast-like) --- */}
                {message && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center animate-fade-in">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center animate-fade-in">
                        {error}
                    </div>
                )}
                
                {/* --- LIEN RETOUR --- */}
                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate('/login')} 
                        className="text-sm hover:underline transition-colors duration-200"
                        style={{ color: COLORS.secondary }}
                    >
                        Retour à la connexion
                    </button>
                </div>
            </div>
        </div>
    );
}
