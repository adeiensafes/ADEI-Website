#!/bin/bash

echo "🚀 Déploiement en production..."

# Copier le fichier d'environnement de production
echo "📋 Configuration de l'environnement de production..."
cp server/.env.production server/.env

# Build du frontend avec la configuration de production
echo "🏗️  Build du frontend..."
cd frontend
npm run build
cd ..

# Redémarrer le serveur (adapter selon votre configuration)
echo "🔄 Redémarrage du serveur..."
cd server
npm install --production
# pm2 restart adei-api || node index.js

echo "✅ Déploiement terminé!"
echo "🌐 Site: https://adei-ensaf.ma"
echo "🔗 API: https://api.adei-ensaf.ma"