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

// Wallet
export const getWallet = async () => {
  try {
    const response = await apiClient.get('/wallet');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTransactions = async (page = 1) => {
  try {
    const response = await apiClient.get('/wallet/transactions', { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentMethods = async () => {
  try {
    const response = await apiClient.get('/wallet/payment-methods');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPaymentMethod = async (type, details) => {
  try {
    const response = await apiClient.post('/wallet/payment-methods', { type, details });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestWithdrawal = async (amount, paymentMethodId) => {
  try {
    const response = await apiClient.post('/wallet/withdraw', {
      amount,
      payment_method_id: paymentMethodId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
