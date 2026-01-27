// Gestionnaire d'erreurs centralisé pour l'API
const logger = require('./logger');

class ErrorHandler {
  static handleDatabaseError(error, context = '') {
    // Log détaillé pour les développeurs
    logger.error(`Database Error in ${context}:`, {
      message: error.message,
      stack: error.stack,
      name: error.name,
      sql: error.sql || 'N/A'
    });

    // Message générique pour les utilisateurs
    return {
      success: false,
      message: 'Service temporairement indisponible. Veuillez réessayer plus tard.',
      code: 'DB_ERROR'
    };
  }

  static handleValidationError(error, context = '') {
    logger.warn(`Validation Error in ${context}:`, {
      message: error.message,
      errors: error.errors || []
    });

    return {
      success: false,
      message: 'Données invalides fournies.',
      code: 'VALIDATION_ERROR'
    };
  }

  static handleAuthError(error, context = '') {
    logger.warn(`Auth Error in ${context}:`, {
      message: error.message
    });

    return {
      success: false,
      message: 'Accès non autorisé.',
      code: 'AUTH_ERROR'
    };
  }

  static handleGenericError(error, context = '') {
    logger.error(`Generic Error in ${context}:`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return {
      success: false,
      message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
      code: 'GENERIC_ERROR'
    };
  }

  static isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  static sendErrorResponse(res, error, context = '', statusCode = 500) {
    let errorResponse;

    // Déterminer le type d'erreur et la réponse appropriée
    if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeDatabaseError') {
      errorResponse = this.handleDatabaseError(error, context);
    } else if (error.name === 'SequelizeValidationError') {
      errorResponse = this.handleValidationError(error, context);
      statusCode = 400;
    } else if (error.name === 'UnauthorizedError' || error.message.includes('unauthorized')) {
      errorResponse = this.handleAuthError(error, context);
      statusCode = 401;
    } else {
      errorResponse = this.handleGenericError(error, context);
    }

    // En développement, ajouter plus de détails
    if (!this.isProduction()) {
      errorResponse.debug = {
        originalError: error.message,
        stack: error.stack?.split('\n').slice(0, 5) // Limiter la stack trace
      };
    }

    res.status(statusCode).json(errorResponse);
  }

  // Middleware pour capturer les erreurs non gérées
  static globalErrorHandler(err, req, res, next) {
    const context = `${req.method} ${req.path}`;
    this.sendErrorResponse(res, err, context);
  }

  // Wrapper pour les routes async
  static asyncWrapper(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = ErrorHandler;