import api from "./api";

export const login = async (username, password) => {
  try {
    console.log('Attempting login with:', { username });
    console.log('API URL:', import.meta.env.VITE_API_URL);
    
    const response = await api.post('/api/auth/login', { username, password });
    console.log('Login response:', {
      hasToken: !!response.data.token,
      tokenLength: response.data.token?.length,
      staff: response.data.staff
    });
    
    if (!response.data.token) {
      throw new Error('No token received from server');
    }
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.staff));
    
    // Verify token was stored
    const storedToken = localStorage.getItem('token');
    console.log('Stored token verification:', {
      hasToken: !!storedToken,
      tokenLength: storedToken?.length
    });
    
    return response.data;
  }
  catch (error) {
    console.error('Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      endpoint: '/api/auth/login'
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
  const token = localStorage.getItem('token');
  console.log('Current auth state:', {
    hasUser: !!user,
    hasToken: !!token,
    tokenLength: token?.length,
    user: user ? JSON.parse(user) : null
  });
  return user ? JSON.parse(user) : null;
}

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  console.log('Checking authentication:', {
    hasToken: !!token,
    tokenLength: token?.length
  });
  return token !== null;
}