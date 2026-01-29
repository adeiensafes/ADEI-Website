#!/bin/bash

echo "🚀 Démarrage en mode DÉVELOPPEMENT"

# S'assurer qu'on est en mode développement
./switch-to-dev.sh

echo ""
echo "🐳 Vérification de Docker..."

# Vérifier si Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop."
    exit 1
fi

# Démarrer les services Docker si nécessaire
echo "🚀 Démarrage des services Docker..."
docker-compose up -d

# Attendre que MySQL soit prêt
echo "⏳ Attente que MySQL soit prêt..."
sleep 5

echo ""
echo "🖥️  Démarrage du serveur API..."
cd server

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances serveur..."
    npm install
fi

# Démarrer le serveur en arrière-plan
node index.js &
SERVER_PID=$!
cd ..

# Attendre que le serveur démarre
sleep 3

echo ""
echo "🌐 Démarrage du frontend..."
cd frontend

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    npm install
fi

# Démarrer le frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services démarrés en mode DÉVELOPPEMENT!"
echo "📊 Serveur API: http://localhost:5001"
echo "🌐 Frontend: http://localhost:3000"
echo "🗄️  Base de données: Docker MySQL (localhost:3307)"
echo "🔧 phpMyAdmin: http://localhost:8082"
echo ""
echo "Pour arrêter les services, appuyez sur Ctrl+C"

# Fonction pour nettoyer les processus à l'arrêt
cleanup() {
    echo ""
    echo "🛑 Arrêt des services..."
    kill $SERVER_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup INT

# Attendre
wait