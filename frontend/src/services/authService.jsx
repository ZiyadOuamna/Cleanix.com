import axios from 'axios';

// 🚨 ATTENTION : URL DE L'API LARAVEL 
// CHANGEZ CETTE URL si votre serveur Laravel n'est pas sur le port 8000 ou utilise un autre domaine
const API_URL = 'http://localhost:8000/api'; 

const apiClient = axios.create({
  baseURL: API_URL,
  // TRES IMPORTANT pour Laravel Sanctum: active l'envoi et la réception des cookies de session
  withCredentials: true, 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Envoie les données d'inscription au backend Laravel (Route /api/register)
 * @param {object} userData - Données du formulaire (name, email, password, password_confirmation, type_compte, etc.)
 * @returns {Promise<object>} La réponse du serveur (généralement l'utilisateur créé)
 */
export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/register', userData);
        return response.data;
    } catch (error) {
        // Renvoie l'erreur pour que le composant (RegisterPage) puisse l'afficher
        throw error;
    }
};

/**
 * Envoie les identifiants pour la connexion (Route /api/login ou équivalent)
 * @param {object} credentials - {email, password}
 * @returns {Promise<object>} La réponse du serveur (token ou succès)
 */
export const loginUser = async (credentials) => {
    try {
        // NOTE: Si Laravel utilise un endpoint différent de /login, changez-le ici
        const response = await apiClient.post('/login', credentials);
        return response.data;
    } catch (error) {
        // Renvoie l'erreur pour que le composant (LoginPage) puisse l'afficher
        throw error;
    }
};

/**
 * Vérifie si l'utilisateur est connecté (souvent appelé au démarrage de l'app)
 * Utilise la route Laravel /api/user (qui utilise le middleware 'auth:sanctum')
 */
export const checkAuth = async () => {
    try {
        const response = await apiClient.get('/user');
        return response.data;
    } catch (error) {
        return null; // Pas connecté
    }
};