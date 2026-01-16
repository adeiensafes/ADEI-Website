#!/bin/bash

echo "🚀 Démarrage du test local ADEI"
echo "================================"
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé!"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Démarrer le backend
echo "📡 Démarrage du backend sur http://localhost:5001..."
cd server
npm start &
BACKEND_PID=$!
cd ..

# Attendre que le backend démarre
echo "⏳ Attente du démarrage du backend (10 secondes)..."
sleep 10

# Tester le backend
echo ""
echo "🧪 Test du backend..."
HEALTH_CHECK=$(curl -s http://localhost:5001/health)
if [[ $HEALTH_CHECK == *"ok"* ]]; then
    echo "✅ Backend fonctionne!"
else
    echo "❌ Backend ne répond pas correctement"
    echo "Réponse: $HEALTH_CHECK"
fi

# Démarrer le frontend
echo ""
echo "🎨 Démarrage du frontend sur http://localhost:3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "================================"
echo "✨ Serveurs démarrés!"
echo ""
echo "📡 Backend:  http://localhost:5001"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "Pour arrêter les serveurs:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Ou appuyez sur Ctrl+C"
echo "================================"

# Attendre que l'utilisateur arrête
wait
