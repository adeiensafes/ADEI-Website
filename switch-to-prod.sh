#!/bin/bash

echo "🔄 Basculement vers l'environnement de PRODUCTION..."

# Copier les fichiers de configuration de production
echo "📋 Configuration du serveur..."
cp server/.env.production server/.env

echo "📋 Configuration du frontend..."
cp frontend/.env.production frontend/.env

echo "✅ Environnement configuré pour la PRODUCTION"
echo ""
echo "🔧 Configuration active:"
echo "   - API Backend: Port 5001 (production)"
echo "   - Frontend: Build de production"
echo "   - Base de données: MySQL de production"
echo ""
echo "🚀 Pour démarrer:"
echo "   - Build frontend: cd frontend && npm run build"
echo "   - Serveur: cd server && node index.js"
echo "   - Ou utilisez: ./deploy-production.sh"