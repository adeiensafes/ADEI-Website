#!/bin/bash

echo "🔍 Vérification de l'environnement actuel..."
echo ""

# Vérifier la configuration du serveur
echo "🖥️  Configuration Serveur:"
if [ -f "server/.env" ]; then
    NODE_ENV=$(grep "NODE_ENV=" server/.env | cut -d'=' -f2)
    DB_HOST=$(grep "DB_HOST=" server/.env | cut -d'=' -f2)
    DB_PORT=$(grep "DB_PORT=" server/.env | cut -d'=' -f2)
    
    echo "   - Environnement: $NODE_ENV"
    echo "   - Base de données: $DB_HOST:$DB_PORT"
else
    echo "   ❌ Fichier server/.env non trouvé"
fi

echo ""

# Vérifier la configuration du frontend
echo "🌐 Configuration Frontend:"
if [ -f "frontend/.env" ]; then
    API_URL=$(grep "REACT_APP_API_URL=" frontend/.env | cut -d'=' -f2)
    ENV_TYPE=$(grep "REACT_APP_ENV=" frontend/.env | cut -d'=' -f2)
    
    echo "   - API URL: $API_URL"
    echo "   - Environnement: $ENV_TYPE"
else
    echo "   ❌ Fichier frontend/.env non trouvé"
fi

echo ""

# Déterminer l'environnement
if [[ "$NODE_ENV" == "development" && "$API_URL" == "http://localhost:5001" ]]; then
    echo "✅ Environnement actuel: DÉVELOPPEMENT"
    echo ""
    echo "🚀 Commandes disponibles:"
    echo "   - Démarrer: ./start-dev.sh"
    echo "   - Basculer vers prod: ./switch-to-prod.sh"
elif [[ "$NODE_ENV" == "production" && "$API_URL" == "https://api.adei-ensaf.ma" ]]; then
    echo "✅ Environnement actuel: PRODUCTION"
    echo ""
    echo "🚀 Commandes disponibles:"
    echo "   - Déployer: ./deploy-production.sh"
    echo "   - Basculer vers dev: ./switch-to-dev.sh"
else
    echo "⚠️  Environnement mixte ou non configuré"
    echo ""
    echo "🔧 Pour configurer:"
    echo "   - Développement: ./switch-to-dev.sh"
    echo "   - Production: ./switch-to-prod.sh"
fi