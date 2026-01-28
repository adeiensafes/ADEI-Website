import React, { useEffect, useState } from 'react';
import Typewriter from '../components/ui/Typewriter';
import DetailsModal from '../components/DetailsModal';
import { API_ENDPOINTS } from '../config/api';
import { getCategoryLabel, getOrganizerName, handleOrganizerClick } from '../utils/helpers';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.EVENTS);
      const result = await response.json();
      
      // Gérer la nouvelle structure de réponse de l'API
      if (result.success && Array.isArray(result.data)) {
        setEvents(result.data);
      } else if (Array.isArray(result)) {
        // Fallback pour l'ancien format
        setEvents(result);
      } else {
        console.error('Format de réponse inattendu:', result);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
      setTimeout(() => setPageReady(true), 100);
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const loadMoreEvents = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 500);
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    (event.category && (
      event.category.toLowerCase().includes(search.toLowerCase()) ||
      getCategoryLabel(event.category).toLowerCase().includes(search.toLowerCase())
    ))
  );

  // Reset pagination when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const displayedEvents = filteredEvents.slice(0, currentPage * itemsPerPage);
  const hasMoreEvents = displayedEvents.length < filteredEvents.length;

  if (loading) {
    return (
      <div className="loading fade-in">
        <div className="spinner"></div>
        Chargement des événements...
      </div>
    );
  }

  return (
    <div className={`page-container ${pageReady ? 'fade-in' : ''}`}>
      <div
        className="hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-home.png)` }}
      >
        <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
          <h1>
            <Typewriter 
              words={[
                "Événements",
                "Activités Étudiantes",
                "Rejoignez-nous",
                "Vivez l'Expérience ADEI"
              ]} 
              speed={90} 
              delayBetweenWords={2000} 
              cursor={true} 
              cursorChar="|"
              className="typewriter-hero"
            />
          </h1>
          <p>Découvrez nos activités passionnantes et rejoignez la communauté ADEI</p>
        </div>
      </div>

      <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
        <div className="search-bar">
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un événement ou une catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredEvents && filteredEvents.length > 0 ? (
          <>
            <div className="card-grid">
              {displayedEvents.map((event, index) => (
              <div
                key={event._id}
                className={`card ${pageReady ? 'slide-up' : ''}`}
                style={{ animationDelay: pageReady ? `${0.5 + index * 0.1}s` : '0s' }}
              >
                <h2 className="mt-0">{event.title}</h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-md)',
                  flexWrap: 'wrap'
                }}>
                  <small className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {event.date}
                  </small>
                  <small className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    {event.time}
                  </small>
                </div>
                <p><strong>Lieu :</strong> {event.location}</p>
                <p>{event.description?.substring(0, 120)}...</p>
                
                {/* Prominent Organizer Display */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 'var(--spacing-md)',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                  color: 'white',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: '700',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => handleOrganizerClick(event)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 59, 48, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 59, 48, 0.3)';
                }}
                >
                  {/* Animated background effect */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.5s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.left = '100%';
                  }}
                  />
                  
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '10px', zIndex: 1 }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span style={{ zIndex: 1 }}>Organisé par {getOrganizerName(event)}</span>
                </div>
                
                {/* Category as secondary info if available */}
                {event.category && (
                  <div style={{
                    marginTop: 'var(--spacing-sm)',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-muted)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      border: '1px solid var(--border-color)'
                    }}>
                      {getCategoryLabel(event.category)}
                    </span>
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginTop: 'var(--spacing-md)',
                  paddingTop: 'var(--spacing-md)',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <button
                    onClick={() => handleViewDetails(event)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-dark)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--primary)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>

          {hasMoreEvents && (
            <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
              <button
                onClick={loadMoreEvents}
                disabled={loadingMore}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto',
                  padding: '12px 24px',
                  backgroundColor: loadingMore ? 'var(--bg-secondary)' : 'var(--primary)',
                  color: loadingMore ? 'var(--text-muted)' : 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!loadingMore) {
                    e.target.style.backgroundColor = 'var(--primary-dark)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loadingMore) {
                    e.target.style.backgroundColor = 'var(--primary)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {loadingMore ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid var(--text-muted)',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Chargement...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14"/>
                      <path d="M19 12l-7 7-7-7"/>
                    </svg>
                    Voir plus d'événements
                  </>
                )}
              </button>
            </div>
          )}
        </>
        ) : (
          <div className="card text-center">
            <h3>
              {search ? 'Aucun événement trouvé' : 'Aucun événement disponible'}
            </h3>
            <p>
              {search
                ? `Aucun événement ne correspond à "${search}"`
                : 'Les événements apparaîtront ici dès qu\'ils seront programmés.'
              }
            </p>
          </div>
        )}
      </div>

      <DetailsModal
        item={selectedEvent}
        type="events"
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Events;
