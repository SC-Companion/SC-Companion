# 🤝 Contributing to SC Companion Desktop

Merci de votre intérêt pour contribuer à SC Companion ! Ce guide vous aidera à comprendre notre processus de développement et les conventions à suivre.

## 📝 Conventional Commits

Nous utilisons les **Conventional Commits** pour automatiser les changelogs et le versioning. Vos messages de commit doivent suivre ce format :

```
<type>[scope optionnel]: <description>

[corps optionnel]

[footer optionnel]
```

### Types de commits

| Type | Description | Changelog | Version |
|------|-------------|-----------|---------|
| `feat` | Nouvelle fonctionnalité | ✅ Added | Minor |
| `fix` | Correction de bug | ✅ Fixed | Patch |
| `docs` | Documentation uniquement | ❌ | - |
| `style` | Formatage, point-virgules, etc. | ❌ | - |
| `refactor` | Refactoring sans changement fonctionnel | ❌ | - |
| `test` | Ajout/correction de tests | ❌ | - |
| `chore` | Maintenance, config, dépendances | ❌ | - |
| `perf` | Amélioration des performances | ✅ Performance | Patch |
| `ci` | CI/CD, GitHub Actions | ❌ | - |

### Breaking Changes

Pour indiquer un **BREAKING CHANGE** (version majeure) :
- Ajoutez `!` après le type : `feat!:`
- Ou ajoutez `BREAKING CHANGE:` dans le footer

### Exemples

```bash
# Nouvelle fonctionnalité (version mineure)
feat: add dark mode toggle

# Correction de bug (version patch)
fix: resolve memory leak in update checker

# Breaking change (version majeure)
feat!: redesign user authentication system

BREAKING CHANGE: authentication now requires RSI verification
```

## 🔄 Workflow de Release

### Automatique (Recommandé)

1. **Développez** sur une branche feature
2. **Créez une PR** vers `main`
3. **Mergez** la PR → Release automatique déclenchée
4. **GitHub Actions** :
   - Analyse les commits
   - Génère le changelog
   - Bump la version
   - Crée les installeurs
   - Publie la release

### Manuel

```bash
# Test de release (simulation)
npm run release:dry

# Release réelle
npm run release
```

## 📊 Versions Sémantiques

Nous suivons [SemVer](https://semver.org/lang/fr/) :

- **MAJOR** (`1.0.0`) : Breaking changes
- **MINOR** (`0.1.0`) : Nouvelles fonctionnalités
- **PATCH** (`0.0.1`) : Corrections de bugs

Exemples de déclenchements :
- `feat:` → `0.1.0` → `0.2.0`
- `fix:` → `0.1.0` → `0.1.1`
- `feat!:` → `0.1.0` → `1.0.0`

## 🎯 Scopes Recommandés

Utilisez des scopes pour organiser vos commits :

```bash
feat(ui): add new update notification design
fix(updater): resolve download progress calculation
docs(readme): update installation instructions
chore(deps): bump electron to v28
```

Scopes courants :
- `ui` : Interface utilisateur
- `updater` : Système de mise à jour
- `auth` : Authentification
- `api` : Client API
- `build` : Configuration de build
- `deps` : Dépendances

## 📋 Processus de Contribution

1. **Fork** le repository
2. **Créez** une branche : `git checkout -b feat/amazing-feature`
3. **Commitez** avec les conventions : `git commit -m "feat: add amazing feature"`
4. **Poussez** : `git push origin feat/amazing-feature`
5. **Ouvrez** une Pull Request

## 🧪 Tests et Qualité

Avant de soumettre :

```bash
# Vérifications TypeScript
npm run typecheck

# Linting
npm run lint

# Build de test
npm run build
```

## 📝 Changelog Automatique

Le changelog est généré automatiquement à partir des commits. Exemples :

### Input (commits)
```bash
feat: add changelog viewer in update modal
fix: resolve update progress bar flicker
docs: update contributing guidelines
```

### Output (CHANGELOG.md)
```markdown
## [1.2.0] - 2024-01-XX

### ✨ Added
- Add changelog viewer in update modal

### 🐛 Fixed  
- Resolve update progress bar flicker
```

## 🚀 Release Notes

Les release notes GitHub sont générées automatiquement et incluent :
- ✨ **Nouvelles fonctionnalités**
- 🐛 **Corrections de bugs**  
- ⚠️ **Breaking Changes**
- 📥 **Liens de téléchargement des installeurs**

---

**Merci de contribuer à SC Companion ! o7**