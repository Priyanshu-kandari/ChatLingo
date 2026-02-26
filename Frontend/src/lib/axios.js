import axios from 'axios';

// Shared axios client for all frontend API calls.
export const axiosInstance = axios.create({
  // Use Vite dev proxy by default; can be overridden via VITE_API_BASE_URL.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});
