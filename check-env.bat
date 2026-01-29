@echo off
echo 🔍 Vérification de l'environnement actuel...
echo.

REM Vérifier la configuration du serveur
echo 🖥️  Configuration Serveur:
if exist "server\.env" (
    for /f "tokens=2 delims==" %%a in ('findstr "NODE_ENV=" server\.env') do set NODE_ENV=%%a
    for /f "tokens=2 delims==" %%a in ('findstr "DB_HOST=" server\.env') do set DB_HOST=%%a
    for /f "tokens=2 delims==" %%a in ('findstr "DB_PORT=" server\.env') do set DB_PORT=%%a
    
    echo    - Environnement: %NODE_ENV%
    echo    - Base de données: %DB_HOST%:%DB_PORT%
) else (
    echo    ❌ Fichier server\.env non trouvé
)

echo.

REM Vérifier la configuration du frontend
echo 🌐 Configuration Frontend:
if exist "frontend\.env" (
    for /f "tokens=2 delims==" %%a in ('findstr "REACT_APP_API_URL=" frontend\.env') do set API_URL=%%a
    for /f "tokens=2 delims==" %%a in ('findstr "REACT_APP_ENV=" frontend\.env') do set ENV_TYPE=%%a
    
    echo    - API URL: %API_URL%
    echo    - Environnement: %ENV_TYPE%
) else (
    echo    ❌ Fichier frontend\.env non trouvé
)

echo.

REM Déterminer l'environnement
if "%NODE_ENV%"=="development" if "%API_URL%"=="http://localhost:5001" (
    echo ✅ Environnement actuel: DÉVELOPPEMENT
    echo.
    echo 🚀 Commandes disponibles:
    echo    - Démarrer: start-dev.bat
    echo    - Basculer vers prod: switch-to-prod.bat
) else if "%NODE_ENV%"=="production" if "%API_URL%"=="https://api.adei-ensaf.ma" (
    echo ✅ Environnement actuel: PRODUCTION
    echo.
    echo 🚀 Commandes disponibles:
    echo    - Déployer: deploy-production.bat
    echo    - Basculer vers dev: switch-to-dev.bat
) else (
    echo ⚠️  Environnement mixte ou non configuré
    echo.
    echo 🔧 Pour configurer:
    echo    - Développement: switch-to-dev.bat
    echo    - Production: switch-to-prod.bat
)

pause