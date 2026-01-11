import React, { useEffect, useState, useCallback } from 'react';
import Typewriter from '../components/ui/Typewriter';

const NewsAndEvents = () => {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [activeTab, setActiveTab] = useState('events'); // Par défaut sur événements

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [newsResponse, eventsResponse] = await Promise.all([
        fetch('http://localhost:5001/api/news'),
        fetch('http://localhost:5001/api/events')
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
              <div className="card-grid">
                {events.map((event, index) => (
                  <div
                    key={event._id || event.id}
                    className={`event-card ${pageReady ? 'slide-up' : ''}`}
                    style={{ animationDelay: pageReady ? `${0.4 + index * 0.1}s` : '0s' }}
                  >
                    <div className="event-card-content">
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
                            <p><strong>Catégorie :</strong> {event.category}</p>
                          )}
                        </div>
                        
                        <div className="event-description">
                          <p>{event.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="card-grid">
                {news.map((article, index) => (
                  <div
                    key={article._id || article.id}
                    className={`news-card ${pageReady ? 'slide-up' : ''}`}
                    style={{ animationDelay: pageReady ? `${0.4 + index * 0.1}s` : '0s' }}
                  >
                    <div className="news-card-content">
                      <div className="news-header">
                        <h3 className="news-title">{article.title}</h3>
                        <span className="news-date">{formatDate(article.date)}</span>
                      </div>
                      
                      <div className="news-content">
                        <p>{article.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center">
                <h3>Aucune actualité disponible</h3>
                <p>Les dernières actualités de l'ADEI apparaîtront ici.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsAndEvents;