# Script PowerShell pour créer un installeur SC Companion
param(
    [string]$Version = "1.0.0"
)

Write-Host "🚀 Création de l'installeur SC Companion v$Version" -ForegroundColor Green

# Vérifier que l'application est construite
if (-not (Test-Path "dist\electron\main.js")) {
    Write-Host "❌ L'application n'est pas construite. Lancez 'npm run build' d'abord." -ForegroundColor Red
    exit 1
}

# Créer le répertoire d'installeur
$installerDir = "SC-Companion-Windows-Installer"
if (Test-Path $installerDir) {
    Remove-Item $installerDir -Recurse -Force
}
New-Item -ItemType Directory -Path $installerDir | Out-Null

# Copier l'application
Write-Host "📦 Copie des fichiers de l'application..." -ForegroundColor Yellow
Copy-Item "dist" -Destination "$installerDir\app" -Recurse
Copy-Item "node_modules" -Destination "$installerDir\app\node_modules" -Recurse -Force
Copy-Item "package.json" -Destination "$installerDir\app\package.json"

# Créer le script de lancement
$launchScript = @"
@echo off
cd /d "%~dp0app"
echo 🚀 Demarrage de SC Companion...
echo.
node_modules\.bin\electron.cmd .
"@

$launchScript | Out-File -FilePath "$installerDir\SC-Companion.bat" -Encoding ascii

# Créer le fichier README
$readme = @"
# SC Companion - Application de Bureau

## Installation
1. Extraire ce dossier dans C:\Program Files\SC-Companion\ (ou n'importe où)
2. Double-cliquer sur SC-Companion.bat pour lancer l'application

## Utilisation
- Email de démonstration: demo@sc-companion.com
- Mot de passe: demo123
- Vous pouvez aussi créer votre propre compte !

## Fonctionnalités
- ✅ Connexion / Inscription
- ✅ Feed social avec posts
- ✅ Gestion du profil utilisateur  
- ✅ Paramètres et configuration RSI
- ✅ Interface moderne et responsive
- ✅ API intégrée (aucun serveur externe requis)

Version: $Version
Créé avec 💜 par SC Companion Team
"@

$readme | Out-File -FilePath "$installerDir\README.md" -Encoding utf8

# Créer un script d'installation Windows
$installScript = @"
@echo off
title SC Companion - Installation
echo.
echo ================================================
echo     SC Companion - Installation Windows
echo ================================================
echo.

set "installDir=C:\Program Files\SC Companion"
set "currentDir=%~dp0"

echo 📁 Répertoire d'installation: %installDir%
echo.

REM Créer le répertoire d'installation
if not exist "%installDir%" (
    echo 🔧 Création du répertoire d'installation...
    mkdir "%installDir%"
)

REM Copier les fichiers
echo 📦 Copie des fichiers de l'application...
xcopy /E /I /Y "%currentDir%app" "%installDir%\app"
copy /Y "%currentDir%SC-Companion.bat" "%installDir%\SC-Companion.bat"
copy /Y "%currentDir%README.md" "%installDir%\README.md"

REM Créer un raccourci sur le bureau
echo 🔗 Création du raccourci sur le bureau...
powershell -Command "\$WshShell = New-Object -comObject WScript.Shell; \$Shortcut = \$WshShell.CreateShortcut('%USERPROFILE%\Desktop\SC Companion.lnk'); \$Shortcut.TargetPath = '%installDir%\SC-Companion.bat'; \$Shortcut.WorkingDirectory = '%installDir%'; \$Shortcut.Description = 'SC Companion - Application de bureau'; \$Shortcut.Save()"

echo.
echo ✅ Installation terminée !
echo.
echo 🚀 Vous pouvez maintenant lancer SC Companion depuis :
echo    - Le raccourci sur le bureau
echo    - Le fichier : %installDir%\SC-Companion.bat
echo.
pause
"@

$installScript | Out-File -FilePath "$installerDir\INSTALLER.bat" -Encoding ascii

Write-Host "✅ Installeur créé avec succès !" -ForegroundColor Green
Write-Host "📍 Emplacement: $installerDir" -ForegroundColor Cyan
Write-Host "" 
Write-Host "Pour installer SC Companion :" -ForegroundColor Yellow
Write-Host "1. Allez dans le dossier: $installerDir" -ForegroundColor White
Write-Host "2. Exécutez: INSTALLER.bat (en tant qu'administrateur)" -ForegroundColor White
Write-Host "3. Ou copiez manuellement le dossier et lancez SC-Companion.bat" -ForegroundColor White

# Créer une archive ZIP si 7-Zip est disponible
if (Get-Command "7z" -ErrorAction SilentlyContinue) {
    Write-Host "📦 Création de l'archive ZIP..." -ForegroundColor Yellow
    & 7z a -tzip "SC-Companion-v$Version-Windows.zip" "$installerDir\*"
    Write-Host "✅ Archive créée: SC-Companion-v$Version-Windows.zip" -ForegroundColor Green
} else {
    Write-Host "💡 Astuce: Installez 7-Zip pour créer automatiquement une archive ZIP" -ForegroundColor Yellow
}