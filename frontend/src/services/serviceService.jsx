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
 * Récupérer tous les services
 */
export const getAllServices = async (page = 1) => {
  try {
    const response = await apiClient.get(`/services?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer un service spécifique
 */
export const getService = async (serviceId) => {
  try {
    const response = await apiClient.get(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer les services du freelancer connecté
 */
export const getMyServices = async () => {
  try {
    const response = await apiClient.get('/my-services');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Créer un nouveau service (Freelancer)
 */
export const createService = async (serviceData) => {
  try {
    const payload = {
      name: serviceData.name,
      category: serviceData.category,
      serviceType: serviceData.serviceType,
      description: serviceData.description,
      detailedDescription: serviceData.detailedDescription || null,
      zones: serviceData.zones || [],
      availability: serviceData.availability || {},
      includedItems: serviceData.includedItems || [],
      termsAccepted: serviceData.termsAccepted || false,
      pricingAccepted: serviceData.pricingAccepted || false,
      // Champs spécifiques
      nombrePieces: serviceData.nombrePieces || null,
      superficieTotale: serviceData.superficieTotale || null,
      superficie: serviceData.superficie || null,
      nomObjet: serviceData.nomObjet || null,
      prixObjet: serviceData.prixObjet || null,
    };

    const response = await apiClient.post('/services', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mettre à jour un service
 */
export const updateService = async (serviceId, serviceData) => {
  try {
    const payload = {
      name: serviceData.name || null,
      category: serviceData.category || null,
      description: serviceData.description || null,
      detailedDescription: serviceData.detailedDescription || null,
      zones: serviceData.zones || [],
      availability: serviceData.availability || {},
      includedItems: serviceData.includedItems || [],
      duration: serviceData.duration || null,
      address: serviceData.address || null,
    };

    const response = await apiClient.put(`/services/${serviceId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Supprimer un service
 */
export const deleteService = async (serviceId) => {
  try {
    const response = await apiClient.delete(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer les services en attente de validation (Superviseur)
 */
export const getPendingServices = async (page = 1) => {
  try {
    const response = await apiClient.get(`/superviseur/services/pending?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Approuver un service (Superviseur)
 */
export const approveService = async (serviceId, comment = null) => {
  try {
    const response = await apiClient.post(`/superviseur/services/${serviceId}/approve`, {
      comment: comment,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Rejeter un service (Superviseur)
 */
export const rejectService = async (serviceId, reason) => {
  try {
    const response = await apiClient.post(`/superviseur/services/${serviceId}/reject`, {
      reason: reason,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
