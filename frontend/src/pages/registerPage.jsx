import React, { useState } from 'react';
import { registerUser } from '../services/authService'; //pour l'envoi des données au backend Laravel
import { useNavigate } from 'react-router-dom';

// Liste des principales villes du Maroc pour la liste déroulante
const MAROC_VILLES = [
    "Agadir","Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", 
    "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Mohammedia"
];

export default function RegisterPage() {
    const navigate = useNavigate();
    
    
    // Tous les champs que tu as définis
    const [formData, setFormData] = useState({
        cin: '',
        name: '',
        prenom: '',
        tel: '',
        type_compte: 'client', // Valeur par défaut
        ville: MAROC_VILLES[0], // Valeur par défaut
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fonction générale pour mettre à jour l'état
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            // NOTE: Dans le code réel, on va appeler registerUser(formData);
            console.log("Données envoyées à l'API:", formData); 
            
            setMessage(`✅ Inscription envoyée! Type: ${formData.type_compte}.`);
            setTimeout(() => navigate('/login'), 2000); // Rediriger après 2s
            
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error.response?.data);
            setMessage(`❌ Erreur: ${error.respregisteronse?.data?.message || 'Problème de connexion'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">S'inscrire à Cleanix</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Ligne 1: Nom et Prénom */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Prénom</label>
                            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" />
                        </div>
                    </div>
                    
                    {/* Ligne 2: CIN et Téléphone */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">CIN</label>
                            <input type="text" name="cin" value={formData.cin} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                            <input type="tel" name="tel" value={formData.tel} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" />
                        </div>
                    </div>

                    {/* Ligne 3: Choix de la Ville (MODIFIÉ EN LISTE DÉROULANTE) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ville</label>
                        <select
                            name="ville"
                            value={formData.ville}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        >
                            {/* Option par défaut désactivée et vide */}
                            <option value="" disabled>Sélectionner une ville</option>
                            {/* Mapping des villes */}
                            {MAROC_VILLES.map((ville, index) => (
                                <option key={index} value={ville}>
                                    {ville}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ligne 4: Choix du Type de Compte (IMPORTANT!) */}
                    <div className="pt-2">
                        <label className="block text-base font-semibold text-gray-700 mb-2">Quel est votre rôle ?</label>
                        <div className="flex space-x-6">
                            
                            {/* Choix 1: Client */}
                            <label className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg bg-blue-50/50 hover:border-blue-400 transition w-full">
                                <input
                                    type="radio"
                                    name="type_compte"
                                    value="client"
                                    checked={formData.type_compte === 'client'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="font-medium text-gray-900">Je suis un Client</span>
                            </label>
                            
                            {/* Choix 2: Freelancer */}
                            <label className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg bg-green-50/50 hover:border-green-400 transition w-full">
                                <input
                                    type="radio"
                                    name="type_compte"
                                    value="freelancer"
                                    checked={formData.type_compte === 'freelancer'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                                />
                                <span className="font-medium text-gray-900">Je suis un Freelancer</span>
                            </label>

                        </div>
                    </div>
                    
                    {/* Ligne 5: Email */}
                    <div className="pt-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" />
                    </div>

                    {/* Ligne 6: Mots de passe */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                            <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                    >
                        {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                    </button>
                </form>
                
                {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
                
                <p className="mt-4 text-center text-sm">
                    Déjà un compte ? <a href="/login" onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:text-blue-500">Connectez-vous</a>
                </p>
            </div>
        </div>
    );
}