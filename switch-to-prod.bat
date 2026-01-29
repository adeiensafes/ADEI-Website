@echo off
echo 🔄 Basculement vers l'environnement de PRODUCTION...

REM Copier les fichiers de configuration de production
echo 📋 Configuration du serveur...
copy "server\.env.production" "server\.env" >nul

echo 📋 Configuration du frontend...
copy "frontend\.env.production" "frontend\.env" >nul

echo ✅ Environnement configuré pour la PRODUCTION
echo.
echo 🔧 Configuration active:
echo    - API Backend: Port 5001 (production)
echo    - Frontend: Build de production
echo    - Base de données: MySQL de production
echo.
echo 🚀 Pour démarrer:
echo    - Build frontend: cd frontend ^&^& npm run build
echo    - Serveur: cd server ^&^& node index.js
echo    - Ou utilisez: deploy-production.bat

pause