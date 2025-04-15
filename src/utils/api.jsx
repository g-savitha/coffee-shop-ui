import axios from "axios";

// Determine the API URL based on environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('API Configuration:', {
  baseURL: API_URL,
  environment: import.meta.env.MODE
});

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Enable sending cookies in cross-origin requests
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Request interceptor:', {
    url: config.url,
    method: config.method,
    hasToken: !!token,
    tokenLength: token?.length,
    currentHeaders: config.headers
  });

  if (token) {
    // Make sure Authorization header is properly set
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    };
    
    console.log('Token added to request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
  } else {
    console.warn('No token found for request:', {
      url: config.url,
      method: config.method
    });
  }
  return config;
},
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      requestHeaders: error.config?.headers
    });
    return Promise.reject(error);
  }
);

export default api;