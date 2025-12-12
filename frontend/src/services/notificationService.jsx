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
 * Récupérer toutes les notifications
 */
export const getNotifications = async (page = 1) => {
  try {
    const response = await apiClient.get(`/notifications?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer les notifications non lues
 */
export const getUnreadNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications/unread');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer le résumé des notifications par type
 */
export const getNotificationsSummary = async () => {
  try {
    const response = await apiClient.get('/notifications/summary');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer les notifications par type spécifique
 */
export const getNotificationsByType = async (type, page = 1) => {
  try {
    const response = await apiClient.get(`/notifications/by-type/${type}?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Marquer une notification comme lue
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.put(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Marquer toutes les notifications comme lues
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiClient.post('/notifications/mark-all-read');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Supprimer une notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
