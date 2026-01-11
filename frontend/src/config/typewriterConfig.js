// Configuration centralisée pour les animations Typewriter
export const typewriterConfig = {
  // Page d'accueil
  home: {
    words: [
      "Bienvenue sur l'ADEI",
      "Découvrez notre communauté",
      "Rejoignez-nous aujourd'hui",
      "Votre avenir commence ici"
    ],
    speed: 80,
    delayBetweenWords: 2000
  },

  // Page ENSA
  ensa: {
    words: [
      "École Nationale des Sciences Appliquées de Fès",
      "ENSAF - Excellence en Ingénierie",
      "Votre Formation d'Ingénieur",
      "Innovation et Technologie"
    ],
    speed: 60,
    delayBetweenWords: 2500
  },

  // Page Événements
  events: {
    words: [
      "Événements",
      "Activités Étudiantes",
      "Rejoignez-nous",
      "Vivez l'Expérience ADEI"
    ],
    speed: 90,
    delayBetweenWords: 2000
  },

  // Page Clubs
  clubs: {
    words: [
      "Clubs Étudiants",
      "Associations Dynamiques",
      "Trouvez Votre Passion",
      "Développez Vos Talents"
    ],
    speed: 85,
    delayBetweenWords: 2200
  },

  // Page ADEI
  adei: {
    words: [
      "Association des Élèves Ingénieurs",
      "ADEI - Votre Communauté",
      "Excellence et Innovation",
      "Ensemble vers l'Avenir"
    ],
    speed: 70,
    delayBetweenWords: 2300
  },

  // Page Actualités
  news: {
    words: [
      "Actualités",
      "Dernières Nouvelles",
      "Restez Informés",
      "Actualités ADEI"
    ],
    speed: 100,
    delayBetweenWords: 1800
  },

  // Page Contact
  contact: {
    words: [
      "Contactez‑nous",
      "Nous Sommes à Votre Écoute",
      "Posez Vos Questions",
      "Collaborons Ensemble"
    ],
    speed: 80,
    delayBetweenWords: 2100
  },

  // Page Actualités & Événements
  newsAndEvents: {
    words: [
      "Actualités & Événements",
      "Toute l'Info ADEI",
      "Ne Ratez Rien",
      "Restez Connectés"
    ],
    speed: 75,
    delayBetweenWords: 2000
  },

  // Page Feedbacks
  feedbacks: {
    words: [
      "Vos Feedbacks",
      "Partagez Vos Avis",
      "Vos Suggestions Comptent",
      "Améliorons Ensemble"
    ],
    speed: 90,
    delayBetweenWords: 2000
  },

  // Configuration par défaut
  default: {
    words: ["Bienvenue"],
    speed: 100,
    delayBetweenWords: 2000,
    cursor: true,
    cursorChar: "|"
  }
};

// Fonction utilitaire pour obtenir la configuration d'une page
export const getTypewriterConfig = (pageName) => {
  return {
    ...typewriterConfig.default,
    ...typewriterConfig[pageName]
  };
};

// Fonction pour créer un composant Typewriter avec la configuration de la page
export const createPageTypewriter = (pageName, customConfig = {}) => {
  const config = getTypewriterConfig(pageName);
  return {
    ...config,
    ...customConfig,
    className: "typewriter-hero"
  };
};