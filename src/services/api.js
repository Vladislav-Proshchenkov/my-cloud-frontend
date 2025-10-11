import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Доступ запрещен');
    } else if (error.response?.status === 401) {
      console.error('Требуется авторизация');
    }
    return Promise.reject(error);
  }
);

export default api;