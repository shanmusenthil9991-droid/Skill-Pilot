import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests and attach Bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillpilot_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('skillpilot_token');
        localStorage.removeItem('skillpilot_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
