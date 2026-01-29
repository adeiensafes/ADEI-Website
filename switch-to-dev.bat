@echo off
echo 🔄 Basculement vers l'environnement de DÉVELOPPEMENT...

REM Copier les fichiers de configuration de développement
echo 📋 Configuration du serveur...
copy "server\.env.development" "server\.env" >nul

echo 📋 Configuration du frontend...
copy "frontend\.env.development" "frontend\.env" >nul

echo ✅ Environnement configuré pour le DÉVELOPPEMENT
echo.
echo 🔧 Configuration active:
echo    - API Backend: http://localhost:5001
echo    - Frontend: http://localhost:3000
echo    - Base de données: Docker MySQL (localhost:3307)
echo.
echo 🚀 Pour démarrer:
echo    - Serveur: cd server ^&^& node index.js
echo    - Frontend: cd frontend ^&^& npm start
echo    - Ou utilisez: start-dev.bat

pause