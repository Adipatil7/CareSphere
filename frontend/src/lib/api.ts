import axios from 'axios';
import { toast } from 'sonner';
import { getToken, removeToken } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ── Request Interceptor: Attach JWT ──
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Global Error Handler ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (no response)
    if (!error.response) {
      toast.error('Connection failed. Please check your network.');
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong';

    switch (status) {
      case 401:
        removeToken();
        toast.error('Session expired. Please login again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        break;
      case 403:
        toast.error('Access denied. You don\'t have permission.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 409:
        toast.error(message);
        break;
      case 422:
        toast.error('Validation failed. Please check your input.');
        break;
      default:
        if (status >= 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error(message);
        }
    }

    return Promise.reject(error);
  }
);

export default api;
