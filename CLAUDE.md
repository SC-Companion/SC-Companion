# 📘 Guide de Développement — SC Companion

Ce fichier a pour objectif de donner à Claude Code le **contexte complet du projet SC Companion** afin de faciliter la génération de code, la compréhension de l’architecture et la continuité du développement.

---

## 🌌 Présentation du projet

**SC Companion** est une application compagnon pour le jeu **Star Citizen**.  
Elle apporte des fonctionnalités sociales, communautaires et analytiques qui ne sont pas présentes dans le jeu, en offrant aux joueurs :

- un **réseau social** (inspiré de Twitter/X et Facebook),
- un **système de quêtes et d’événements communautaires** basé sur l’analyse des **logs du jeu**,
- une **marketplace interne** (respectant les ToS RSI, pas d’argent réel),
- un **système de progression fictif (XP/niveaux)**,
- un **monitoring des performances PC et des sessions de jeu**,
- un **upload média** (images/vidéos comme sur un vrai réseau social),
- et un **modèle freemium/premium** pour soutenir le développement.

---

## 🧩 Composants principaux

1. **Application Windows (Electron)**

   - Electron + React + Tailwind + shadcn/ui + daisyUI.
   - Fournit le dashboard principal (social, quêtes, marketplace, monitoring).
   - Auto-update via electron-builder (NSIS).

2. **API Backend**

   - Node.js + Express + Knex + TypeScript.
   - DB : SQLite (développement) et PostgreSQL (production).
   - Validation : Zod.
   - Auth : JWT (HS256).
   - Architecture type Laravel/Symfony :
     - `controllers/` : minces
     - `services/` : logique métier
     - `repositories/` : accès DB avec Knex
     - `domain/` : schémas Zod, types
     - `middlewares/` : auth, validation, quotas premium
     - `db/` : migrations, seeds, knex.ts

3. **Web Dashboard**

   - React (Vite) + Tailwind + shadcn/ui + daisyUI.
   - Permet l’accès via navigateur aux profils, feeds, stats, marketplace, quêtes.

4. **Page vitrine (Landing Page)**
   - Next.js ou VitePress + Tailwind.
   - Présentation du projet + téléchargement + souscription premium.

---

## 📂 Arborescence cible (monorepo)

sc-companion/
├─ apps/
│ ├─ desktop/ # Electron (main + renderer React)
│ ├─ web-dashboard/ # Dashboard Web (React Vite)
│ └─ landing/ # Page vitrine (Next.js/VitePress)
├─ services/
│ └─ api/
│ ├─ src/
│ │ ├─ routes/ # REST (users, posts, follows, friends, quests, marketplace, sessions, upload)
│ │ ├─ controllers/ # minces
│ │ ├─ services/ # logique métier
│ │ ├─ repositories/ # accès DB via Knex
│ │ ├─ domain/ # schémas Zod, types, XP levels
│ │ ├─ middlewares/ # auth, quotas premium, validate, error handler
│ │ └─ db/ # knex.ts, migrations, seeds
│ ├─ knexfile.cjs
│ └─ package.json
├─ packages/
│ ├─ shared/ # Types TS, schémas Zod, constantes
│ └─ sdk/ # Client JS (API, Axios, types)
├─ docs/
│ ├─ ARCHITECTURE.md
│ ├─ DOMAIN.md
│ ├─ ROADMAP.md
│ └─ AI-INSTRUCTIONS.md
└─ package.json

---

## ⚙️ Fonctionnalités par module

### 1. Social

- Profils utilisateurs : handle, displayName, bio, location, avatar.
- Posts texte + images/vidéos.
- Feeds : global, amis, following.
- Relations : follow (asymétrique), amis (réciproques).
- Likes : aimer/désaimer un post.
- Pagination : par curseur (created_at).

### 2. Quêtes & Événements communautaires

- **Sources : logs Star Citizen** (ex. `Game.log` dans l’installation du jeu).
- Données récupérables : morts PvE/PvP, type de dégâts, arme, zone.
- Quêtes personnelles : tâches simples (tuer X PNJ, faire Y missions).
- Quêtes quotidiennes/hebdomadaires : encourager régularité.
- Événements communautaires : objectifs collectifs (ex. tuer N ennemis Apex Valakar).
- Récompenses : XP Companion, monnaie interne Companion, badges.

### 3. Marketplace

- Inventaire utilisateur (armes, armures, modules, vaisseaux).
- Transactions avec monnaie fictive Companion (pas d’argent réel).
- Catalogue : recherche, tri, filtres.
- Gestion d’offres : créer, éditer, supprimer, acheter/vendre.
- Premium : plus d’emplacements de vente.

### 4. XP & Progression

- Niveau fictif propre à SC Companion.
- XP gagné via : posts, likes, follow, quêtes, événements, stats de sessions.
- Table XP → Level (fonction côté code).
- Affichage : barre progression, classement.

### 5. Monitoring

- Monitoring PC (CPU/GPU/RAM/FPS) en temps réel via Electron.
- Sessions de jeu : durée, kills, morts, quêtes.
- Analytics PvE/PvP, évolution perf patchs.

### 6. Upload média

- Upload images/vidéos.
- Options :
  1. VPS local avec Nginx/Express (CDN simple).
  2. Object storage type S3 (Backblaze, Wasabi, Scaleway).
- Route `POST /upload` protégée → retourne URL.
- Premium : quota augmenté (ex. 50 images/mois freemium, illimité premium).

### 7. Monétisation

- **Freemium** : toutes fonctionnalités accessibles.
- **Premium** : abonnement mensuel pour soutenir le projet.
  - Avantages : + slots marketplace, + quota upload, badges premium.
- Gestion via Landing Page + Stripe/PayPal.
- Application : modal discret “Soutenir SC Companion / Passer Premium” si non-abonné.

---

## 🎯 Objectif v0.0.1 (dans 2 semaines)

- API backend (Express+Knex) fonctionnelle pour la **partie sociale** :
  - users, posts, follows, friends, likes.
- Application Electron avec UI React consommant l’API (feed global, profil, follow/friends).
- Installeur Windows NSIS via electron-builder.
- SQLite pour dev, Postgres pour prod.
- Préparer l’infrastructure pour quêtes/logs, marketplace, premium et upload (sans les implémenter encore).

---

## ✅ Règles de code

- TypeScript partout.
- Controllers minces → déléguer logique à services/repos.
- Repositories : Knex queries claires, proches Eloquent.
- Validation systématique avec Zod (entrée/sortie).
- Respect strict de l’arborescence.
- Fournir migrations/seeders réalistes.
- Générer README clairs (installation, usage).

---
