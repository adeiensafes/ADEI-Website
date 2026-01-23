/**
 * Système de logs sécurisé pour le frontend
 * Évite d'exposer des informations sensibles en production
 */

const isProduction = process.env.NODE_ENV === 'production';

const logger = {
  // Log d'erreur sécurisé
  error: (message, error = null) => {
    if (isProduction) {
      // En production, afficher seulement un message générique
      console.error(`[ERROR] ${message}`);
    } else {
      // En développement, afficher tous les détails
      console.error(`[ERROR] ${message}`, error || '');
    }
  },

  // Log d'information
  info: (message) => {
    console.log(`[INFO] ${message}`);
  },

  // Log de debug (seulement en développement)
  debug: (message, data = null) => {
    if (!isProduction) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  },

  // Log de warning
  warn: (message) => {
    console.warn(`[WARNING] ${message}`);
  }
};

export default logger;