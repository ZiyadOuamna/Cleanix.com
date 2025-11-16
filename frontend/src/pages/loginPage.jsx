import React, { useState } from 'react';
import { loginUser } from '../services/authService'; // Sera utilisé pour parler à Laravel
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    
    // Seulement email et mot de passe pour la connexion
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fonction pour mettre à jour l'état
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Fonction qui envoie les données de connexion
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            // NOTE: Dans le code réel, on va appeler loginUser(credentials);
            console.log("Tentative de connexion (API):", credentials); 
            
            // Simuler une connexion réussie
            // Ici, tu devras enregistrer le token de Laravel dans le Context
            setMessage("✅ Connexion réussie! Redirection vers le tableau de bord...");
            setTimeout(() => navigate('/dashboard'), 2000); // Rediriger après 2s
            
        } catch (error) {
            // Afficher l'erreur de Laravel (identifiants incorrects, etc.)
            console.error("Erreur de connexion:", error.response?.data);
            setMessage(`❌ Erreur: Identifiants incorrects ou problème API.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Connexion à Cleanix</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="votre.email@exemple.com"
                        />
                    </div>
                    
                    {/* Mot de passe */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex justify-end">
                        <a href="/reset-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">Mot de passe oublié ?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                    >
                        {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
                    </button>
                </form>
                
                {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
                
                <p className="mt-6 text-center text-sm">
                    Nouveau sur Cleanix ? <a onClick={() => navigate('/register')} className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">Inscrivez-vous ici</a>
                </p>
            </div>
        </div>
    );
}