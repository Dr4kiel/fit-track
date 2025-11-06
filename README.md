# 🏋️ FitTrack

Application de suivi de fitness développée avec Next.js, TypeScript et Prisma. FitTrack permet aux utilisateurs de suivre leurs entraînements, leur poids et leurs objectifs de fitness de manière simple et intuitive.

## 🌟 Fonctionnalités

- **Authentification** : Système d'inscription/connexion sécurisé avec NextAuth
- **Suivi du poids** : Enregistrement et visualisation de l'évolution du poids
- **Gestion des entraînements** : Création et suivi des séances d'entraînement
- **Dashboard** : Vue d'ensemble des statistiques et progrès
- **Interface responsive** : Design moderne avec Tailwind CSS et shadcn/ui
- **Base de données** : Gestion avec Prisma et SQLite

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 16, React 19, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui components
- **Base de données** : Prisma ORM avec SQLite
- **Authentification** : NextAuth.js
- **Déploiement** : Docker & Docker Compose

## 📋 Prérequis

- Node.js 18 ou supérieur
- npm ou yarn
- Docker et Docker Compose (pour le déploiement)

## 🚀 Installation et démarrage

### Option 1 : Installation locale

1. **Cloner le projet**
   ```bash
   git clone https://github.com/Dr4kiel/fit-track.git
   cd fit-track
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer la base de données**
   ```bash
   # Créer et appliquer les migrations
   npx prisma migrate dev
   
   # Générer le client Prisma
   npx prisma generate
   ```

4. **Configuration de l'environnement**
   
   Créer un fichier `.env.local` à la racine du projet :
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="votre-secret-nextauth"
   NEXTAUTH_URL="http://localhost:3000"
   ```

5. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

   L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Option 2 : Déploiement avec Docker

1. **Cloner le projet**
   ```bash
   git clone https://github.com/Dr4kiel/fit-track.git
   cd fit-track
   ```

2. **Construire et démarrer avec Docker Compose**
   ```bash
   docker-compose up --build
   ```

   L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📝 Scripts disponibles

- `npm run dev` : Démarre le serveur de développement
- `npm run build` : Construit l'application pour la production
- `npm run start` : Démarre l'application en mode production
- `npm run lint` : Vérifie le code avec ESLint

## 🗄️ Base de données

Le projet utilise Prisma ORM avec SQLite. Le schéma de base de données comprend :

- **Users** : Gestion des utilisateurs
- **WeightEntry** : Entrées de poids
- **Workout** : Exercices d'entraînement
- **DailyLog** : Journaux quotidiens d'activité

### Commandes Prisma utiles

```bash
# Appliquer les migrations
npx prisma migrate dev

# Réinitialiser la base de données
npx prisma migrate reset

# Visualiser la base de données
npx prisma studio

# Générer le client Prisma
npx prisma generate
```

## 🌐 Structure du projet

```
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # Routes API
│   ├── dashboard/         # Page tableau de bord
│   ├── connexion/         # Page de connexion
│   └── inscription/       # Page d'inscription
├── components/            # Composants React réutilisables
│   ├── ui/               # Composants UI de base (shadcn/ui)
│   └── activities/       # Composants spécifiques aux activités
├── lib/                   # Utilitaires et configurations
├── prisma/               # Schéma et migrations Prisma
├── hooks/                # Hooks React personnalisés
└── types/                # Définitions TypeScript
```

## 🤝 Contribution

### Politique de branches

Nous suivons une stratégie de branches basée sur **Git Flow** pour maintenir un code organisé et faciliter la collaboration :

#### Branches principales

- **`main`** : Branche de production
  - Contient uniquement le code stable et testé
  - Protégée contre les push directs
  - Déployée automatiquement en production

- **`dev`** : Branche de développement
  - Branche d'intégration pour les nouvelles fonctionnalités
  - Base pour créer les branches de features
  - Code testé mais pas encore en production

#### Branches de travail

- **`feat/[numéro-issue]-[description]`** : Nouvelles fonctionnalités
  - Exemple : `feat/12-ajout-statistiques-poids`
  - Créées à partir de `dev`
  - Mergées dans `dev` via Pull Request

- **`fix/[numéro-issue]-[description]`** : Corrections de bugs
  - Exemple : `fix/15-correction-calcul-imc`
  - Créées à partir de `dev` (ou `main` pour les hotfixes critiques)
  - Mergées dans `dev` via Pull Request

- **`hotfix/[description]`** : Corrections urgentes en production
  - Créées à partir de `main`
  - Mergées dans `main` ET `dev`

#### Workflow de contribution

1. **Créer une issue** décrivant la fonctionnalité ou le bug
2. **Créer une branche** à partir de `dev` :
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/[numéro-issue]-[description]
   ```

3. **Développer** la fonctionnalité en faisant des commits réguliers :
   ```bash
   git add .
   git commit -m "feat: ajout de la fonctionnalité X"
   ```

4. **Pousser** la branche et créer une Pull Request :
   ```bash
   git push origin feat/[numéro-issue]-[description]
   ```

5. **Code Review** : Attendre la validation d'au moins un autre développeur

6. **Merge** : Une fois approuvée, la PR est mergée dans `dev`

#### Convention des messages de commit

Nous utilisons la convention **Conventional Commits** :

- `feat:` : Nouvelle fonctionnalité
- `fix:` : Correction de bug  
- `docs:` : Documentation
- `style:` : Formatage, point-virgule manquant, etc.
- `refactor:` : Refactorisation du code
- `test:` : Ajout ou modification de tests
- `chore:` : Maintenance (dépendances, configuration, etc.)

#### Règles importantes

- ✅ Toujours créer une branche pour vos modifications
- ✅ Respecter la convention de nommage des branches
- ✅ Écrire des messages de commit descriptifs
- ✅ Tester votre code avant de créer une PR
- ✅ Mettre à jour la documentation si nécessaire
- ❌ Ne jamais pusher directement sur `main` ou `dev`
- ❌ Ne pas merger ses propres Pull Requests

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Dr4kiel** - [GitHub](https://github.com/Dr4kiel)

---

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue ou à contribuer au projet ! 🚀