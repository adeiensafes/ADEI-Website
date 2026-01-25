import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Typewriter from '../components/ui/Typewriter';
import { API_ENDPOINTS } from '../config/api';
import { getOrganizerName } from '../utils/helpers';

const Home = () => {
  const { token } = useContext(AuthContext);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);

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
                <div className="card-grid">
                  {latestNews.map((article, index) => (
                    <article
                      key={article.id}
                      className={`card ${pageReady ? 'zoom-in' : ''}`}
                      style={{ animationDelay: pageReady ? `${0.3 + index * 0.1}s` : '0s' }}
                    >
                      <h3>{article.title}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                        <small className="text-muted">{article.date}</small>
                        <small style={{ 
                          color: 'var(--primary)', 
                          fontWeight: '500',
                          padding: '2px 8px',
                          backgroundColor: 'var(--primary-light)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem'
                        }}>
                          {getOrganizerName(article)}
                        </small>
                      </div>
                      <p>{article.content}</p>
                    </article>
                  ))}
                </div>
                
                {/* Voir plus button for news */}
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
                  <a
                    href="/news"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-dark)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(255, 59, 48, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--primary)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(255, 59, 48, 0.3)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14"/>
                      <path d="M19 12l-7 7-7-7"/>
                    </svg>
                    Voir plus d'actualités
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
                <div className="card-grid">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={`card ${pageReady ? 'zoom-in' : ''}`}
                      style={{ animationDelay: pageReady ? `${0.5 + index * 0.1}s` : '0s' }}
                    >
                      <h3>{event.title}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                        <small className="text-muted">{event.date} • {event.time}</small>
                        <small style={{ 
                          color: 'var(--primary)', 
                          fontWeight: '500',
                          padding: '2px 8px',
                          backgroundColor: 'var(--primary-light)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem'
                        }}>
                          {getOrganizerName(event)}
                        </small>
                      </div>
                      <p><strong>Lieu :</strong> {event.location}</p>
                      <p>{event.description}</p>
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
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(255, 59, 48, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(255, 59, 48, 0.3)';
                      }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        Organisé par {getOrganizerName(event)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Voir plus button for events */}
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
                  <a
                    href="/events"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-dark)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(255, 59, 48, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--primary)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(255, 59, 48, 0.3)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14"/>
                      <path d="M19 12l-7 7-7-7"/>
                    </svg>
                    Voir plus d'événements
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
    </div>
  );
};

export default Home;