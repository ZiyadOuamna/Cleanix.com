import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== ORDERS SERVICES =====

/**
 * Récupérer les commandes reçues (non acceptées)
 */
export const getReceivedOrders = async () => {
  try {
    const response = await apiClient.get('/orders/received');
    return response.data;
  } catch (error) {
    console.error('Error fetching received orders:', error);
    throw error.response?.data || error;
  }
};

/**
 * Récupérer les commandes acceptées
 */
export const getAcceptedOrders = async () => {
  try {
    const response = await apiClient.get('/orders/accepted');
    return response.data;
  } catch (error) {
    console.error('Error fetching accepted orders:', error);
    throw error.response?.data || error;
  }
};

/**
 * Récupérer l'historique des commandes
 */
export const getOrderHistory = async (page = 1) => {
  try {
    const response = await apiClient.get('/orders/history', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error.response?.data || error;
  }
};

/**
 * Créer une nouvelle commande
 */
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error.response?.data || error;
  }
};

// ===== PROPOSALS (PROPOSITIONS DE PRIX) =====

/**
 * Proposer un prix pour une commande
 */
export const proposePrice = async (orderId, proposalData) => {
  try {
    const response = await apiClient.post(`/orders/${orderId}/propose`, proposalData);
    return response.data;
  } catch (error) {
    console.error('Error proposing price:', error);
    throw error.response?.data || error;
  }
};

/**
 * Accepter une proposition (Client)
 */
export const acceptProposal = async (proposalId) => {
  try {
    const response = await apiClient.post(`/proposals/${proposalId}/accept`);
    return response.data;
  } catch (error) {
    console.error('Error accepting proposal:', error);
    throw error.response?.data || error;
  }
};

/**
 * Refuser une proposition (Client)
 */
export const rejectProposal = async (proposalId) => {
  try {
    const response = await apiClient.post(`/proposals/${proposalId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting proposal:', error);
    throw error.response?.data || error;
  }
};

/**
 * Annuler une proposition (Freelancer)
 */
export const cancelProposal = async (proposalId) => {
  try {
    const response = await apiClient.post(`/proposals/${proposalId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling proposal:', error);
    throw error.response?.data || error;
  }
};

// ===== ORDER ACTIONS =====

/**
 * Commencer une commande (Freelancer)
 */
export const startOrder = async (orderId) => {
  try {
    const response = await apiClient.post(`/orders/${orderId}/start`);
    return response.data;
  } catch (error) {
    console.error('Error starting order:', error);
    throw error.response?.data || error;
  }
};

/**
 * Terminer une commande (Freelancer)
 */
export const completeOrder = async (orderId, completionData) => {
  try {
    const response = await apiClient.post(`/orders/${orderId}/complete`, completionData);
    return response.data;
  } catch (error) {
    console.error('Error completing order:', error);
    throw error.response?.data || error;
  }
};

/**
 * Ajouter un avis à une commande (Client)
 */
export const addReview = async (orderId, reviewData) => {
  try {
    const response = await apiClient.post(`/orders/${orderId}/review`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error.response?.data || error;
  }
};

/**
 * Annuler une commande (Client)
 */
export const cancelOrder = async (orderId) => {
  try {
    const response = await apiClient.post(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error.response?.data || error;
  }
};

export default apiClient;
