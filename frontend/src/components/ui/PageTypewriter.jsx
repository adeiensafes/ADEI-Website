import React from 'react';
import Typewriter from './Typewriter';
import { getTypewriterConfig } from '../../config/typewriterConfig';

/**
 * Composant Typewriter spécialisé pour les pages
 * Utilise automatiquement la configuration définie pour chaque page
 */
const PageTypewriter = ({ 
  pageName, 
  customWords = null, 
  customConfig = {},
  className = "typewriter-hero",
  ...props 
}) => {
  // Récupérer la configuration de la page
  const pageConfig = getTypewriterConfig(pageName);
  
  // Fusionner avec la configuration personnalisée
  const finalConfig = {
    ...pageConfig,
    ...customConfig,
    words: customWords || pageConfig.words,
    className,
    cursor: true,
    cursorChar: "|",
    ...props
  };

  return <Typewriter {...finalConfig} />;
};

export default PageTypewriter;