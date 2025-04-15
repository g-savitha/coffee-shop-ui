import axios from "axios";

// Determine the API URL based on environment
// After fixing the port conflict, backend should be on 3001
const API_URL = process.env.NODE_ENV === 'production'
  ? '/api' // In production, the backend serves the frontend, so we use a relative path
  : 'http://localhost:3001/api'; // Backend should be running on port 3001 now

console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorize = `Bearer ${token}`;
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
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;