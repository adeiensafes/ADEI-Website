# ADEI Site - Application Complète

Cette application web complète gère le site de l'Association des Étudiants Ingénieurs (ADEI). Le projet est divisé en deux parties :

* **client/** : Application React (frontend) affichant les pages du site (accueil, actualités, événements, clubs, ENSA, ADEI, feedback)
* **server/** : Serveur Node.js/Express (backend) avec API REST et base de données MongoDB

## 🔧 Configuration et Installation

### Prérequis

- Node.js (version 14 ou supérieure)
- MongoDB installé localement
- npm ou yarn

### 1. Configuration de la Base de Données

Assurez-vous que MongoDB est installé et en cours d'exécution :

```bash
# Démarrer MongoDB localement
mongod
```

La base de données `adei-db` sera créée automatiquement lors de la première connexion.

### 2. Installation du Backend

```bash
cd server
npm install
```

### 3. Configuration des Variables d'Environnement

Le fichier `server/.env` est déjà configuré pour une connexion MongoDB locale :

```
MONGODB_URI=mongodb://localhost:27017/adei-db
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### 4. Démarrage du Serveur Backend

```bash
cd server
node index.js
```

Le serveur démarre sur `http://localhost:5000`.

**Note importante** : Au premier démarrage, un compte administrateur par défaut est automatiquement créé :
- **Username:** `admin`
- **Email:** `admin@adei.ma`
- **Password:** `password`
- **Role:** `admin`

⚠️ **Changez ce mot de passe après la première connexion pour des raisons de sécurité !**

### 5. Installation et Démarrage du Frontend

```bash
cd client
npm install
npm start
```

L'application frontend démarre sur `http://localhost:3000`.

## 🎯 Fonctionnalités

### Pages Publiques
- **Accueil** : Page d'accueil avec présentation de l'ADEI
- **Actualités** : Liste des actualités (données depuis `/api/news`)
- **Événements** : Liste des événements (données depuis `/api/events`)
- **Clubs** : Présentation des clubs étudiants (données depuis `/api/clubs`)
- **ENSA** : Informations sur l'École Nationale des Sciences Appliquées
- **ADEI** : Présentation de l'association

### Fonctionnalités d'Authentification
- **Connexion** : Système d'authentification avec JWT
- **Pas d'inscription publique** : Seul l'administrateur peut créer de nouveaux utilisateurs

### Espace Adhérent
- **Feedback** : Les adhérents peuvent soumettre des avis et réclamations
- **Consultation de leurs messages** : Voir l'historique et les réponses

### Espace Administrateur
- **Gestion des utilisateurs** : Créer, modifier, supprimer des utilisateurs avec attribution de rôles
- **Gestion des messages** : Consulter tous les feedbacks et y répondre
- **Système de rôles** : admin, adherent, user, guest

## 👥 Système de Rôles

### Rôles Disponibles

1. **admin** : Accès complet à toutes les fonctionnalités
   - Gestion des utilisateurs
   - Réponse aux feedbacks
   - Accès à toutes les pages d'administration

2. **adherent** : Membre actif de l'association
   - Peut soumettre des avis et réclamations
   - Peut consulter ses propres messages

3. **user** : Utilisateur standard
   - Accès aux pages publiques
   - Peut consulter les informations

4. **guest** : Invité (rôle par défaut)
   - Accès limité aux pages publiques

## 🔐 Sécurité

### Authentification
- JWT (JSON Web Tokens) pour la gestion des sessions
- Tokens stockés dans localStorage côté client
- Middleware d'authentification sur le backend

### Hachage des Mots de Passe
- bcryptjs pour le hachage sécurisé des mots de passe
- Salt rounds : 10

### Rate Limiting
- Limitation à 5 tentatives de connexion par 15 minutes
- Protection contre les attaques par force brute

### Helmet.js
- Protection contre les vulnérabilités web courantes
- Headers de sécurité HTTP

## 📡 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Informations utilisateur connecté

### Utilisateurs (Admin uniquement)
- `GET /api/users` - Liste tous les utilisateurs
- `POST /api/users` - Créer un utilisateur
- `GET /api/users/:id` - Récupérer un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Feedbacks
- `POST /api/feedbacks` - Créer un feedback
- `GET /api/feedbacks` - Liste des feedbacks (admin voit tout, adherent voit les siens)
- `PUT /api/feedbacks/:id` - Modifier le statut (admin uniquement)
- `DELETE /api/feedbacks/:id` - Supprimer un feedback (admin uniquement)
- `POST /api/feedbacks/:id/like` - Liker un feedback
- `POST /api/feedbacks/:id/respond` - Répondre à un feedback (admin uniquement)

### Données Publiques
- `GET /api/news` - Liste des actualités
- `GET /api/events` - Liste des événements
- `GET /api/clubs` - Liste des clubs

## 🗄️ Structure de la Base de Données

### Collections MongoDB

1. **users** - Utilisateurs
   - username, email, password (haché), role, createdAt, createdBy

2. **feedbacks** - Avis et réclamations
   - name, email, message, type, status, userId, likes, likedBy, response, createdAt

3. **news** - Actualités (prêt à l'emploi)
   - title, content, image, author, createdAt, updatedAt

4. **events** - Événements (prêt à l'emploi)
   - title, description, date, location, image, organizer, createdAt

5. **clubs** - Clubs étudiants (prêt à l'emploi)
   - name, description, logo, president, members, createdAt

Les collections sont créées automatiquement par Mongoose lors de la première insertion de documents.

## 🚀 Déploiement en Production

### Build du Frontend

```bash
cd client
npm run build
```

Le dossier `build/` contient les fichiers optimisés pour la production.

### Variables d'Environnement en Production

Assurez-vous de modifier les variables suivantes :
- Changez `JWT_SECRET` pour une valeur secrète et unique
- Configurez `MONGODB_URI` pour pointer vers votre base de données de production
- Changez le mot de passe admin par défaut

## 📋 Améliorations Réalisées

✅ Suppression de l'inscription publique - seul l'admin peut créer des comptes
✅ Correction du middleware d'authentification JWT
✅ Ajout du rôle 'user' pour plus de flexibilité
✅ Correction de tous les bugs de communication frontend/backend
✅ Mise en place de la sécurité (helmet, rate limiting, validation)
✅ Interface d'administration pour la gestion des utilisateurs
✅ Système de feedback avec réponses de l'administration
✅ Design cohérent et responsive
✅ Collections MongoDB créées automatiquement
✅ Documentation complète

## 🛠️ Technologies Utilisées

### Frontend
- React 19
- React Router DOM 7
- Axios
- Framer Motion (animations)
- JWT Decode

### Backend
- Node.js
- Express 5
- MongoDB + Mongoose 8
- JWT (jsonwebtoken)
- bcryptjs
- Helmet (sécurité)
- Express Rate Limit
- CORS

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement ADEI.

---

**Développé avec ❤️ pour l'ADEI - ENSAF**
