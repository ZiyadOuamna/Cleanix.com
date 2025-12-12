import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('auth_token');

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Request a refund for an order
 * @param {number} orderId - The order ID
 * @param {string} reason - Reason for refund (max 1000 chars)
 * @param {number} amount - Refund amount
 * @returns {Promise}
 */
export const requestRefund = async (orderId, reason, amount) => {
  try {
    const response = await api.post(`/orders/${orderId}/refund`, {
      reason,
      amount,
    });
    return response.data;
  } catch (error) {
    console.error('Error requesting refund:', error);
    throw error.response?.data || error;
  }
};

/**
 * Approve a refund (Superviseur only)
 * @param {number} orderId - The order ID
 * @returns {Promise}
 */
export const approveRefund = async (orderId) => {
  try {
    const response = await api.post(`/orders/${orderId}/approve-refund`);
    return response.data;
  } catch (error) {
    console.error('Error approving refund:', error);
    throw error.response?.data || error;
  }
};

export default {
  requestRefund,
  approveRefund,
};
