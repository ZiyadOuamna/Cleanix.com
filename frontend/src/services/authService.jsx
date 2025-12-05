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

// Interceptor pour ajouter le token d'authentification à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Envoie les données d'inscription au backend Laravel (Route /api/auth/register)
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
 * Envoie les identifiants pour la connexion (Route /api/login)
 * @param {object} credentials - {email, password}
 * @returns {Promise<object>} La réponse du serveur (token ou succès)
 */
export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post('/login', credentials);
        return response.data;
    } catch (error) {
        // Renvoie l'erreur pour que le composant (LoginPage) puisse l'afficher
        throw error;
    }
};

/**
 * Déconnecte l'utilisateur (Route /api/logout)
 * Supprime le token du serveur et du localStorage
 * @returns {Promise<object>} La réponse du serveur
 */
export const logoutUser = async () => {
    try {
        const response = await apiClient.post('/logout');
        // Nettoyer le localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_type');
        return response.data;
    } catch (error) {
        // Même en cas d'erreur, nettoyer le localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_type');
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

/**
 * Envoie une demande de lien de réinitialisation de mot de passe (Route /api/forgot-password)
 * @param {object} data - { email: '...' }
 * @returns {Promise<object>} La réponse du serveur
 */
export const forgotPassword = async (data) => {
    try {
        // Laravel attend généralement une route POST sur /forgot-password avec le champ 'email'
        const response = await apiClient.post('/forgot-password', data);
        return response.data;
    } catch (error) {
        // Renvoie l'erreur pour que la page puisse l'afficher (ex: "Email introuvable")
        throw error;
    }
};

/**
 * Envoie le nouveau mot de passe avec le token (Route /api/reset-password)
 * @param {object} data - { email, token, password, password_confirmation }
 * @returns {Promise<object>} La réponse du serveur
 */
export const resetPassword = async (data) => {
    try {
        // Laravel attend généralement une route POST sur /reset-password avec ces 4 champs
        const response = await apiClient.post('/reset-password', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};