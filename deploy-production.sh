#!/bin/bash

echo "🚀 Déploiement en PRODUCTION..."
echo ""
echo "⚠️  IMPORTANT: Ce script prépare le frontend localement."
echo "    Les dépendances backend (api/ et server/) doivent être"
echo "    installées DIRECTEMENT sur le serveur de production !"
echo ""

# S'assurer qu'on est en mode production
./switch-to-prod.sh

echo ""
echo "🏗️  Build du frontend..."
cd frontend
npm install --production
npm run build
cd ..

echo ""
echo "✅ Build terminé!"
echo ""
echo "📤 PROCHAINES ÉTAPES SUR LE SERVEUR:"
echo ""
echo "1. Transférer les fichiers (sans node_modules) :"
echo "   rsync -av --exclude='node_modules' --exclude='.git' . adeiensa@adei-ensaf.ma:~/public_html/"
echo ""
echo "2. Sur le serveur, installer les dépendances :"
echo "   ssh adeiensa@adei-ensaf.ma"
echo "   cd ~/public_html/api && npm install --production"
echo "   cd ~/public_html/server && npm install --production"
echo "   touch ~/public_html/api/tmp/restart.txt"
echo ""
echo "3. Vérifier le déploiement :"
echo "   curl https://api.adei-ensaf.ma/auth/check"
echo ""
echo "🌐 Site: https://adei-ensaf.ma"
echo "🔗 API: https://api.adei-ensaf.ma"
echo ""
echo "📖 Documentation: docs/fix-bcrypt-deployment.md"