# Guide pour Ajouter les Nouvelles Filières CI3

## 📋 Situation Actuelle
Les filières de l'ENSA Fès ont subi une restructuration. Les anciennes filières CI3 n'existent plus sous leur forme actuelle et seront remplacées par de nouvelles filières l'année prochaine.

## 🎯 Comment Ajouter les Nouvelles Filières CI3

### Étape 1: Accéder au Panneau d'Administration
1. Allez sur http://localhost:3000/admin
2. Connectez-vous avec vos identifiants administrateur
3. Cliquez sur l'onglet **"Filières"**

### Étape 2: Ajouter une Nouvelle Filière CI3
1. Cliquez sur le bouton **"Ajouter une filière"**
2. Remplissez les informations suivantes :

#### Informations de Base
- **Nom de la filière** : Nom complet (ex: "Génie des Données et Numérique Connecté")
- **Abréviation** : Code court (ex: "GDNC", "GM", "GI", etc.)
- **Type** : Sélectionnez **"Filière d'ingénierie"**

#### Responsable de Filière
- **Responsable de filière (3 ans)** : Nom du professeur responsable

#### Délégués par Année
Dans la section verte **"Délégués Étudiants par Année"** :
- **1ère Année (FILIERE1)** : Nom et téléphone du délégué CI1
- **2ème Année (FILIERE2)** : Nom et téléphone du délégué CI2  
- **3ème Année (FILIERE3)** : Nom et téléphone du délégué CI3

#### Autres Informations
- **Années d'étude** : Tapez les 3 années (une par ligne) :
  ```
  FILIERE1
  FILIERE2
  FILIERE3
  ```
- **Documentation** : Lien vers la documentation (optionnel)
- **Drive** : Lien vers le drive de la filière (optionnel)
- **Description** : Description de la filière

### Étape 3: Sauvegarder
Cliquez sur **"Enregistrer"** pour créer la filière.

## 📝 Exemple de Nouvelle Filière CI3

### Exemple : Génie des Données et Numérique Connecté (GDNC)
```
Nom : Génie des Données et Numérique Connecté
Abréviation : GDNC
Type : Filière d'ingénierie
Responsable : Prof. [Nom du Responsable]

Délégués :
- GDNC1 : [Nom Délégué CI1] - [Téléphone]
- GDNC2 : [Nom Délégué CI2] - [Téléphone]  
- GDNC3 : [Nom Délégué CI3] - [Téléphone]

Années d'étude :
GDNC1
GDNC2
GDNC3
```

## 🔄 Résultat Attendu
Une fois ajoutées, les nouvelles filières apparaîtront :
- **CI1** : Affichera FILIERE1 avec le délégué spécifique
- **CI2** : Affichera FILIERE2 avec le délégué spécifique
- **CI3** : Affichera FILIERE3 avec le délégué spécifique

## ⚠️ Notes Importantes
1. **Suppression des Anciennes** : Vous pouvez supprimer les anciennes filières qui n'existent plus
2. **Ordre d'Affichage** : Utilisez les flèches dans le panneau admin pour réorganiser l'ordre
3. **Mise à Jour** : Les changements apparaîtront immédiatement sur la page ENSA

## 🆘 Support
Si vous avez des questions ou des problèmes :
1. Vérifiez que les serveurs sont en marche (backend sur port 5001, frontend sur port 3000)
2. Consultez les logs du serveur en cas d'erreur
3. Les nouvelles filières apparaîtront automatiquement dans les onglets CI1, CI2, CI3

---
**Serveurs actuels :**
- Backend : ✅ http://localhost:5001
- Frontend : ✅ http://localhost:3000
- Admin Panel : ✅ http://localhost:3000/admin