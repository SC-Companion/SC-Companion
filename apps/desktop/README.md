# SC Companion - Desktop Application

Application desktop officielle de SC Companion pour Star Citizen.

## 🚀 Fonctionnalités

- **Réseau Social** : Posts, follow, amis, likes
- **Interface moderne** : React + Tailwind + shadcn/ui + daisyUI
- **Auto-update** : Système de mise à jour automatique Discord-style
- **API intégrée** : Serveur embarqué pour les données
- **Cross-platform** : Windows, macOS, Linux

## 📦 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Développement
```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Build
```bash
# Build l'application
npm run build

# Créer l'installeur
npm run build:installer
```

## 🛠️ Scripts disponibles

- `npm run dev` - Mode développement avec hot reload
- `npm run build` - Build de production
- `npm run build:installer` - Créer l'installeur (Windows/Mac/Linux)
- `npm run typecheck` - Vérification TypeScript
- `npm run lint` - Linter ESLint

## 🏗️ Architecture

```
src/
├── components/          # Composants React
│   ├── layout/         # Layouts (Sidebar, TopBar, etc.)
│   └── ui/             # Composants UI réutilisables
├── pages/              # Pages de l'application
├── store/              # État global (Zustand)
├── lib/                # Utilitaires et API client
└── types/              # Types TypeScript

electron/
├── main.ts             # Process principal Electron
├── preload.ts          # Script de préchargement
└── embedded-server.ts  # Serveur API embarqué
```

## 🔄 Auto-update

L'application utilise `electron-updater` pour les mises à jour automatiques :
- Vérification au démarrage
- Interface Discord-style avec bouton "Redémarrer et mettre à jour"
- Téléchargement contrôlé par l'utilisateur

## 🤝 Contribution

Ce repository contient uniquement le code client de l'application desktop. 
Les APIs et services backend sont dans des repositories séparés pour des raisons de sécurité.

## 📄 License

Propriétaire - SC Companion Team