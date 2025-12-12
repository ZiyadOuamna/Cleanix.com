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
 * Récupérer tous les paiements de l'utilisateur
 */
export const getPayments = async (page = 1) => {
  try {
    const response = await apiClient.get(`/payments?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer un paiement spécifique
 */
export const getPayment = async (paymentId) => {
  try {
    const response = await apiClient.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Créer un nouveau paiement
 */
export const createPayment = async (paymentData) => {
  try {
    const response = await apiClient.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Confirmer un paiement (Superviseur)
 */
export const confirmPayment = async (paymentId) => {
  try {
    const response = await apiClient.post(`/payments/${paymentId}/confirm`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Rembourser un paiement (Superviseur)
 */
export const refundPayment = async (paymentId) => {
  try {
    const response = await apiClient.post(`/payments/${paymentId}/refund`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
