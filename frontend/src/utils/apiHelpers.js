// Utilitaires pour gérer les réponses d'API

/**
 * Extrait les données d'une réponse d'API en gérant les deux formats :
 * - Nouveau format : { success: true, data: [...] }
 * - Ancien format : [...]
 */
export const extractApiData = (result) => {
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else if (Array.isArray(result)) {
    // Fallback pour l'ancien format
    return result;
  } else {
    console.error('Format de réponse API inattendu:', result);
    return [];
  }
};

/**
 * Effectue un appel d'API avec gestion d'erreurs standardisée
 */
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        data: extractApiData(result),
        raw: result
      };
    } else {
      return {
        success: false,
        error: result.message || 'Erreur lors de la requête',
        data: []
      };
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
    return {
      success: false,
      error: 'Problème de connexion. Veuillez réessayer.',
      data: []
    };
  }
};

/**
 * Gère les erreurs d'API de manière conviviale
 */
export const handleApiError = (error, context = '') => {
  console.error(`Erreur API ${context}:`, error);
  
  // Messages d'erreur conviviaux selon le type d'erreur
  if (error.message && error.message.includes('fetch')) {
    return 'Problème de connexion. Vérifiez votre connexion internet.';
  } else if (error.message && error.message.includes('500')) {
    return 'Service temporairement indisponible. Veuillez réessayer plus tard.';
  } else {
    return 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
  }
};