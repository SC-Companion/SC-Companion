# SC-Companion 🚀

**SC-Companion** est une application de bureau Electron conçue pour enrichir votre expérience Star Citizen au maximum !

## 📋 Description

SC-Companion est un compagnon de bureau qui vous accompagne dans votre aventure Star Citizen. Cette application offre une interface moderne et intuitive pour gérer vos activités dans l'univers de Star Citizen.

## ✨ Fonctionnalités

- 🎮 Interface de bureau native avec Electron
- 🎨 Interface moderne avec Tailwind CSS
- 🔐 Système d'authentification intégré
- 📊 Tableau de bord personnalisé
- 🎯 Interface utilisateur responsive et intuitive
- 🌙 Design sombre par défaut

## 🛠️ Technologies utilisées

- **Electron** - Framework pour applications de bureau
- **Node.js** - Runtime JavaScript
- **Tailwind CSS** - Framework CSS utilitaire
- **EJS** - Moteur de template
- **PostCSS** - Outil de traitement CSS

## 📦 Installation

### Prérequis

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [npm](https://www.npmjs.com/) (généralement inclus avec Node.js)

### Étapes d'installation

1. **Cloner le repository**

   ```bash
   git clone https://github.com/SC-Companion/SC-Companion.git
   cd SC-Companion
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Construire les styles CSS**
   ```bash
   npm run build:css:prod
   ```

## 🚀 Utilisation

### Développement

Pour lancer l'application en mode développement :

```bash
npm run dev
```

Cette commande va :

- Construire les styles CSS Tailwind
- Lancer l'application Electron en mode développement

### Production

Pour lancer l'application en mode production :

```bash
npm start
```

### Construction des styles CSS

Pour construire les styles CSS avec Tailwind :

```bash
# Mode développement (avec watch)
npm run build:css

# Mode production (minifié)
npm run build:css:prod
```

## 📁 Structure du projet

```
SC-Companion/
├── main.js                 # Point d'entrée principal Electron
├── preload.js             # Script de préchargement
├── package.json           # Configuration npm
├── tailwind.config.js     # Configuration Tailwind CSS
├── postcss.config.js      # Configuration PostCSS
├── src/
│   ├── controllers/       # Contrôleurs de l'application
│   ├── models/           # Modèles de données
│   ├── public/           # Fichiers publics (CSS, JS)
│   ├── sessions/         # Fichiers de session
│   ├── views/            # Templates EJS
│   └── tailwind.css      # Fichier source Tailwind
└── tailadmin/            # Assets et templates TailAdmin
```

## 🔧 Scripts disponibles

| Script                   | Description                                 |
| ------------------------ | ------------------------------------------- |
| `npm start`              | Lance l'application Electron                |
| `npm run dev`            | Lance l'application en mode développement   |
| `npm run build:css`      | Construit les styles CSS en mode watch      |
| `npm run build:css:prod` | Construit les styles CSS pour la production |
| `npm test`               | Lance les tests (à implémenter)             |

## 🎨 Personnalisation

### Styles CSS

Les styles sont gérés avec Tailwind CSS. Le fichier source se trouve dans `src/tailwind.css` et est compilé vers `src/public/css/styles.css`.

### Configuration Tailwind

La configuration Tailwind se trouve dans `tailwind.config.js`. Vous pouvez modifier les couleurs, les polices et autres paramètres selon vos besoins.

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**FingerFRK** - [GitHub](https://github.com/FingerFRK)

## 🐛 Signaler un bug

Si vous rencontrez un bug, veuillez créer une issue sur GitHub avec :

- Une description claire du problème
- Les étapes pour reproduire le bug
- Votre configuration système
- Les logs d'erreur si disponibles

## 📞 Support

Pour toute question ou demande de support :

- Créez une issue sur GitHub
- Contactez l'auteur via GitHub

---

**Star Citizen** est une marque déposée de Cloud Imperium Games. Ce projet n'est pas affilié officiellement à Cloud Imperium Games.
