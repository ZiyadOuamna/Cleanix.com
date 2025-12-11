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
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
});

// Interceptor pour ajouter le token d'authentification à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ajouter un timestamp pour éviter le cache du navigateur
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['X-Timestamp'] = Date.now();
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
 * Supprime le token du serveur, du localStorage, et du sessionStorage
 * Vide également le cache du navigateur pour cette session
 * @returns {Promise<object>} La réponse du serveur
 */
export const logoutUser = async () => {
    try {
        const response = await apiClient.post('/logout');
        // Nettoyer COMPLÈTEMENT le stockage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_type');
        localStorage.removeItem('remembered_email');
        sessionStorage.clear();
        
        // Empêcher la mise en cache de cette requête
        window.history.replaceState(null, null, window.location.href);
        
        return response.data;
    } catch (error) {
        // Même en cas d'erreur, nettoyer le localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_type');
        localStorage.removeItem('remembered_email');
        sessionStorage.clear();
        
        // Empêcher la mise en cache
        window.history.replaceState(null, null, window.location.href);
        
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
 * Récupère les données de l'utilisateur authentifié
 * @returns {Promise<object>} Les données du user
 */
export const getAuthenticatedUser = async () => {
    try {
        const response = await apiClient.get('/user');
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Met à jour le profil de l'utilisateur
 * @param {FormData|object} data - Les données à mettre à jour (nom, prenom, email, etc.)
 * @returns {Promise<object>} Les données mises à jour
 */
export const updateUserProfile = async (data) => {
    try {
        const response = await apiClient.put('/profile', data, {
            headers: {
                'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
            }
        });
        return response.data;
    } catch (error) {
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