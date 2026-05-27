import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL ?? '';
const api = axios.create({ baseURL: `${BASE}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('obelix_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
