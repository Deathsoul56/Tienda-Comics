import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 segundos de timeout
  withCredentials: true
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Error de conexión con el servidor. Verifica que el servidor esté corriendo.');
    }
    return Promise.reject(error);
  }
);

export const getComics = async () => {
  try {
    const response = await api.get('/comics');
    return response.data;
  } catch (error) {
    console.error('Error al obtener cómics:', error);
    throw error;
  }
};

export const getComicById = async (id) => {
  try {
    const response = await api.get(`/comics/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToCart = async (userId, comicId, quantity) => {
  try {
    const response = await api.post('/cart', { userId, comicId, quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCart = async (userId) => {
  try {
    const response = await api.get(`/cart/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 