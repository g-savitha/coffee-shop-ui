import api from "./api";

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.staff));
    return response.data;
  }
  catch (error) {
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