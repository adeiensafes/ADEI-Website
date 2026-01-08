import React, { useEffect, useState } from 'react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setPageReady(true), 100);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    (event.category && event.category.toLowerCase().includes(search.toLowerCase()))
  );

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
          <h1>Événements</h1>
          <p>Découvrez nos activités passionnantes et rejoignez la communauté ADEI</p>
        </div>
      </div>

      <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
        <div className="search-bar">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un événement ou une catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredEvents && filteredEvents.length > 0 ? (
          <div className="card-grid">
            {filteredEvents.map((event, index) => (
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
                  <small className="text-muted">📅 {event.date}</small>
                  <small className="text-muted">🕐 {event.time}</small>
                </div>
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
    </div>
  );
};

export default Events;
