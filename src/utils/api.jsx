import axios from "axios";

// Determine the API URL based on environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Enable sending cookies in cross-origin requests
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Fixed header name from 'Authorize' to 'Authorization'
  }
  return config;
},
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default api;