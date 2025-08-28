# 🌌 SC Companion

**SC Companion** est une application compagnon pour Star Citizen qui enrichit l'expérience de jeu avec des fonctionnalités sociales, communautaires et analytiques.

## 🚀 Fonctionnalités

### Version 0.0.1 (Actuelle)
- **Réseau social complet** : Posts, likes, follows, amis
- **Système de progression** : XP et niveaux calculés dynamiquement
- **Intégration RSI** : Liaison avec votre compte Star Citizen
- **Système de rôles** : User, Moderator, Admin, Super Admin
- **API REST complète** avec authentification JWT
- **Architecture modulaire** prête pour les extensions

### Fonctionnalités futures
- **Quêtes communautaires** basées sur les logs du jeu
- **Marketplace interne** (monnaie fictive uniquement)
- **Monitoring des performances PC**
- **Upload média** (images/vidéos)
- **Modèle freemium/premium**

## 🏗️ Architecture

Ce projet utilise une architecture monorepo avec les composants suivants :

```
sc-companion/
├── apps/
│   ├── desktop/          # Application Electron + React
│   ├── web-dashboard/    # Dashboard web React + Vite
│   └── landing/          # Page vitrine
├── services/
│   └── api/              # API Backend Node.js + Express + Knex
├── packages/
│   ├── shared/           # Types et schémas partagés
│   └── sdk/              # Client SDK TypeScript
└── docs/                 # Documentation
```

## 🛠️ Technologies

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Knex.js** pour les requêtes base de données
- **SQLite** (dev) / **PostgreSQL** (prod)
- **Zod** pour la validation
- **JWT** pour l'authentification
- **bcrypt** pour le hashage des mots de passe

### Frontend (à venir)
- **Electron** + **React** pour l'app desktop
- **React** + **Vite** pour le dashboard web
- **Tailwind CSS** + **shadcn/ui** + **daisyUI**

### DevOps
- **TypeScript** partout
- **Workspaces npm** pour le monorepo
- **Knex migrations** et seeds
- Architecture Clean avec Repository Pattern

## 📦 Installation

### Prérequis
- Node.js >= 18
- npm >= 9

### Installation
```bash
# Cloner le repo
git clone <repo-url>
cd SC-Companion

# Installer les dépendances
npm install

# Configurer l'environnement
cd services/api
cp .env.example .env
# Éditer .env avec vos paramètres

# Lancer les migrations
npm run migrate

# Optionnel : Lancer les seeds pour des données de test
npm run seed
```

## 🚀 Lancement

### API Backend
```bash
# Mode développement
npm run dev

# Production
npm run build
npm start
```

### Tests et Linting
```bash
# Tests
npm test

# Linting
npm run lint

# Type checking
npm run typecheck
```

## 📊 Base de données

### Schema principal
- **users** : Utilisateurs avec données RSI intégrées
- **posts** : Publications avec support média
- **follows** : Relations de suivi asymétriques
- **friends** : Relations d'amitié bidirectionnelles
- **likes** : Système de likes sur les posts

### Système XP/Niveaux
- XP stocké, niveau calculé dynamiquement
- Formule : `level = floor(sqrt(xp / 100)) + 1`
- XP gagné via posts, likes reçus, follows, etc.

### Rôles et permissions
- **User** : Actions de base
- **Moderator** : Modération posts/utilisateurs
- **Admin** : Gestion utilisateurs, quêtes, événements
- **Super Admin** : Accès système complet

## 🔧 Développement

### Structure des commits
- feat: nouvelle fonctionnalité
- fix: correction de bug
- docs: documentation
- style: formatage/style
- refactor: refactoring
- test: ajout/correction tests
- chore: maintenance

### Règles de code
- TypeScript strict mode
- Controllers minces → logique dans services
- Repositories pour l'accès DB
- Validation Zod systématique
- Gestion d'erreurs centralisée

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changes (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir `LICENSE` pour plus de détails.

## 🌟 Remerciements

- La communauté Star Citizen
- L'équipe CIG pour cet univers incroyable
- Tous les contributeurs du projet

---

**Fly safe, citizen! o7**