import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import Typewriter from '../components/ui/Typewriter';
import DetailsModal from '../components/DetailsModal';
import { API_ENDPOINTS, getImageUrl } from '../config/api';
import { getCategoryLabel, getOrganizerName, handleOrganizerClick } from '../utils/helpers';

const Events = () => {
  const location = useLocation();
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'events', 'news'
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 6;

  // Handle URL parameters for filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam && ['all', 'events', 'news'].includes(filterParam)) {
      setActiveFilter(filterParam);
    }
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [newsRes, eventsRes] = await Promise.all([
        fetch(API_ENDPOINTS.NEWS),
        fetch(API_ENDPOINTS.EVENTS)
      ]);

      const newsResult = await newsRes.json();
      const eventsResult = await eventsRes.json();

      // Gérer la nouvelle structure de réponse de l'API
      const newsData = newsResult.success && Array.isArray(newsResult.data) 
        ? newsResult.data 
        : (Array.isArray(newsResult) ? newsResult : []);
        
      const eventsData = eventsResult.success && Array.isArray(eventsResult.data) 
        ? eventsResult.data 
        : (Array.isArray(eventsResult) ? eventsResult : []);

      setNews(newsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNews([]);
      setEvents([]);
    } finally {
      setLoading(false);
      setTimeout(() => setPageReady(true), 100);
    }
  };

  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
    // Update URL without page reload
    const newUrl = newFilter === 'all' ? '/events' : `/events?filter=${newFilter}`;
    window.history.pushState({}, '', `/#${newUrl}`);
  };

  // Combine and filter items based on active filter and search
  useEffect(() => {
    let combinedItems = [];

    if (activeFilter === 'all' || activeFilter === 'news') {
      const newsItems = news.map(item => ({ ...item, type: 'news' }));
      combinedItems = [...combinedItems, ...newsItems];
    }

    if (activeFilter === 'all' || activeFilter === 'events') {
      const eventItems = events.map(item => ({ ...item, type: 'events' }));
      combinedItems = [...combinedItems, ...eventItems];
    }

    // Apply search filter
    if (search) {
      combinedItems = combinedItems.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(search.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
        (item.category && getCategoryLabel(item.category).toLowerCase().includes(search.toLowerCase())) ||
        getOrganizerName(item).toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by date (newest first)
    combinedItems.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return dateB - dateA;
    });

    setFilteredItems(combinedItems);
    setCurrentPage(1); // Reset pagination when filter changes
  }, [news, events, activeFilter, search]);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const loadMoreItems = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 500);
  };

  const displayedItems = filteredItems.slice(0, currentPage * itemsPerPage);
  const hasMoreItems = displayedItems.length < filteredItems.length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFilterCount = (filter) => {
    switch (filter) {
      case 'all':
        return news.length + events.length;
      case 'news':
        return news.length;
      case 'events':
        return events.length;
      default:
        return 0;
    }
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
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-home.png)` }}
      >
        <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
          <h1>
            <Typewriter 
              words={[
                "Actualités & Événements",
                "Restez Informés",
                "Participez à la Vie Étudiante",
                "Découvrez Nos Activités"
              ]} 
              speed={90} 
              delayBetweenWords={2000} 
              cursor={true} 
              cursorChar="|"
              className="typewriter-hero"
            />
          </h1>
          <p>Découvrez toutes nos actualités et événements en un seul endroit</p>
        </div>
      </div>

      <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
        
        {/* Search and Filter Section */}
        <div className="filters-section" style={{ marginBottom: 'var(--spacing-xl)' }}>
          {/* Search Bar */}
          <div className="search-bar" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher dans les actualités et événements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons" style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {[
              { 
                key: 'all', 
                label: 'Tout', 
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                )
              },
              { 
                key: 'events', 
                label: 'Événements', 
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                )
              },
              { 
                key: 'news', 
                label: 'Actualités', 
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z"/>
                    <path d="M10 6h8"/>
                    <path d="M10 10h8"/>
                    <path d="M10 14h8"/>
                    <path d="M10 18h8"/>
                  </svg>
                )
              }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  backgroundColor: activeFilter === filter.key ? 'var(--primary)' : 'var(--card-bg)',
                  color: activeFilter === filter.key ? 'white' : 'var(--text-color)',
                  border: `2px solid ${activeFilter === filter.key ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-md)',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: activeFilter === filter.key ? '0 4px 15px rgba(255, 59, 48, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (activeFilter !== filter.key) {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== filter.key) {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
                <span style={{
                  backgroundColor: activeFilter === filter.key ? 'rgba(255,255,255,0.2)' : 'var(--primary)',
                  color: activeFilter === filter.key ? 'white' : 'white',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {getFilterCount(filter.key)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--spacing-xl)',
          color: 'var(--text-muted)'
        }}>
          {search ? (
            <p>
              <strong>{filteredItems.length}</strong> résultat{filteredItems.length !== 1 ? 's' : ''} 
              pour "<em>{search}</em>"
              {activeFilter !== 'all' && ` dans ${activeFilter === 'events' ? 'les événements' : 'les actualités'}`}
            </p>
          ) : (
            <p>
              <strong>{filteredItems.length}</strong> {
                activeFilter === 'all' ? 'éléments au total' :
                activeFilter === 'events' ? 'événements' : 'actualités'
              }
            </p>
          )}
        </div>

        {/* Items Grid */}
        {filteredItems && filteredItems.length > 0 ? (
          <>
            <div className="news-events-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--spacing-xl)',
              marginBottom: 'var(--spacing-xl)'
            }}>
              {displayedItems.map((item, index) => (
                <article
                  key={`${item.type}-${item.id}`}
                  className={`news-event-card ${pageReady ? 'zoom-in' : ''}`}
                  style={{ 
                    animationDelay: pageReady ? `${0.1 + (index % itemsPerPage) * 0.1}s` : '0s',
                    position: 'relative',
                    maxWidth: '100%'
                  }}
                >
                  {/* Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: item.type === 'events' ? '#10B981' : '#3B82F6',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    zIndex: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {item.type === 'events' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z"/>
                        <path d="M10 6h8"/>
                        <path d="M10 10h8"/>
                        <path d="M10 14h8"/>
                        <path d="M10 18h8"/>
                      </svg>
                    )}
                    <span>{item.type === 'events' ? 'Événement' : 'Actualité'}</span>
                  </div>

                  <div className="news-event-content">
                    <div className="news-event-info">
                      <div className="news-event-header">
                        <h3 className="news-event-title">{item.title}</h3>
                        <div className="news-event-meta">
                          <small className="text-muted">
                            {item.type === 'events' ? (
                              `${formatDate(item.date)} • ${item.time}`
                            ) : (
                              formatDate(item.date || item.createdAt)
                            )}
                          </small>
                          <small className="organizer-badge">
                            {getOrganizerName(item)}
                          </small>
                        </div>
                      </div>
                      
                      {/* Event specific info */}
                      {item.type === 'events' && item.location && (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          marginBottom: 'var(--spacing-sm)',
                          color: 'var(--text-muted)',
                          fontSize: '0.9rem'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          <span><strong>Lieu:</strong> {item.location}</span>
                        </div>
                      )}

                      {/* Category for events */}
                      {item.type === 'events' && item.category && (
                        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                      )}
                      
                      <div className="news-event-description">
                        <p>
                          {item.type === 'events' 
                            ? (item.description?.length > 150 ? `${item.description.substring(0, 150)}...` : item.description)
                            : (item.content?.length > 150 ? `${item.content.substring(0, 150)}...` : item.content)
                          }
                        </p>
                      </div>
                      
                      <div className="news-event-actions">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="voir-plus-btn"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Voir plus
                        </button>

                        {/* External link button if available */}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 16px',
                              backgroundColor: 'var(--success)',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'var(--success-dark)';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'var(--success)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15,3 21,3 21,9"/>
                              <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            {item.type === 'events' ? 'S\'inscrire' : 'Lire plus'}
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {item.image && (
                      <div className="news-event-image">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
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

            {/* Load More Button */}
            {hasMoreItems && (
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
                      Voir plus d'éléments
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center">
            <h3>
              {search ? 'Aucun résultat trouvé' : 'Aucun contenu disponible'}
            </h3>
            <p>
              {search
                ? `Aucun ${activeFilter === 'all' ? 'élément' : activeFilter === 'events' ? 'événement' : 'actualité'} ne correspond à "${search}"`
                : `Aucun ${activeFilter === 'all' ? 'contenu' : activeFilter === 'events' ? 'événement' : 'actualité'} n'est disponible pour le moment.`
              }
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  marginTop: 'var(--spacing-md)',
                  padding: '8px 16px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                Effacer la recherche
              </button>
            )}
          </div>
        )}
      </div>

      <DetailsModal
        item={selectedItem}
        type={selectedItem?.type}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Events;
