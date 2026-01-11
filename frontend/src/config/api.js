// API configuration
// Use REACT_APP_API_URL from environment variable, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  LOGOUT: `${API_BASE_URL}/api/logout`,
  ME: `${API_BASE_URL}/api/me`,
  
  // Users
  USERS: `${API_BASE_URL}/api/users`,
  USER: (id) => `${API_BASE_URL}/api/users/${id}`,
  
  // Feedbacks
  FEEDBACKS: `${API_BASE_URL}/api/feedbacks`,
  FEEDBACK: (id) => `${API_BASE_URL}/api/feedbacks/${id}`,
  FEEDBACK_LIKE: (id) => `${API_BASE_URL}/api/feedbacks/${id}/like`,
  FEEDBACK_RESPOND: (id) => `${API_BASE_URL}/api/feedbacks/${id}/respond`,
  
  // Public data
  NEWS: `${API_BASE_URL}/api/news`,
  EVENTS: `${API_BASE_URL}/api/events`,
  CLUBS: `${API_BASE_URL}/api/clubs`,
  CONTACT: `${API_BASE_URL}/api/contact`,
};

// Helper function to construct full image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};

export default API_BASE_URL;
