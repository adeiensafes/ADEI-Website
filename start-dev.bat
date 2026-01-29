@echo off
echo 🚀 Démarrage en mode DÉVELOPPEMENT

REM S'assurer qu'on est en mode développement
call switch-to-dev.bat

echo.
echo 🐳 Vérification de Docker...

REM Vérifier si Docker est en cours d'exécution
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop.
    pause
    exit /b 1
)

REM Démarrer les services Docker
echo 🚀 Démarrage des services Docker...
docker-compose up -d

REM Attendre que MySQL soit prêt
echo ⏳ Attente que MySQL soit prêt...
timeout /t 5 /nobreak >nul

echo.
echo 🖥️  Démarrage du serveur API...
cd server

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo 📦 Installation des dépendances serveur...
    npm install
)

REM Démarrer le serveur en arrière-plan
echo Démarrage du serveur sur http://localhost:5001
start "ADEI Server" cmd /k "node index.js"

cd ..

REM Attendre que le serveur démarre
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Démarrage du frontend...
cd frontend

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo 📦 Installation des dépendances frontend...
    npm install
)

REM Démarrer le frontend
echo Démarrage du frontend sur http://localhost:3000
start "ADEI Frontend" cmd /k "npm start"

cd ..

echo.
echo ✅ Services démarrés en mode DÉVELOPPEMENT!
echo 📊 Serveur API: http://localhost:5001
echo 🌐 Frontend: http://localhost:3000
echo 🗄️  Base de données: Docker MySQL (localhost:3307)
echo 🔧 phpMyAdmin: http://localhost:8082
echo.
echo Les services sont démarrés dans des fenêtres séparées.
echo Fermez les fenêtres pour arrêter les services.

pause