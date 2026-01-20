import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Typewriter from '../components/ui/Typewriter';
import { API_ENDPOINTS } from '../config/api';

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

        setNews(newsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setTimeout(() => setPageReady(true), 100);
      }
    };

    fetchData();
  }, []);

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
              <h2>Actualités récentes</h2>
            </div>
            
            {news && news.length > 0 ? (
              <div className="card-grid">
                {news.slice(0, 3).map((article, index) => (
                  <article
                    key={article.id}
                    className={`card ${pageReady ? 'zoom-in' : ''}`}
                    style={{ animationDelay: pageReady ? `${0.3 + index * 0.1}s` : '0s' }}
                  >
                    <h3>{article.title}</h3>
                    <small className="text-muted">{article.date}</small>
                    <p>{article.content}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="card text-center">
                <p>Aucune actualité disponible pour le moment.</p>
              </div>
            )}
          </section>

          {/* Events */}
          <section className={`section ${pageReady ? 'slide-up' : ''}`} style={{ marginTop: 'var(--spacing-3xl)', animationDelay: '0.4s' }}>
            <div className="section-header">
              <h2>Événements à venir</h2>
            </div>
            
            {events && events.length > 0 ? (
              <div className="card-grid">
                {events.slice(0, 3).map((event, index) => (
                  <div
                    key={event.id}
                    className={`card ${pageReady ? 'zoom-in' : ''}`}
                    style={{ animationDelay: pageReady ? `${0.5 + index * 0.1}s` : '0s' }}
                  >
                    <h3>{event.title}</h3>
                    <small className="text-muted">{event.date} • {event.time}</small>
                    <p><strong>Lieu :</strong> {event.location}</p>
                    <p>{event.description}</p>
                    {event.category && (
                      <span className="category-tag">
                        {event.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center">
                <p>Aucun événement programmé pour le moment.</p>
              </div>
            )}
          </section>

          {/* Join ADEI */}
          <section className={`section ${pageReady ? 'slide-up' : ''}`} style={{ marginTop: 'var(--spacing-3xl)', animationDelay: '0.6s' }}>
            <div className="card text-center highlight-card">
              <h2 className="text-primary">Rejoignez l'ADEI</h2>
              <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xl)' }}>Rejoignez l’ADEI et devenez un acteur de la vie étudiante.
En tant que membre, vous participez aux décisions, proposez des initiatives
et contribuez activement à l’évolution de votre école et de votre communauté.
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
                  Découvrir l’ADEI
                </a>
              </div>
            </div>
          </section>
        </div>
      </>
    </div>
  );
};

export default Home;
