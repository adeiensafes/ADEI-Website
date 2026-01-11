import React from 'react';
import PageTypewriter from './PageTypewriter';
import Typewriter from './Typewriter';

/**
 * Composant de démonstration pour toutes les animations Typewriter
 * Utile pour tester et prévisualiser les animations
 */
const TypewriterShowcase = () => {
  const pages = [
    'home', 'ensa', 'events', 'clubs', 'adei', 
    'news', 'contact', 'newsAndEvents', 'feedbacks'
  ];

  return (
    <div style={{ 
      padding: 'var(--spacing-3xl)', 
      maxWidth: '1200px', 
      margin: '0 auto' 
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: 'var(--spacing-3xl)',
        color: 'var(--text-primary)'
      }}>
        Démonstration des Animations Typewriter
      </h1>

      {/* Animations par page */}
      <div style={{ 
        display: 'grid', 
        gap: 'var(--spacing-3xl)', 
        marginBottom: 'var(--spacing-3xl)' 
      }}>
        {pages.map((pageName) => (
          <div 
            key={pageName}
            className="card"
            style={{ 
              padding: 'var(--spacing-2xl)',
              textAlign: 'center'
            }}
          >
            <h3 style={{ 
              color: 'var(--primary)', 
              marginBottom: 'var(--spacing-lg)',
              textTransform: 'capitalize'
            }}>
              Page {pageName}
            </h3>
            <div style={{ 
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'bold',
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PageTypewriter pageName={pageName} />
            </div>
          </div>
        ))}
      </div>

      {/* Exemples personnalisés */}
      <div className="card" style={{ 
        padding: 'var(--spacing-2xl)',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          color: 'var(--primary)', 
          marginBottom: 'var(--spacing-lg)'
        }}>
          Animation Personnalisée
        </h3>
        <div style={{ 
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'bold',
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typewriter 
            words={[
              "Animation Rapide ⚡",
              "Effet Personnalisé 🎨",
              "Créativité Sans Limites 🚀"
            ]} 
            speed={50} 
            delayBetweenWords={1500} 
            cursor={true} 
            cursorChar="●"
            className="typewriter-accent"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="card" style={{ 
        padding: 'var(--spacing-2xl)',
        marginTop: 'var(--spacing-3xl)'
      }}>
        <h3 style={{ 
          color: 'var(--primary)', 
          marginBottom: 'var(--spacing-lg)'
        }}>
          Comment utiliser
        </h3>
        <pre style={{ 
          background: 'var(--bg-secondary)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'auto',
          fontSize: 'var(--font-size-sm)'
        }}>
{`// Utilisation simple avec configuration de page
<PageTypewriter pageName="home" />

// Utilisation avec mots personnalisés
<PageTypewriter 
  pageName="events" 
  customWords={["Mon Événement", "Rejoignez-nous"]}
/>

// Utilisation du composant de base
<Typewriter 
  words={["Mot 1", "Mot 2"]} 
  speed={100} 
  delayBetweenWords={2000} 
/>`}
        </pre>
      </div>
    </div>
  );
};

export default TypewriterShowcase;