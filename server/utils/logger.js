/**
 * Système de logs sécurisé pour la production
 * Évite d'exposer des informations sensibles
 */

const isProduction = process.env.NODE_ENV === 'production';

const logger = {
  // Log d'information générale (toujours affiché)
  info: (message, data = null) => {
    console.log(`[INFO] ${message}`, data ? (isProduction ? '[DATA HIDDEN]' : data) : '');
  },

  // Log d'erreur (toujours affiché mais données masquées en production)
  error: (message, error = null) => {
    console.error(`[ERROR] ${message}`);
    if (error) {
      if (isProduction) {
        console.error('[ERROR DETAILS HIDDEN IN PRODUCTION]');
      } else {
        console.error(error);
      }
    }
  },

  // Log de debug (seulement en développement)
  debug: (message, data = null) => {
    if (!isProduction) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  },

  // Log de succès
  success: (message) => {
    console.log(`[SUCCESS] ${message}`);
  },

  // Log de warning
  warn: (message) => {
    console.warn(`[WARNING] ${message}`);
  }
};

module.exports = logger;