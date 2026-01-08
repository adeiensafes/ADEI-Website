import React, { useEffect, useState, useCallback } from 'react';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/clubs');
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setPageReady(true), 100);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading fade-in">
        <div className="spinner"></div>
        Chargement des clubs...
      </div>
    );
  }

  return (
    <div className={`page-container ${pageReady ? 'fade-in' : ''}`}>
      <div
        className="hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-clubs.png)` }}
      >
        <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
          <h1>Clubs Étudiants</h1>
          <p>Découvrez nos associations dynamiques et rejoignez la communauté qui vous correspond</p>
        </div>
      </div>

      <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
        {clubs && clubs.length > 0 ? (
          <div className="card-grid">
            {clubs.map((club, index) => (
              <div
                key={club._id}
                className={`club-card ${pageReady ? 'slide-up' : ''}`}
                style={{ animationDelay: pageReady ? `${0.4 + index * 0.1}s` : '0s' }}
              >
                <div className="club-card-content">
                  {club.image && (
                    <div className="club-card-image">
                      <img
                        src={`http://localhost:5001${club.image}`}
                        alt={club.club}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="club-card-content-wrapper">
                    <div className="club-card-info">
                      <h2 className="club-card-title">{club.club}</h2>

                      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <p><strong>Président :</strong> {club.president}</p>
                        <p><strong>Année d'étude :</strong> {club.annees_etude}</p>
                      </div>

                      <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <p>
                          <strong>Téléphone :</strong>{' '}
                          <a href={`tel:${club.tel}`} className="text-primary">
                            {club.tel}
                          </a>
                        </p>
                        <p>
                          <strong>Email :</strong>{' '}
                          <a href={`mailto:${club.email}`} className="text-primary">
                            {club.email}
                          </a>
                        </p>
                        {club.website && (
                          <p>
                            <strong>Site web :</strong>{' '}
                            <a
                              href={club.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary"
                            >
                              Visiter le site
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {club.observations && (
                    <div className="info-card">
                      <h4>Observations</h4>
                      <p>{club.observations}</p>
                    </div>
                  )}

                  <div className="club-card-actions">
                    <a href={`/club/${club._id}`} className="btn">
                      Voir les détails
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center">
            <h3>Aucun club disponible</h3>
            <p>Les clubs étudiants apparaîtront ici dès qu'ils seront enregistrés.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;
