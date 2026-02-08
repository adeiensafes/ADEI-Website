const { body, param, validationResult } = require('express-validator');

// Middleware de gestion des erreurs de validation
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Données invalides',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Validateurs pour l'authentification
exports.validateLogin = [
    body('email').trim().isEmail().withMessage('Format d\'email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis'),
    handleValidationErrors
];

// Validateurs pour la création d'utilisateur (Admin)
exports.validateCreateUser = [
    body('username').trim().isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères').escape(),
    body('email').trim().isEmail().withMessage('Format d\'email invalide').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Rôle invalide'),
    handleValidationErrors
];

// Validateurs pour la mise à jour d'utilisateur (Admin)
exports.validateUpdateUser = [
    param('id').isInt().withMessage('ID utilisateur invalide'),
    body('username').optional().trim().isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères').escape(),
    body('email').optional().trim().isEmail().withMessage('Format d\'email invalide').normalizeEmail(),
    body('password').optional().isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Rôle invalide'),
    handleValidationErrors
];

// Validateurs pour le changement de mot de passe (User)
exports.validateChangePassword = [
    body('currentPassword').notEmpty().withMessage('Mot de passe actuel requis'),
    body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères'),
    handleValidationErrors
];
