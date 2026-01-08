#!/bin/bash

echo "==================================="
echo "ADEI Website - Docker Deployment"
echo "==================================="
echo ""

echo "🐳 Démarrage des services Docker..."
docker-compose up -d

echo ""
echo "⏳ Attente du démarrage des services..."
sleep 10

echo ""
echo "📊 État des conteneurs:"
docker-compose ps

echo ""
echo "==================================="
echo "✅ Services démarrés avec succès!"
echo "==================================="
echo "🌐 Frontend: http://localhost:3000 (à démarrer manuellement)"
echo "🔧 Backend:  http://localhost:5001"
echo "🗄️  phpMyAdmin: http://localhost:8082"
echo ""
echo "📝 Identifiants par défaut:"
echo "   Admin: admin / password"
echo "   MySQL: adei_user / adei_password"
echo ""
echo "🛑 Pour arrêter: docker-compose down"
echo "==================================="