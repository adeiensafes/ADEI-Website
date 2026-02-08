const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Accès non autorisé' });
    }

    // Extract token from "Bearer <token>" or use directly if no Bearer prefix
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    // Verify token signature strictly
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

const adminMiddleware = (req, res, next) => {
  // Ensure request was authenticated first
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentification requise avant vérification admin' });
  }

  if (req.user.role === 'admin') {
    next();
  } else {
    // Log unauthorized admin access attempts
    console.warn(`Unauthorized admin access attempt by user: ${req.user.id} (${req.user.email})`);
    return res.status(403).json({ success: false, message: 'Accès administrateur requis' });
  }
};

// Middleware combiné pour sécuriser les routes admin
const requireAdmin = [authMiddleware, adminMiddleware];

module.exports = { authMiddleware, adminMiddleware, requireAdmin, JWT_SECRET };
