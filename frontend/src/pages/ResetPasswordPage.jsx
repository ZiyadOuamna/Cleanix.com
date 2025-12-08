import React, { useState, useEffect } from 'react';
import { resetPassword } from '../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Key, Eye, EyeOff, CheckCircle, Loader2, Shield, Check, X } from 'lucide-react';

// Définir les couleurs comme des variables pour faciliter la gestion
const COLORS = {
    primary: '#6366f1',
    secondary: '#0ea5e9',
    textSecondary: '#9ca3af',
    background: '#144dd1ff',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
};

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [formData, setFormData] = useState({
        email: searchParams.get('email') || '',
        token: searchParams.get('token') || '',
        password: '',
        password_confirmation: ''
    });
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ 
        score: 0, 
        strength: '', 
        color: 'gray', 
        progress: 0 
    });

    // Fonction pour évaluer la force du mot de passe (simplifiée)
    const checkPasswordStrength = (password) => {
        if (!password) return { score: 0, strength: '', color: 'gray', progress: 0 };
        
        let score = 0;
        
        // Critères
        if (password.length >= 8) score += 1;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
        
        // Déterminer la force
        let strength = '';
        let color = '';
        
        if (score === 0) {
            strength = '';
            color = COLORS.textSecondary;
        } else if (score <= 2) {
            strength = 'Faible';
            color = COLORS.error;
        } else if (score === 3) {
            strength = 'Moyen';
            color = COLORS.warning;
        } else {
            strength = 'Fort';
            color = COLORS.success;
        }
        
        return {
            score,
            strength,
            color,
            progress: (score / 4) * 100
        };
    };

    // Vérifier les critères du mot de passe
    const checkPasswordCriteria = (password) => {
        return [
            { text: '8 caractères min', met: password.length >= 8 },
            { text: 'Maj & min', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
            { text: '1 chiffre', met: /[0-9]/.test(password) },
            { text: '1 caractère spécial', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
        ];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (name === 'password') {
            const strength = checkPasswordStrength(value);
            setPasswordStrength(strength);
        }
    };

    const validateForm = () => {
        if (!formData.password) {
            setError('Veuillez entrer un nouveau mot de passe');
            return false;
        }
        
        if (passwordStrength.score < 2) {
            setError('Veuillez choisir un mot de passe plus fort');
            return false;
        }
        
        if (formData.password !== formData.password_confirmation) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }
        
        if (!formData.token) {
            setError('Lien de réinitialisation invalide');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');
        
        if (!validateForm()) return;
        
        setIsLoading(true);

        try {
            const response = await resetPassword(formData);
            setMessage("Mot de passe réinitialisé avec succès !");
            
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: 'Votre mot de passe a été réinitialisé avec succès.' 
                    } 
                });
            }, 2000);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || 
                           err.response?.data?.error || 
                           'Le lien est invalide ou a expiré.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Vérifier les critères actuels
    const passwordCriteria = checkPasswordCriteria(formData.password);
    const passwordsMatch = formData.password && formData.password_confirmation && 
                          formData.password === formData.password_confirmation;

    return (
        <div 
            style={{ background: `linear-gradient(135deg, ${COLORS.background} 0%, #1e293b 100%)` }} 
            className="min-h-screen flex items-center justify-center p-4"
        >
            {/* Conteneur principal qui prend 1/3 de l'écran */}
            <div className="w-full max-w-md mx-auto">
                {/* Carte du formulaire */}
                <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                    {/* En-tête du formulaire */}
                    <div className="px-6 pt-8 pb-6 text-center border-b border-gray-700">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Shield size={28} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            CLEANI<strong className='text-blue-500'>X.</strong>
                        </h2>
                        <p className="text-sm text-gray-400">
                            Créez un nouveau mot de passe sécurisé
                        </p>
                    </div>

                    {/* Formulaire */}
                    <div className="px-6 py-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email (read-only) */}
                            {formData.email && (
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-gray-300">
                                        Compte à sécuriser
                                    </label>
                                    <div className="p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-300 text-sm">
                                        {formData.email}
                                    </div>
                                </div>
                            )}

                            {/* Nouveau mot de passe */}
                            <div>
                                <label className="block text-xs font-medium mb-2 text-gray-300">
                                    Nouveau mot de passe
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder-gray-400"
                                        placeholder="Créez un mot de passe"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                
                                {/* Indicateur de force */}
                                {formData.password && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-300">Force du mot de passe :</span>
                                            <span className="text-xs font-semibold" style={{ color: passwordStrength.color }}>
                                                {passwordStrength.strength}
                                            </span>
                                        </div>
                                        
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full transition-all duration-300"
                                                style={{ 
                                                    width: `${passwordStrength.progress}%`,
                                                    backgroundColor: passwordStrength.color
                                                }}
                                            ></div>
                                        </div>
                                        
                                        {/* Critères */}
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {passwordCriteria.map((criterion, index) => (
                                                <div 
                                                    key={index}
                                                    className={`flex items-center text-xs px-2 py-1 rounded ${criterion.met ? 'bg-green-900/30 text-green-400' : 'bg-gray-900/30 text-gray-500'}`}
                                                >
                                                    {criterion.met ? (
                                                        <Check size={12} className="mr-2" />
                                                    ) : (
                                                        <X size={12} className="mr-2" />
                                                    )}
                                                    {criterion.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirmation du mot de passe */}
                            <div>
                                <label className="block text-xs font-medium mb-2 text-gray-300">
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder-gray-400"
                                        placeholder="Retapez votre mot de passe"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                
                                {/* Validation de correspondance */}
                                {formData.password_confirmation && (
                                    <div className={`mt-2 text-xs ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                                        {passwordsMatch ? (
                                            <div className="flex items-center">
                                                <CheckCircle size={14} className="mr-2" />
                                                Les mots de passe correspondent
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <X size={14} className="mr-2" />
                                                Les mots de passe ne correspondent pas
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Conseils de sécurité */}
                            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                                    <Shield size={14} className="mr-2 text-blue-400" />
                                    Conseils de sécurité
                                </h4>
                                <ul className="text-xs text-gray-400 space-y-1">
                                    <li className="flex items-start">
                                        <span className="text-blue-400 mr-2">•</span>
                                        Utilisez au moins 12 caractères
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-400 mr-2">•</span>
                                        Évitez les mots courants ou personnels
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-400 mr-2">•</span>
                                        Utilisez un gestionnaire de mots de passe
                                    </li>
                                </ul>
                            </div>

                            {/* Messages d'état */}
                            {message && (
                                <div className="p-3 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-700 text-green-300 rounded-lg text-sm text-center">
                                    <div className="flex items-center justify-center">
                                        <CheckCircle size={16} className="mr-2" />
                                        {message}
                                    </div>
                                </div>
                            )}
                            
                            {error && (
                                <div className="p-3 bg-gradient-to-r from-red-900/50 to-rose-900/50 border border-red-700 text-red-300 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {/* Bouton de soumission */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading || !formData.token}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ 
                                        backgroundColor: !formData.token ? COLORS.textSecondary : COLORS.primary,
                                        backgroundImage: formData.token ? `linear-gradient(135deg, ${COLORS.primary}, #4f46e5)` : ''
                                    }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin mr-2" />
                                            Réinitialisation...
                                        </>
                                    ) : !formData.token ? (
                                        'Lien invalide'
                                    ) : (
                                        'Réinitialiser mon mot de passe'
                                    )}
                                </button>
                            </div>

                            {/* Bouton retour */}
                            <div className="pt-4 border-t border-gray-700">
                                <button 
                                    onClick={() => navigate('/login')} 
                                    className="w-full flex items-center justify-center text-sm hover:underline transition-colors text-blue-400 py-2"
                                >
                                    <ArrowLeft size={14} className="mr-2" />
                                    Retour à la connexion
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-4 text-center text-xs text-gray-500">
                    © 2025 Cleanix • Tous droits réservés
                </div>
            </div>
        </div>
    );
}