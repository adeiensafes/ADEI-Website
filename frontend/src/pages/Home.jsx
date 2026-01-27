import React, { useEffect, useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../AuthContext';
import Typewriter from '../components/ui/Typewriter';
import { API_ENDPOINTS, getImageUrl } from '../config/api';
import { getOrganizerName } from '../utils/helpers';
import '../styles/home.css';

const Home = () => {
  const { token } = useContext(AuthContext);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, eventsRes] = await Promise.all([
          fetch(API_ENDPOINTS.NEWS),
          fetch(API_ENDPOINTS.EVENTS)
        ]);

        const newsData = await newsRes.json();
        const eventsData = await eventsRes.json();

        // S'assurer que les données sont des tableaux
        setNews(Array.isArray(newsData) ? newsData : []);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // En cas d'erreur, initialiser avec des tableaux vides
        setNews([]);
        setEvents([]);
      } finally {
        setLoading(false);
        setTimeout(() => setPageReady(true), 100);
      }
    };

    fetchData();
  }, []);

  // Get latest news
  const latestNews = Array.isArray(news) ? news
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3) : [];

  // Get nearest events
  const upcomingEvents = Array.isArray(events) ? events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3) : [];

  const handleShowDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [showModal]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading fade-in">
        <div className="spinner"></div>
        Chargement...
      </div>
    );
  }

  return (
    <div className={`page-container ${pageReady ? 'fade-in' : ''}`}>
      <>
        {/* Hero */}
        <div
          className="hero"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-home.png)` }}
        >
          <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
            <h1>
              <Typewriter 
                words={[
                  "Bienvenue sur l'ADEI",
                  "Découvrez notre communauté",
                  "Rejoignez-nous aujourd'hui",
                  "Votre avenir commence ici"
                ]} 
                speed={80} 
                delayBetweenWords={2000} 
                cursor={true} 
                cursorChar="|"
                className="typewriter-hero"
              />
            </h1>
            <p>
              Découvrez notre communauté dynamique d'étudiants ingénieurs, 
              nos dernières actualités et les événements à venir qui façonnent 
              votre parcours académique et professionnel.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {/* News */}
          <section className={`section ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="section-header">
              <h2>Dernières actualités</h2>
            </div>
            
            {latestNews && latestNews.length > 0 ? (
              <>
                <div className="news-events-grid">
                  {latestNews.map((article, index) => (
                    <article
                      key={article.id}
                      className={`news-event-card ${pageReady ? 'zoom-in' : ''}`}
                      style={{ animationDelay: pageReady ? `${0.3 + index * 0.1}s` : '0s' }}
                    >
                      <div className="news-event-content">
                        <div className="news-event-info">
                          <div className="news-event-header">
                            <h3 className="news-event-title">{article.title}</h3>
                            <div className="news-event-meta">
                              <small className="text-muted">{article.date}</small>
                              <small className="organizer-badge">
                                {getOrganizerName(article)}
                              </small>
                            </div>
                          </div>
                          
                          <div className="news-event-description">
                            <p>{article.content?.length > 150 ? `${article.content.substring(0, 150)}...` : article.content}</p>
                          </div>
                          
                          <div className="news-event-actions">
                            <button
                              onClick={() => handleShowDetails(article, 'news')}
                              className="voir-plus-btn"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                              Voir plus
                            </button>
                          </div>
                        </div>
                        
                        {article.image && (
                          <div className="news-event-image">
                            <img
                              src={getImageUrl(article.image)}
                              alt={article.title}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
                
                {/* Voir plus button for news */}
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
                  <a
                    href="/#/news"
                    className="section-voir-plus-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14"/>
                      <path d="M19 12l-7 7-7-7"/>
                    </svg>
                    Voir toutes les actualités
                  </a>
                </div>
              </>
            ) : (
              <div className="card text-center">
                <p>Aucune actualité disponible.</p>
              </div>
            )}
          </section>

          {/* Events */}
          <section className={`section ${pageReady ? 'slide-up' : ''}`} style={{ marginTop: 'var(--spacing-3xl)', animationDelay: '0.4s' }}>
            <div className="section-header">
              <h2>Prochains événements</h2>
            </div>
            
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <>
                <div className="news-events-grid">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={`news-event-card ${pageReady ? 'zoom-in' : ''}`}
                      style={{ animationDelay: pageReady ? `${0.5 + index * 0.1}s` : '0s' }}
                    >
                      <div className="news-event-content">
                        <div className="news-event-info">
                          <div className="news-event-header">
                            <h3 className="news-event-title">{event.title}</h3>
                            <div className="news-event-meta">
                              <small className="text-muted">{event.date} • {event.time}</small>
                              <small className="organizer-badge">
                                {getOrganizerName(event)}
                              </small>
                            </div>
                          </div>
                          
                          <div className="news-event-description">
                            <p><strong>Lieu :</strong> {event.location}</p>
                            <p>{event.description?.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}</p>
                          </div>
                          
                          <div className="news-event-actions">
                            <button
                              onClick={() => handleShowDetails(event, 'event')}
                              className="voir-plus-btn"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                              Voir plus
                            </button>
                          </div>
                        </div>
                        
                        {event.image && (
                          <div className="news-event-image">
                            <img
                              src={getImageUrl(event.image)}
                              alt={event.title}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Voir plus button for events */}
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
                  <a
                    href="/#/events"
                    className="section-voir-plus-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14"/>
                      <path d="M19 12l-7 7-7-7"/>
                    </svg>
                    Voir tous les événements
                  </a>
                </div>
              </>
            ) : (
              <div className="card text-center">
                <p>Aucun événement programmé prochainement.</p>
              </div>
            )}
          </section>

          {/* Join ADEI - Only for non-logged users */}
          {!token && (
            <section className={`section ${pageReady ? 'slide-up' : ''}`} style={{ marginTop: 'var(--spacing-3xl)', animationDelay: '0.6s' }}>
              <div className="card text-center highlight-card">
                <h2 className="text-primary">Rejoignez l'ADEI</h2>
                <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xl)' }}>Rejoignez l'ADEI et devenez un acteur de la vie étudiante.
En tant que membre, vous participez aux décisions, proposez des initiatives
et contribuez activement à l'évolution de votre école et de votre communauté.
                </p>
                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-md)', 
                  justifyContent: 'center', 
                  flexWrap: 'wrap' 
                }}>
                  <a href="https://forms.gle/UFx4SFxH9uxJAosN9" className="btn">
                    Devenir membre
                  </a>
                  <a href="/adei" className="btn secondary">
                    Découvrir l'ADEI
                  </a>
                </div>
              </div>
            </section>
          )}
        </div>
      </>

      {/* Modal */}
      {showModal && selectedItem && createPortal(
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedItem.title}</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              {selectedItem.image && (
                <div className="modal-image">
                  <img
                    src={getImageUrl(selectedItem.image)}
                    alt={selectedItem.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="modal-info">
                <div className="modal-meta">
                  {selectedItem.type === 'event' ? (
                    <>
                      <div className="modal-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{formatDate(selectedItem.date)} à {selectedItem.time}</span>
                      </div>
                      <div className="modal-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{selectedItem.location}</span>
                      </div>
                    </>
                  ) : (
                    <div className="modal-meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{formatDate(selectedItem.date || selectedItem.createdAt)}</span>
                    </div>
                  )}
                  <div className="modal-meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="organizer-badge">{getOrganizerName(selectedItem)}</span>
                  </div>
                </div>
                
                <div className="modal-description">
                  <p>{selectedItem.content || selectedItem.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Home;