import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Récupérer toutes les réclamations de l'utilisateur
 */
export const getReclamations = async (page = 1) => {
  try {
    const response = await apiClient.get(`/reclamations?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer une réclamation spécifique
 */
export const getReclamation = async (reclamationId) => {
  try {
    const response = await apiClient.get(`/reclamations/${reclamationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Créer une nouvelle réclamation
 */
export const createReclamation = async (reclamationData) => {
  try {
    const response = await apiClient.post('/reclamations', reclamationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Répondre à une réclamation (Support/Superviseur)
 */
export const respondToReclamation = async (reclamationId, responseData) => {
  try {
    const response = await apiClient.put(`/reclamations/${reclamationId}`, responseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer toutes les réclamations (Support/Superviseur)
 */
export const getAllReclamations = async (page = 1) => {
  try {
    const response = await apiClient.get(`/all-reclamations?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
