#!/bin/bash

echo "==================================="
echo "ADEI Website - Développement"
echo "==================================="
echo ""

# Vérifier si MySQL Docker est en cours d'exécution
if ! docker ps | grep -q "adei_mysql"; then
    echo "🐳 Démarrage de MySQL et phpMyAdmin..."
    docker-compose up -d
    echo "⏳ Attente du démarrage de MySQL..."
    sleep 10
else
    echo "✅ MySQL Docker déjà en cours d'exécution"
fi

echo ""
echo "🔧 Démarrage du backend Node.js..."
cd server
npm start &
BACKEND_PID=$!
cd ..

# Attendre un peu pour que le backend démarre
sleep 3

echo ""
echo "🌐 Démarrage du frontend React..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "==================================="
echo "✅ Services démarrés avec succès!"
echo "==================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5001"
echo "🗄️  phpMyAdmin: http://localhost:8082"
echo ""
echo "📝 Identifiants par défaut:"
echo "   Admin: moslimarabi86@gmail.com / password"
echo "   MySQL: adei_user / adei_password"
echo ""
echo "🛑 Pour arrêter: Ctrl+C puis 'docker-compose down'"
echo "==================================="

# Attendre l'interruption utilisateur
trap "kill $BACKEND_PID $FRONTEND_PID; docker-compose down; exit" INT
wait
