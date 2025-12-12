import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('auth_token');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== USER PROFILE ==========

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement du profil' };
  }
};

// ========== CLIENTS ==========

export const getClients = async (page = 1, search = '', filter = 'all') => {
  try {
    const response = await api.get('/superviseur/clients', {
      params: {
        page,
        search,
        filter,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement des clients' };
  }
};

export const getClientById = async (clientId) => {
  try {
    const response = await api.get(`/superviseur/clients/${clientId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement du client' };
  }
};

export const updateClient = async (clientId, data) => {
  try {
    const response = await api.put(`/superviseur/clients/${clientId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la mise à jour du client' };
  }
};

export const deleteClient = async (clientId) => {
  try {
    const response = await api.delete(`/superviseur/clients/${clientId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la suppression du client' };
  }
};

export const createClient = async (data) => {
  try {
    const response = await api.post('/superviseur/clients', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la création du client' };
  }
};

// ========== FREELANCERS ==========

export const getFreelancers = async (page = 1, search = '', filter = 'all') => {
  try {
    const response = await api.get('/superviseur/freelancers', {
      params: {
        page,
        search,
        filter,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement des freelancers' };
  }
};

export const getFreelancerById = async (freelancerId) => {
  try {
    const response = await api.get(`/superviseur/freelancers/${freelancerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement du freelancer' };
  }
};

export const updateFreelancer = async (freelancerId, data) => {
  try {
    const response = await api.put(`/superviseur/freelancers/${freelancerId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la mise à jour du freelancer' };
  }
};

export const deleteFreelancer = async (freelancerId) => {
  try {
    const response = await api.delete(`/superviseur/freelancers/${freelancerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la suppression du freelancer' };
  }
};

export const createFreelancer = async (data) => {
  try {
    const response = await api.post('/superviseur/freelancers', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la création du freelancer' };
  }
};

// ========== STATISTIQUES ==========

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/superviseur/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement des statistiques' };
  }
};

export const getUsersStats = async () => {
  try {
    const response = await api.get('/superviseur/stats/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement des statistiques utilisateurs' };
  }
};

export const getTransactionStats = async () => {
  try {
    const response = await api.get('/superviseur/stats/transactions');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement des statistiques transactions' };
  }
};

// ========== RECLAMATIONS ==========

export const getReclamations = async (page = 1, search = '', filter = 'all') => {
  try {
    const response = await api.get('/superviseur/reclamations', {
      params: {
        page,
        search,
        filter,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement des réclamations' };
  }
};

export const getReclamationById = async (reclamationId) => {
  try {
    const response = await api.get(`/superviseur/reclamations/${reclamationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement de la réclamation' };
  }
};

export const updateReclamation = async (reclamationId, data) => {
  try {
    const response = await api.put(`/superviseur/reclamations/${reclamationId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la mise à jour de la réclamation' };
  }
};

export const resolveReclamation = async (reclamationId, resolution) => {
  try {
    const response = await api.post(`/superviseur/reclamations/${reclamationId}/resolve`, {
      resolution,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la résolution de la réclamation' };
  }
};

// ========== SERVICES ==========

export const getPendingServices = async (page = 1) => {
  try {
    const response = await api.get('/superviseur/services/pending', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement des services' };
  }
};

export const approveService = async (serviceId) => {
  try {
    const response = await api.post(`/superviseur/services/${serviceId}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de l\'approbation du service' };
  }
};

export const rejectService = async (serviceId, reason) => {
  try {
    const response = await api.post(`/superviseur/services/${serviceId}/reject`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du rejet du service' };
  }
};

// ========== PAIEMENTS ==========

export const getPayments = async (page = 1, search = '', filter = 'all') => {
  try {
    const response = await api.get('/superviseur/payments', {
      params: {
        page,
        search,
        filter,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement des paiements' };
  }
};

export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/superviseur/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement du paiement' };
  }
};

export const processRefund = async (paymentId, amount) => {
  try {
    const response = await api.post(`/superviseur/payments/${paymentId}/refund`, {
      amount,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du remboursement' };
  }
};

// ========== COMMANDES ==========

export const getOrders = async (page = 1, search = '', filter = 'all') => {
  try {
    const response = await api.get('/superviseur/orders', {
      params: {
        page,
        search,
        filter,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement des commandes' };
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/superviseur/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du chargement de la commande' };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/superviseur/orders/${orderId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la mise à jour de la commande' };
  }
};

// Superviseur Management
export const getSuperviseurs = async (page = 1, search = '', status = 'all') => {
  try {
    const params = new URLSearchParams({
      page,
      search,
      status
    });
    const response = await api.get(`/superviseur/superviseurs?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSuperviseurById = async (superviseurId) => {
  try {
    const response = await api.get(`/superviseur/superviseurs/${superviseurId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createSuperviseur = async (data) => {
  try {
    const response = await api.post('/superviseur/superviseurs', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateSuperviseur = async (superviseurId, data) => {
  try {
    const response = await api.put(`/superviseur/superviseurs/${superviseurId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteSuperviseur = async (superviseurId) => {
  try {
    const response = await api.delete(`/superviseur/superviseurs/${superviseurId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  // User
  getCurrentUser,

  // Clients
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  createClient,
  
  // Freelancers
  getFreelancers,
  getFreelancerById,
  updateFreelancer,
  deleteFreelancer,
  createFreelancer,
  
  // Stats
  getDashboardStats,
  getUsersStats,
  getTransactionStats,
  
  // Reclamations
  getReclamations,
  getReclamationById,
  updateReclamation,
  resolveReclamation,
  
  // Services
  getPendingServices,
  approveService,
  rejectService,
  
  // Payments
  getPayments,
  getPaymentById,
  processRefund,
  
  // Orders
  getOrders,
  getOrderById,
  updateOrderStatus,
  
  // Superviseurs
  getSuperviseurs,
  getSuperviseurById,
  createSuperviseur,
  updateSuperviseur,
  deleteSuperviseur,
};
