#!/bin/bash

echo "🚀 Déploiement en PRODUCTION..."

# S'assurer qu'on est en mode production
./switch-to-prod.sh

echo ""
echo "🏗️  Build du frontend..."
cd frontend
npm install --production
npm run build
cd ..

echo ""
echo "📦 Installation des dépendances serveur..."
cd server
npm install --production
cd ..

echo ""
echo "📦 Installation des dépendances API (Passenger entry point)..."
cd api
npm install --production
cd ..

echo ""
echo "✅ Déploiement terminé!"
echo "🌐 Site: https://adei-ensaf.ma"
echo "🔗 API: https://api.adei-ensaf.ma"
echo ""
echo "🚀 Pour démarrer le serveur:"
echo "   cd server && node index.js"
echo ""
echo "📝 NOTE: Passenger utilise /api/index.js comme point d'entrée"