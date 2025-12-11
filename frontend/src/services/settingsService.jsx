import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Settings
export const getSettings = async () => {
  try {
    const response = await apiClient.get('/settings');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendVerificationEmail = async (email) => {
  try {
    const response = await apiClient.post('/settings/send-email-code', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const confirmEmailCode = async (code, email) => {
  try {
    const response = await apiClient.post('/settings/confirm-email-code', { code, email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (currentPassword, newPassword, newPasswordConfirmation) => {
  try {
    const response = await apiClient.post('/settings/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNotificationSettings = async (settings) => {
  try {
    const response = await apiClient.put('/settings/notifications', settings);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePrivacySettings = async (settings) => {
  try {
    const response = await apiClient.put('/settings/privacy', settings);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAvailabilitySettings = async (availability) => {
  try {
    const response = await apiClient.put('/settings/availability', { availability });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBankInfo = async (bankData) => {
  try {
    const response = await apiClient.put('/settings/bank-info', bankData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadIdentityDocuments = async (formData) => {
  try {
    const response = await apiClient.post('/settings/upload-identity', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
