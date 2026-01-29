#!/bin/bash

echo "🔄 Basculement vers l'environnement de DÉVELOPPEMENT..."

# Copier les fichiers de configuration de développement
echo "📋 Configuration du serveur..."
cp server/.env.development server/.env

echo "📋 Configuration du frontend..."
cp frontend/.env.development frontend/.env

echo "✅ Environnement configuré pour le DÉVELOPPEMENT"
echo ""
echo "🔧 Configuration active:"
echo "   - API Backend: http://localhost:5001"
echo "   - Frontend: http://localhost:3000"
echo "   - Base de données: Docker MySQL (localhost:3307)"
echo ""
echo "🚀 Pour démarrer:"
echo "   - Serveur: cd server && node index.js"
echo "   - Frontend: cd frontend && npm start"
echo "   - Ou utilisez: ./start-dev.sh"