# 🎨 Système de Thème - Guide Complet

## 📋 Aperçu

Le site ADEI dispose maintenant d'un système de thème complet avec deux modes :
- **Thème Sombre** : Noir avec rouge (thème original)
- **Thème Clair** : Blanc avec rouge (nouveau thème)

## ✨ Fonctionnalités

### 🔄 Basculement de Thème
- **Bouton flottant** : En bas à gauche, toujours visible avec tooltip élégant
- **Sauvegarde automatique** : Le thème choisi est mémorisé dans localStorage
- **Application instantanée** : Changement fluide avec animations

### 🎯 Éléments Adaptés
- ✅ Arrière-plans et couleurs de texte
- ✅ Cartes et composants
- ✅ Formulaires et inputs
- ✅ Navigation et menus
- ✅ Boutons et interactions
- ✅ Ombres et effets
- ✅ Scrollbar personnalisée

## 🚀 Utilisation

### Pour les Utilisateurs

1. **Basculer le thème** :
   - Utiliser le bouton flottant rouge en bas à gauche de l'écran
   - Passer la souris dessus pour voir le tooltip informatif

2. **Thèmes disponibles** :
   - 🌙 **Sombre** : Fond noir, texte blanc, accents rouges
   - ☀️ **Clair** : Fond blanc, texte noir, accents rouges

3. **Persistance** :
   - Le thème choisi est automatiquement sauvegardé
   - Il sera restauré lors de la prochaine visite

### Pour les Développeurs

#### Structure du Code

```
frontend/src/
├── contexts/
│   └── ThemeContext.jsx          # Contexte React pour le thème
├── components/
│   └── FloatingThemeToggle.jsx   # Bouton flottant unique
└── styles/
    ├── theme.css                 # Variables CSS et thèmes
    └── floating-theme-toggle.css # Styles du bouton flottant
```

#### Utilisation du Hook

```jsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme, isDark, isLight } = useTheme();
  
  return (
    <div>
      <p>Thème actuel : {theme}</p>
      <button onClick={toggleTheme}>
        Basculer vers {isDark ? 'clair' : 'sombre'}
      </button>
    </div>
  );
};
```

#### Variables CSS Disponibles

```css
/* Variables communes */
--primary: #ff3b30;              /* Rouge principal */
--primary-hover: #ff6b60;        /* Rouge au survol */
--primary-light: rgba(255, 59, 48, 0.1); /* Rouge transparent */

/* Variables adaptatives (changent selon le thème) */
--bg-primary: /* Noir ou Blanc */
--text-primary: /* Blanc ou Noir */
--card-bg: /* Fond des cartes */
--card-border: /* Bordure des cartes */
```

## 🎨 Personnalisation

### Ajouter de Nouveaux Thèmes

1. **Définir les variables** dans `theme.css` :
```css
[data-theme="nouveau-theme"] {
  --bg-primary: #votre-couleur;
  --text-primary: #votre-couleur;
  /* ... autres variables */
}
```

2. **Étendre le contexte** dans `ThemeContext.jsx` :
```jsx
const themes = ['dark', 'light', 'nouveau-theme'];
```

3. **Ajouter la logique de basculement** :
```jsx
const nextTheme = () => {
  const currentIndex = themes.indexOf(theme);
  const nextIndex = (currentIndex + 1) % themes.length;
  return themes[nextIndex];
};
```

### Personnaliser les Couleurs

#### Thème Sombre
```css
[data-theme="dark"] {
  --primary: #ff3b30;           /* Rouge principal */
  --bg-primary: #000000;        /* Fond noir */
  --text-primary: #ffffff;      /* Texte blanc */
  --card-bg: #151515;          /* Cartes grises foncées */
}
```

#### Thème Clair
```css
[data-theme="light"] {
  --primary: #ff3b30;           /* Rouge principal (identique) */
  --bg-primary: #ffffff;        /* Fond blanc */
  --text-primary: #111827;      /* Texte noir */
  --card-bg: #ffffff;          /* Cartes blanches */
}
```

## 🔧 Configuration Technique

### Initialisation
Le thème est initialisé au chargement de l'application :
1. Vérification du localStorage
2. Application du thème par défaut (sombre) si aucun n'est sauvegardé
3. Ajout de l'attribut `data-theme` au document
4. Application des classes CSS correspondantes

### Sauvegarde
```jsx
useEffect(() => {
  localStorage.setItem('adei-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);
```

### Transitions Fluides
```css
* {
  transition: background-color 0.3s ease, 
              border-color 0.3s ease, 
              color 0.3s ease, 
              box-shadow 0.3s ease !important;
}
```

## 📱 Responsive Design

### Bouton Flottant
- **Desktop** : 64px avec tooltip élégant et icône 28px
- **Tablet** : 56px avec tooltip et icône 24px  
- **Mobile** : 52px avec tooltip compact et icône 22px

## 🎯 Bonnes Pratiques

### Pour les Développeurs

1. **Utiliser les variables CSS** :
   ```css
   /* ✅ Bon */
   background: var(--card-bg);
   
   /* ❌ Éviter */
   background: #151515;
   ```

2. **Tester les deux thèmes** :
   - Vérifier la lisibilité
   - Contraste suffisant
   - Cohérence visuelle

3. **Animations fluides** :
   ```css
   .mon-element {
     transition: all var(--transition-smooth);
   }
   ```

### Pour les Utilisateurs

1. **Accessibilité** :
   - Le thème clair améliore la lisibilité en plein jour
   - Le thème sombre réduit la fatigue oculaire la nuit

2. **Performance** :
   - Le changement de thème est instantané
   - Aucun rechargement de page nécessaire

## 🚨 Dépannage

### Problèmes Courants

1. **Le thème ne se sauvegarde pas** :
   - Vérifier que localStorage est activé
   - Vérifier la console pour les erreurs

2. **Transitions saccadées** :
   - Vérifier les propriétés CSS transition
   - S'assurer que les variables sont bien définies

3. **Éléments non adaptés** :
   - Ajouter les variables CSS manquantes
   - Vérifier les sélecteurs `[data-theme="light"]`

### Debug

```jsx
// Vérifier le thème actuel
console.log('Thème actuel:', document.documentElement.getAttribute('data-theme'));

// Vérifier localStorage
console.log('Thème sauvegardé:', localStorage.getItem('adei-theme'));
```

## 🎉 Résultat

Le site ADEI dispose maintenant d'un système de thème moderne et professionnel :

- **Thème sombre** : Élégant et moderne pour une utilisation nocturne
- **Thème clair** : Propre et lisible pour une utilisation diurne
- **Basculement fluide** : Transitions animées et sauvegarde automatique
- **Interface intuitive** : Boutons accessibles et tooltips informatifs

Les utilisateurs peuvent maintenant personnaliser leur expérience selon leurs préférences et conditions d'utilisation !

---

**Développé avec ❤️ pour l'ADEI - ENSAF**