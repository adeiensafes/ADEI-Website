import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from '../components/ui/Typewriter';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchClubs();
    
    // Nettoyer le scroll au démontage du composant
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const fetchClubs = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CLUBS);
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setPageReady(true), 100);
    }
  }, []);

  const handleShowDetails = (club) => {
    setSelectedClub(club);
    setShowModal(true);
    // Empêcher le scroll de la page en arrière-plan
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClub(null);
    // Restaurer le scroll de la page
    document.body.style.overflow = 'unset';
  };

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
          <h1>
            <Typewriter 
              words={[
                "Clubs Étudiants",
                "Associations Dynamiques",
                "Trouvez Votre Passion",
                "Développez Vos Talents"
              ]} 
              speed={85} 
              delayBetweenWords={2200} 
              cursor={true} 
              cursorChar="|"
              className="typewriter-hero"
            />
          </h1>
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
                <div className="club-card-content" style={{ padding: 'var(--spacing-lg)' }}>
                  {/* Contenu principal avec image à droite */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                    <div className="club-card-content-wrapper" style={{ flex: 1 }}>
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

                        {club.description && (
                          <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <p><strong>Description :</strong></p>
                            <p style={{ 
                              color: 'var(--text-muted)', 
                              lineHeight: '1.5',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {club.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {club.image && (
                      <div className="club-profile-image" style={{ flexShrink: 0 }}>
                        <img
                          src={`${API_BASE_URL}${club.image}`}
                          alt={club.club}
                          style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '3px solid var(--color-primary)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Observations si elles existent */}
                  {club.observations && (
                    <div className="info-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <h4>Observations</h4>
                      <p>{club.observations}</p>
                    </div>
                  )}

                  {/* Bouton "Voir les détails" en bas à droite */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleShowDetails(club)}
                      className="btn"
                    >
                      Voir les détails
                    </button>
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

      {/* Modal des détails du club */}
      <AnimatePresence>
        {showModal && selectedClub && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              padding: 'var(--spacing-lg)'
            }}
          >
            <motion.div
              className="modal-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--card-bg)',
                borderRadius: 'var(--radius-xl)',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
              }}
            >
              {/* Header du modal */}
              <div style={{
                padding: 'var(--spacing-xl)',
                borderBottom: '1px solid var(--card-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>
                  {selectedClub.club}
                </h2>
                <button
                  onClick={closeModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: 'var(--spacing-xs)'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Contenu du modal */}
              <div style={{
                padding: 'var(--spacing-xl)',
                maxHeight: 'calc(90vh - 140px)',
                overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                  {/* Informations principales */}
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                        Informations générales
                      </h3>
                      <p><strong>Président :</strong> {selectedClub.president}</p>
                      <p><strong>Année d'étude :</strong> {selectedClub.annees_etude}</p>
                      {selectedClub.meetings && (
                        <p><strong>Réunions :</strong> {selectedClub.meetings}</p>
                      )}
                    </div>

                    {/* Contacts */}
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                        Contacts
                      </h3>
                      <p>
                        <strong>Téléphone :</strong>{' '}
                        <a href={`tel:${selectedClub.tel}`} className="text-primary">
                          {selectedClub.tel}
                        </a>
                      </p>
                      <p>
                        <strong>Email :</strong>{' '}
                        <a href={`mailto:${selectedClub.email}`} className="text-primary">
                          {selectedClub.email}
                        </a>
                      </p>
                      {selectedClub.website && (
                        <p>
                          <strong>Site web :</strong>{' '}
                          <a
                            href={selectedClub.website}
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

                  {/* Image du club */}
                  {selectedClub.image && (
                    <div style={{ flexShrink: 0 }}>
                      <img
                        src={`${API_BASE_URL}${selectedClub.image}`}
                        alt={selectedClub.club}
                        style={{
                          width: '200px',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '4px solid var(--color-primary)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                {selectedClub.description && (
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                      Description
                    </h3>
                    <p style={{ lineHeight: '1.6' }}>{selectedClub.description}</p>
                  </div>
                )}

                {/* Activités */}
                {selectedClub.activities && selectedClub.activities.length > 0 && (
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                      Activités
                    </h3>
                    <ul style={{ paddingLeft: 'var(--spacing-lg)' }}>
                      {selectedClub.activities.map((activity, index) => (
                        <li key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Réalisations */}
                {selectedClub.achievements && selectedClub.achievements.length > 0 && (
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                      Réalisations
                    </h3>
                    <ul style={{ paddingLeft: 'var(--spacing-lg)' }}>
                      {selectedClub.achievements.map((achievement, index) => (
                        <li key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Membres */}
                {selectedClub.members && selectedClub.members.length > 0 && (
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                      Membres du bureau
                    </h3>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: 'var(--spacing-md)' 
                    }}>
                      {selectedClub.members.map((member, index) => (
                        <div 
                          key={index} 
                          style={{ 
                            background: 'var(--bg-secondary)', 
                            padding: 'var(--spacing-md)', 
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--card-border)'
                          }}
                        >
                          <p style={{ margin: 0, fontWeight: 'bold' }}>{member.name}</p>
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                            {member.role}
                          </p>
                          {member.year && (
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                              {member.year}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Réseaux sociaux */}
                {selectedClub.socialMedia && (
                  Object.values(selectedClub.socialMedia).some(url => url && url.trim() !== '') && (
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                        Réseaux sociaux
                      </h3>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '12px' 
                      }}>
                        {selectedClub.socialMedia.facebook && (
                          <a 
                            href={selectedClub.socialMedia.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              color: '#1877F2',
                              textDecoration: 'none',
                              transition: 'opacity 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Facebook
                          </a>
                        )}
                        
                        {selectedClub.socialMedia.instagram && (
                          <a 
                            href={selectedClub.socialMedia.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              color: '#E4405F',
                              textDecoration: 'none',
                              transition: 'opacity 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            Instagram
                          </a>
                        )}
                        
                        {selectedClub.socialMedia.linkedin && (
                          <a 
                            href={selectedClub.socialMedia.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              color: '#0A66C2',
                              textDecoration: 'none',
                              transition: 'opacity 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  )
                )}

                {/* Observations */}
                {selectedClub.observations && (
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                      Observations
                    </h3>
                    <p style={{ lineHeight: '1.6' }}>{selectedClub.observations}</p>
                  </div>
                )}
              </div>

              {/* Footer du modal */}
              <div style={{
                padding: 'var(--spacing-xl)',
                borderTop: '1px solid var(--card-border)',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <button onClick={closeModal} className="btn secondary">
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clubs;
