import api from "./api";

export const login = async (username, password) => {
  try {
    console.log('Attempting login with:', { username });
    console.log('API URL:', import.meta.env.VITE_API_URL);
    
    const response = await api.post('/auth/login', { username, password });
    console.log('Login response:', response.data);
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.staff));
    return response.data;
  }
  catch (error) {
    console.error('Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
}

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
}