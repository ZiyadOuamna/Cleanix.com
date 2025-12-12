import React, { useContext, useState, useEffect } from 'react';
import { SuperviseurContext } from './superviseurContext';
import { User, Lock, Globe, Save, XCircle, Loader } from 'lucide-react';
import superviseurService from '../../services/superviseurService';

const COLORS = {
    primary: '#2d2c86',
};

export default function SettingsSuperviseurPage() {
    const { isDarkMode } = useContext(SuperviseurContext);
    const [loading, setLoading] = useState(true);

    const [settingsForm, setSettingsForm] = useState({
        fullName: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
        language: 'fr'
    });

    const [pwdStrength, setPwdStrength] = useState(0);
    const [message, setMessage] = useState('');

    // Charger les données du superviseur connecté
    useEffect(() => {
        loadSuperviseurData();
    }, []);

    const loadSuperviseurData = async () => {
        try {
            setLoading(true);
            const response = await superviseurService.getCurrentUser();
            if (response.success && response.data) {
                const user = response.data;
                setSettingsForm(prev => ({
                    ...prev,
                    fullName: `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Superviseur',
                    email: user.email || ''
                }));
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            setMessage('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    }

    // --- Helpers ---
    const calculateStrength = (pwd) => {
        let score = 0;
        if (!pwd) return 0;
        if (pwd.length > 5) score += 1; // Longueur mini
        if (pwd.length > 7) score += 1; // Longueur bonne
        if (/[A-Z]/.test(pwd)) score += 1; // Majuscule
        if (/[0-9]/.test(pwd)) score += 1; // Chiffre
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1; // Caractère spécial
        return Math.min(score, 4);
    };
    // --- Helpers pour l'affichage ---
    const getStrengthColor = (score) => {
        if (score <= 1) return 'bg-red-500';
        if (score === 2) return 'bg-orange-500';
        if (score === 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthLabel = (score) => {
        if (score <= 1) return 'Faible';
        if (score === 2) return 'Moyen';
        if (score === 3) return 'Bon';
        return 'Fort';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettingsForm(prev => ({ ...prev, [name]: value }));
        if (name === 'newPassword') {
            setPwdStrength(calculateStrength(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (settingsForm.newPassword && settingsForm.newPassword !== settingsForm.confirmPassword) {
            setMessage('❌ Les mots de passe ne correspondent pas.');
            return;
        }
        
        try {
            setLoading(true);
            // Pour l'instant, on affiche un message de succès
            // Un vrai appel API pour update viendrait ici
            setMessage("✅ Modifications enregistrées avec succès !");
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            setMessage('❌ Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    // Classes dynamiques pour le mode sombre/clair
    const cardClass = `rounded-2xl shadow-sm border p-6 h-full transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-500' : 'bg-white border-gray-300'}`;
    const labelClass = `block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;
    const inputClass = `w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500' : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-100 focus:border-blue-400'}`;

    if (loading && !settingsForm.email) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-[#f0fafe]'}`}>
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin" size={32} />
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col">
            
            {/* En-tête compact */}
            <div className="mb-6 flex items-center justify-between flex-shrink-0">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Paramètres du Compte</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gérez vos informations personnelles et votre sécurité.</p>
                </div>
                
                {/* Message Flash */}
                {message && (
                    <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
                        <span>✓</span> {message}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6 overflow-hidden">
                {/* GRILLE PRINCIPALE : 2 Colonnes qui prennent toute la hauteur disponible */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto lg:overflow-visible">
                    
                    {/* COLONNE GAUCHE : Informations & Préférences */}
                    <div className="flex flex-col gap-6 ">
                        {/* Carte Infos */}
                        <div className={cardClass}>
                            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 `}>
                                <User size={20} className="text-blue-500" /> Informations
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Nom Complet</label>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        value={settingsForm.fullName} 
                                        onChange={handleChange}
                                        className={inputClass} 
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Adresse Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={settingsForm.email} 
                                        onChange={handleChange}
                                        className={inputClass} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Carte Préférences (Langue) */}
                        <div className={`${cardClass} flex-grow-0`}>
                            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                <Globe size={20} className="text-purple-500" /> Préférences
                            </h3>
                            <div>
                                <label className={labelClass}>Langue par défaut</label>
                                <select 
                                    name="language"
                                    value={settingsForm.language}
                                    onChange={handleChange}
                                    className={`${inputClass} appearance-none`}
                                >
                                    <option value="fr">Français</option>
                                    <option value="ar">Arabe</option>
                                    <option value="en">Anglais</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* COLONNE DROITE : Sécurité (Mot de passe) */}
                    <div className="h-full">
                        <div className={cardClass}>
                            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                <Lock size={20} className="text-orange-500" /> Sécurité
                            </h3>
                            
                            <div className="space-y-5">
                                {/* Nouveau MDP */}
                                <div>
                                    <label className={labelClass}>Nouveau Mot de Passe</label>
                                    <input 
                                        type="password" 
                                        name="newPassword"
                                        value={settingsForm.newPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••" 
                                        className={inputClass}
                                    />
                                    {/* Barre de force */}
                                    {settingsForm.newPassword && (
                                        <div className="mt-2 animate-fade-in">
                                            <div className="flex space-x-1 h-1.5 w-full bg-gray-200/50 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-500 ease-out ${getStrengthColor(pwdStrength)}`} 
                                                    style={{ width: `${(pwdStrength / 4) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className={`text-xs mt-1 text-right font-medium ${
                                                pwdStrength <= 1 ? 'text-red-500' : 
                                                pwdStrength === 4 ? 'text-green-500' : 'text-yellow-600'
                                            }`}>
                                                Force : {getStrengthLabel(pwdStrength)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirmation */}
                                <div>
                                    <label className={labelClass}>Confirmer le Mot de Passe</label>
                                    <input 
                                        type="password" 
                                        name="confirmPassword"
                                        value={settingsForm.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••" 
                                        className={`${inputClass} ${
                                            settingsForm.confirmPassword && settingsForm.newPassword !== settingsForm.confirmPassword 
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                                            : ''
                                        }`}
                                    />
                                    {settingsForm.confirmPassword && settingsForm.newPassword !== settingsForm.confirmPassword && (
                                        <p className="text-xs text-red-500 mt-1 font-medium flex items-center gap-1">
                                            <XCircle size={12} /> Les mots de passe ne correspondent pas.
                                        </p>
                                    )}
                                </div>

                                <div className={`p-4 rounded-lg text-sm ${isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                                    <p>ℹ️ Pour votre sécurité, utilisez un mot de passe fort avec des majuscules, des chiffres et des symboles.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BARRE D'ACTIONS (Fixe en bas) */}
                <div className={`mt-auto pt-4 border-t flex justify-end gap-3 flex-shrink-0 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button 
                        type="button" 
                        className={`px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Annuler
                    </button>
                    <button 
                        type="submit" 
                        className="px-6 py-2.5 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition transform active:scale-95 flex items-center gap-2"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        <Save size={18} /> Sauvegarder
                    </button>
                </div>
            </form>
        </div>
    );
}