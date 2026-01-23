import React, { useEffect, useState, useCallback } from 'react';
import Typewriter from '../components/ui/Typewriter';
import DetailsModal from '../components/DetailsModal';
import { API_ENDPOINTS } from '../config/api';
import { getCategoryLabel, getOrganizerName, handleOrganizerClick } from '../utils/helpers';

const NewsAndEvents = () => {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [activeTab, setActiveTab] = useState('events'); // Par défaut sur événements
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [newsResponse, eventsResponse] = await Promise.all([
        fetch(API_ENDPOINTS.NEWS),
        fetch(API_ENDPOINTS.EVENTS)
      ]);
      
      const newsData = await newsResponse.json();
      const eventsData = await eventsResponse.json();
      
      setNews(newsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setPageReady(true), 100);
    }
  }, []);

  const handleViewDetails = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setSelectedType(null);
  };

  const loadMoreItems = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 500);
  };

  // Reset pagination when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const displayedEvents = events.slice(0, currentPage * itemsPerPage);
  const displayedNews = news.slice(0, currentPage * itemsPerPage);
  const hasMoreEvents = displayedEvents.length < events.length;
  const hasMoreNews = displayedNews.length < news.length;

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
      <div
        className="hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-events.png)` }}
      >
        <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
          <h1>
            <Typewriter 
              words={[
                "Actualités & Événements",
                "Toute l'Info ADEI",
                "Ne Ratez Rien",
                "Restez Connectés"
              ]} 
              speed={75} 
              delayBetweenWords={2000} 
              cursor={true} 
              cursorChar="|"
              className="typewriter-hero"
            />
          </h1>
          <p>Restez informés de toutes les actualités et événements de l'ADEI</p>
        </div>
      </div>

      <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
        {/* Onglets de navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: 'var(--spacing-xl)',
          gap: 'var(--spacing-md)',
          background: 'var(--card-bg)',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--card-border)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => setActiveTab('events')}
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            style={{
              padding: 'var(--spacing-md) var(--spacing-xl)',
              border: activeTab === 'events' ? 'none' : '1px solid #d1d5db',
              borderRadius: 'var(--radius-lg)',
              background: activeTab === 'events' ? '#DC2626' : '#f9fafb',
              color: activeTab === 'events' ? 'white' : '#374151',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600',
              fontSize: 'var(--font-size-md)',
              boxShadow: activeTab === 'events' ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'events') {
                e.currentTarget.style.background = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'events') {
                e.currentTarget.style.background = '#f9fafb';
              }
            }}
          >
            Événements ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`tab-button ${activeTab === 'news' ? 'active' : ''}`}
            style={{
              padding: 'var(--spacing-md) var(--spacing-xl)',
              border: activeTab === 'news' ? 'none' : '1px solid #d1d5db',
              borderRadius: 'var(--radius-lg)',
              background: activeTab === 'news' ? '#DC2626' : '#f9fafb',
              color: activeTab === 'news' ? 'white' : '#374151',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600',
              fontSize: 'var(--font-size-md)',
              boxShadow: activeTab === 'news' ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'news') {
                e.currentTarget.style.background = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'news') {
                e.currentTarget.style.background = '#f9fafb';
              }
            }}
          >
            Actualités ({news.length})
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'events' && (
          <div className="events-section">
            {events && events.length > 0 ? (
              <>
                <div className="card-grid">
                  {displayedEvents.map((event, index) => (
                  <div
                    key={event._id || event.id}
                    className={`card ${pageReady ? 'slide-up' : ''}`}
                    style={{ animationDelay: pageReady ? `${0.4 + index * 0.1}s` : '0s' }}
                  >
                    <div className="card-content">
                      <div className="event-date-badge">
                        <span className="event-day">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="event-month">
                          {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}
                        </span>
                      </div>
                      
                      <div className="event-info">
                        <h3 className="event-title">{event.title}</h3>
                        
                        <div className="event-details">
                          <p><strong>Date :</strong> {formatDate(event.date)}</p>
                          <p><strong>Heure :</strong> {event.time}</p>
                          <p><strong>Lieu :</strong> {event.location}</p>
                          {event.category && (
                            <p><strong>Catégorie :</strong> {getCategoryLabel(event.category)}</p>
                          )}
                        </div>
                        
                        <div className="event-description">
                          <p>{event.description?.substring(0, 120)}...</p>
                        </div>

                        {/* Prominent Organizer Display */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 'var(--spacing-md)',
                          padding: '10px 16px',
                          background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                          color: 'white',
                          borderRadius: 'var(--radius-lg)',
                          fontWeight: '700',
                          fontSize: '0.9rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleOrganizerClick(event)}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(255, 59, 48, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 15px rgba(255, 59, 48, 0.3)';
                        }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                          Organisé par {getOrganizerName(event)}
                        </div>

                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          marginTop: 'var(--spacing-md)',
                          paddingTop: 'var(--spacing-md)',
                          borderTop: '1px solid var(--border-color)'
                        }}>
                          <button
                            onClick={() => handleViewDetails(event, 'events')}
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
                    </div>
                  </div>
                ))}
              </div>

              {hasMoreEvents && (
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
                  <button
                    onClick={loadMoreItems}
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
                <h3>Aucun événement disponible</h3>
                <p>Les événements à venir apparaîtront ici dès qu'ils seront programmés.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="news-section">
            {news && news.length > 0 ? (
              <>
                <div className="card-grid">
                  {displayedNews.map((article, index) => (
                  <div
                    key={article._id || article.id}
                    className={`card ${pageReady ? 'slide-up' : ''}`}
                    style={{ animationDelay: pageReady ? `${0.4 + index * 0.1}s` : '0s' }}
                  >
                    <div className="card-content">
                      <div className="news-header">
                        <h3 className="news-title">{article.title}</h3>
                        <span className="news-date">{formatDate(article.date)}</span>
                      </div>
                      
                      <div className="news-content">
                        <p>{article.content?.substring(0, 150)}...</p>
                      </div>

                      {/* Prominent Organizer Display */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 'var(--spacing-md)',
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                        color: 'white',
                        borderRadius: 'var(--radius-lg)',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleOrganizerClick(article)}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(255, 59, 48, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(255, 59, 48, 0.3)';
                      }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        Publié par {getOrganizerName(article)}
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        marginTop: 'var(--spacing-md)',
                        paddingTop: 'var(--spacing-md)',
                        borderTop: '1px solid var(--border-color)'
                      }}>
                        <button
                          onClick={() => handleViewDetails(article, 'news')}
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
                  </div>
                ))}
              </div>

              {hasMoreNews && (
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
                  <button
                    onClick={loadMoreItems}
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
                        Voir plus d'actualités
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
            ) : (
              <div className="card text-center">
                <h3>Aucune actualité disponible</h3>
                <p>Les dernières actualités de l'ADEI apparaîtront ici.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <DetailsModal
        item={selectedItem}
        type={selectedType}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default NewsAndEvents;