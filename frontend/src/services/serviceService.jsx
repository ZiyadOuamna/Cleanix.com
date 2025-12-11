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
    const formData = new FormData();
    
    // Ajouter les champs texte
    formData.append('nom', serviceData.nom);
    formData.append('description', serviceData.description);
    formData.append('prix', serviceData.prix);
    
    if (serviceData.duree_prevue) {
      formData.append('duree_prevue', serviceData.duree_prevue);
    }
    if (serviceData.adresse) {
      formData.append('adresse', serviceData.adresse);
    }
    
    // Ajouter l'image si présente
    if (serviceData.image) {
      formData.append('image', serviceData.image);
    }
    
    const response = await apiClient.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
    const formData = new FormData();
    
    // Ajouter seulement les champs fournis
    if (serviceData.nom) formData.append('nom', serviceData.nom);
    if (serviceData.description) formData.append('description', serviceData.description);
    if (serviceData.prix) formData.append('prix', serviceData.prix);
    if (serviceData.duree_prevue) formData.append('duree_prevue', serviceData.duree_prevue);
    if (serviceData.adresse) formData.append('adresse', serviceData.adresse);
    if (serviceData.est_actif !== undefined) formData.append('est_actif', serviceData.est_actif);
    if (serviceData.image) formData.append('image', serviceData.image);
    
    const response = await apiClient.put(`/services/${serviceId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
