// Configuration de l'API
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5001'
  : 'https://api.adei-ensaf.ma';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  LOGOUT: `${API_BASE_URL}/api/logout`,

  // Data
  NEWS: `${API_BASE_URL}/api/news`,
  EVENTS: `${API_BASE_URL}/api/events`,
  CLUBS: `${API_BASE_URL}/api/clubs`,
  FILIERES: `${API_BASE_URL}/api/filieres`,
  ADEI_MEMBERS: `${API_BASE_URL}/api/adei-members`,
  PARTNERS: `${API_BASE_URL}/api/partners`,
  USERS: `${API_BASE_URL}/api/users`,
  USER_PROFILE: `${API_BASE_URL}/api/users/me`,

  // User interactions
  CONTACT: `${API_BASE_URL}/api/contact`,
  FEEDBACKS: `${API_BASE_URL}/api/feedbacks`,
  FEEDBACKS_PUBLIC: `${API_BASE_URL}/api/feedbacks/public`,
  MESSAGES: `${API_BASE_URL}/api/messages`,
};

// Fonction wrapper pour fetch avec headers anti-bot
export const apiFetch = async (url, options = {}) => {
  const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  return fetch(url, mergedOptions);
};

// Fonction utilitaire pour construire les URLs d'API
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}/api/${endpoint}`;
};

// Fonction utilitaire pour construire les URLs d'images
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/default.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `${API_BASE_URL}${imagePath}`;
  return imagePath;
};

export default API_BASE_URL;
