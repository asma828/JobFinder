# JobFinder - Job Search Application

## 📋 Description

JobFinder est une application de recherche d'emplois développée avec Angular 17+ qui permet aux chercheurs d'emploi de consulter des offres provenant de plusieurs APIs publiques internationales, de sauvegarder leurs favoris et de suivre leurs candidatures.

## 🚀 Technologies Utilisées

- **Angular 17+** (Standalone Components)
- **NgRx** (State Management)
- **RxJS** (Reactive Programming)
- **Bootstrap 5** (UI Framework)
- **JSON Server** (Mock Backend)
- **TypeScript**

## 📦 Fonctionnalités

### Authentification
- ✅ Inscription utilisateur
- ✅ Connexion / Déconnexion
- ✅ Gestion du profil (modification, suppression)
- ✅ Protection des routes avec AuthGuard

### Recherche d'Emplois
- 🔍 Recherche par mots-clés et localisation
- 📄 Pagination des résultats (10 par page)
- 🔄 Tri par date de publication
- 💼 Affichage détaillé des offres

### Gestion des Favoris (NgRx)
- ⭐ Ajouter/Supprimer des favoris
- 📋 Consultation de la liste des favoris
- 🔔 Indicateur visuel sur les offres favorites

### Suivi des Candidatures
- 📝 Ajouter une candidature
- 📊 Gestion des statuts (En attente, Accepté, Refusé)
- 📝 Ajout de notes personnelles
- 🗑️ Suppression de candidatures

## 🛠️ Installation et Configuration

### Prérequis
- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)

### Installation

1. **Cloner le projet**
```bash
git clone <your-repo-url>
cd JobFinder
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les APIs**
  - Visitez https://job-finder-api-nine.vercel.app/
  - Obtenez vos clés API
  - Mettez à jour `src/environments/environment.ts` avec vos clés

4. **Démarrer JSON Server** (dans un terminal)
```bash
npm run json-server
```
Le serveur JSON sera accessible sur http://localhost:3000

5. **Démarrer l'application Angular** (dans un autre terminal)
```bash
npm start
```
L'application sera accessible sur http://localhost:4200

## 📁 Structure du Projet

```
JobFinder/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/              # Page d'accueil
│   │   │   ├── auth/              # Connexion & Inscription
│   │   │   ├── jobs/              # Recherche d'emplois
│   │   │   ├── favorites/         # Gestion des favoris
│   │   │   ├── applications/      # Suivi des candidatures
│   │   │   ├── profile/           # Profil utilisateur
│   │   │   └── shared/            # Composants partagés
│   │   ├── core/
│   │   │   ├── guards/            # Auth Guard
│   │   │   ├── interceptors/      # HTTP Interceptors
│   │   │   ├── services/          # Services métier
│   │   │   └── models/            # Interfaces TypeScript
│   │   ├── store/
│   │   │   ├── favorites/         # NgRx Store pour favoris
│   │   │   └── auth/              # NgRx Store pour auth
│   │   ├── app.component.ts
│   │   ├── app.config.ts          # Configuration de l'app
│   │   └── app.routes.ts          # Routes de l'application
│   ├── assets/                    # Images, fonts, etc.
│   ├── environments/              # Configuration environnements
│   └── styles.css                 # Styles globaux
├── db.json                        # Base de données JSON Server
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentification

L'application utilise un système d'authentification simulé avec JSON Server :
- Les utilisateurs sont stockés dans `db.json`
- À la connexion, l'objet utilisateur (sans mot de passe) est stocké dans `localStorage`
- `AuthGuard` protège les routes nécessitant une authentification
- Choix de `localStorage` pour la persistance de session (justification: meilleure UX)

## 🎯 APIs de Jobs Supportées

Le projet supporte les APIs suivantes (minimum 1 requise) :
1. **Adzuna** - API complète avec filtres avancés
2. **The Muse** - Jobs dans la tech et le marketing
3. **RemoteOK** - Jobs en remote
4. **JSearch (RapidAPI)** - Agrégateur de jobs

Documentation complète : https://job-finder-api-nine.vercel.app/

## 📊 Gestion d'État avec NgRx

NgRx est utilisé pour gérer l'état de l'application, particulièrement pour les favoris :
- **Actions** : Définissent les événements (ajout/suppression de favoris)
- **Reducers** : Gèrent les changements d'état
- **Selectors** : Sélectionnent des parties spécifiques de l'état
- **Effects** : Gèrent les effets de bord (appels HTTP)

**Redux DevTools** : Installer l'extension Chrome/Firefox pour déboguer l'état

## 🧪 Tests

```bash
npm test
```

## 🏗️ Build

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## 👤 Compte de Test

- **Email**: test@example.com
- **Mot de passe**: Test123!

## 📝 Notes Importantes

- Le projet utilise des **Standalone Components** (Angular 17+)
- **Lazy Loading** est implémenté sur toutes les routes
- **Reactive Forms** pour la validation des formulaires
- Design **Responsive** avec Bootstrap 5
- Gestion centralisée des erreurs HTTP

## 🤝 Contribution

Ce projet est développé dans le cadre d'une soutenance croisée académique.

## 📄 Licence

Ce projet est à usage éducatif uniquement.

## 📞 Contact

Pour toute question concernant ce projet, veuillez contacter le développeur.

---

**Date de création**: 10/02/2026  
**Deadline**: 13/02/2026  
**Version Angular**: 17+
