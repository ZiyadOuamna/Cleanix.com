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
 * Récupérer toutes les évaluations
 */
export const getEvaluations = async (page = 1) => {
  try {
    const response = await apiClient.get(`/evaluations?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer une évaluation spécifique
 */
export const getEvaluation = async (evaluationId) => {
  try {
    const response = await apiClient.get(`/evaluations/${evaluationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Créer une évaluation pour une commande
 */
export const createEvaluation = async (orderId, evaluationData) => {
  try {
    const response = await apiClient.post(`/orders/${orderId}/evaluate`, evaluationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
