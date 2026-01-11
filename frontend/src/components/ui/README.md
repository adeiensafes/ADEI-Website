# Typewriter Component

Un composant React qui crée un effet de machine à écrire animé avec du texte qui s'écrit et s'efface automatiquement.

## Utilisation

### Composant Typewriter de base

```jsx
import Typewriter from './components/ui/Typewriter';

function MyComponent() {
  return (
    <h1>
      <Typewriter 
        words={["Bonjour", "Hello", "Hola"]} 
        speed={100} 
        delayBetweenWords={2000} 
        cursor={true} 
        cursorChar="|" 
      />
    </h1>
  );
}
```

### Composant PageTypewriter (Recommandé)

```jsx
import PageTypewriter from './components/ui/PageTypewriter';

function HomePage() {
  return (
    <h1>
      <PageTypewriter pageName="home" />
    </h1>
  );
}

// Avec configuration personnalisée
function CustomPage() {
  return (
    <h1>
      <PageTypewriter 
        pageName="events" 
        customWords={["Événement Spécial", "Rejoignez-nous"]}
        customConfig={{ speed: 120 }}
      />
    </h1>
  );
}
```

## Props

### Typewriter

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `words` | `string[]` | **requis** | Tableau des mots/phrases à animer |
| `speed` | `number` | `100` | Vitesse de frappe en millisecondes |
| `delayBetweenWords` | `number` | `2000` | Délai entre les mots en millisecondes |
| `cursor` | `boolean` | `true` | Afficher le curseur clignotant |
| `cursorChar` | `string` | `"|"` | Caractère du curseur |
| `className` | `string` | `""` | Classes CSS supplémentaires |

### PageTypewriter

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `pageName` | `string` | **requis** | Nom de la page (home, events, clubs, etc.) |
| `customWords` | `string[]` | `null` | Mots personnalisés (remplace la config de la page) |
| `customConfig` | `object` | `{}` | Configuration personnalisée |
| `className` | `string` | `"typewriter-hero"` | Classes CSS |

## Pages configurées

- `home` - Page d'accueil
- `ensa` - Page ENSA
- `events` - Page Événements
- `clubs` - Page Clubs
- `adei` - Page ADEI
- `news` - Page Actualités
- `contact` - Page Contact
- `newsAndEvents` - Page Actualités & Événements
- `feedbacks` - Page Feedbacks

## Classes CSS disponibles

- `typewriter-hero` - Style pour les titres principaux avec gradient
- `typewriter-accent` - Style avec couleur d'accent et glow effect

## Configuration centralisée

La configuration des animations est centralisée dans `config/typewriterConfig.js`. Vous pouvez :

1. Modifier les mots pour chaque page
2. Ajuster la vitesse et les délais
3. Ajouter de nouvelles pages
4. Personnaliser les paramètres par défaut

```javascript
// Exemple de configuration
export const typewriterConfig = {
  home: {
    words: ["Bienvenue sur l'ADEI", "Découvrez notre communauté"],
    speed: 80,
    delayBetweenWords: 2000
  }
};
```

## Exemple d'utilisation dans le projet

Le composant est utilisé sur toutes les pages principales pour animer les titres :

```jsx
<PageTypewriter pageName="home" />
```

## Personnalisation

Le composant utilise les variables CSS du thème existant :
- `--text-primary` pour le texte
- `--primary` pour le curseur et les effets
- `--primary-glow` pour les effets de lueur

Vous pouvez personnaliser l'apparence en modifiant le fichier `typewriter.css` ou en ajoutant vos propres classes CSS.