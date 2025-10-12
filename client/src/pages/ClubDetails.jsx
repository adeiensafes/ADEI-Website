import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClubDetails = () => {
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setPageReady(true), 100);
  }, []);

  return (
    <div className={`page-container ${pageReady ? 'fade-in' : ''}`}>
      <div
        className="hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-clubs.png)` }}
      >
        <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
          <h1>Page en Construction</h1>
          <p>Cette page sera bientôt disponible</p>
        </div>
      </div>

      <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
        <div className="card text-center" style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'var(--spacing-3xl)'
        }}>
          <div style={{
            fontSize: '80px',
            marginBottom: 'var(--spacing-xl)'
          }}>
            🚧
          </div>
          <h2 style={{
            fontSize: 'var(--font-size-2xl)',
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--text-primary)'
          }}>
            Détails des Clubs
          </h2>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-2xl)',
            lineHeight: '1.6'
          }}>
            Nous travaillons actuellement sur cette page pour vous offrir une meilleure expérience.
            Les détails complets des clubs seront disponibles très prochainement.
          </p>
          <button
            onClick={() => navigate('/clubs')}
            className="btn"
            style={{
              padding: 'var(--spacing-md) var(--spacing-2xl)',
              fontSize: 'var(--font-size-lg)'
            }}
          >
            Retour aux Clubs
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;