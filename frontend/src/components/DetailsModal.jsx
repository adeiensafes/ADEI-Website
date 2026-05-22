import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { getImageUrl } from '../config/api';

const DetailsModal = ({ item, type, isOpen, onClose, clubs = [] }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getOrganizerName = (item) => {
    if (item.club?.club) {
      return item.club.club;
    }
    if (item.organizer) {
      return item.organizer;
    }
    if (item.clubId === 'adei') {
      return 'ADEI';
    }
    if (item.clubId === 'ensa') {
      return 'Administration ENSA Fès';
    }
    return 'ADEI';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="details-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2147483647,
          padding: '20px'
        }}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-color)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: 'var(--spacing-xl)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{
              margin: 0,
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {type === 'news' ? (
                  // Newspaper icon for news
                  <>
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z"/>
                    <path d="M10 6h8"/>
                    <path d="M10 10h8"/>
                    <path d="M10 14h8"/>
                    <path d="M10 18h8"/>
                  </>
                ) : (
                  // Calendar icon for events
                  <>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </>
                )}
              </svg>
              {type === 'news' ? 'Détails de l\'actualité' : 'Détails de l\'événement'}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--bg-secondary)';
                e.target.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-muted)';
              }}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: 'var(--spacing-xl)' }}>
            <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
              
              {/* Title and basic info */}
              <div>
                <h3 style={{ margin: '0 0 var(--spacing-md) 0', color: 'var(--primary)' }}>
                  {item.title}
                </h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', marginBottom: 'var(--spacing-md)' }}>
                  <span className="badge info" style={{ display: 'flex', alignItems: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {formatDate(item.date)}
                  </span>
                  {type === 'events' && (
                    <>
                      <span className="badge secondary" style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                        </svg>
                        {item.time}
                      </span>
                      <span className="badge warning" style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {item.location}
                      </span>
                    </>
                  )}
                  {item.category && (
                    <span className="badge primary">{item.category}</span>
                  )}
                </div>
              </div>

              {/* Organizer info */}
              {(item.club || item.organizer) && (
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    Organisateur
                  </h4>
                  <p style={{ margin: 0, fontWeight: '500' }}>
                    {getOrganizerName(item, clubs)}
                  </p>
                  {item.club && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Président: {item.club.president}
                    </p>
                  )}
                </div>
              )}

              {/* Content/Description */}
              <div>
                <h4 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  {type === 'news' ? 'Contenu' : 'Description'}
                </h4>
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--card-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {type === 'news' ? item.content : item.description}
                </div>
              </div>

              {/* Files */}
              {(item.image || item.document) && (
                <div>
                  <h4 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                    Fichiers attachés
                  </h4>
                  <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    
                    {item.image && (
                      <div style={{
                        padding: 'var(--spacing-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <h5 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21,15 16,10 5,21"/>
                          </svg>
                          Image
                        </h5>
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            objectFit: 'contain',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)'
                          }}
                        />
                      </div>
                    )}

                    {item.document && (
                      <div style={{
                        padding: 'var(--spacing-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <h5 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"/>
                            <polyline points="14,2 14,8 20,8"/>
                          </svg>
                          Document
                        </h5>
                        <a
                          href={getImageUrl(item.document)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: 'var(--radius-md)',
                            width: 'fit-content',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--primary-dark)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'var(--primary)';
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Télécharger le document
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* External Link */}
              {item.link && (
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--primary-light)',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--primary)',
                  textAlign: 'center'
                }}>
                  <h4 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    Plus d'informations
                  </h4>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-dark)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--primary)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15,3 21,3 21,9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    {type === 'events' ? 'S\'inscrire ou en savoir plus' : 'Lire la suite'}
                  </a>
                </div>
              )}

              {/* Metadata */}
              {(item.createdAt || item.updatedAt) && (
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
                    {item.createdAt && (
                      <div><strong>Publié le:</strong> {formatDateTime(item.createdAt)}</div>
                    )}
                    {item.updatedAt && item.updatedAt !== item.createdAt && (
                      <div><strong>Modifié le:</strong> {formatDateTime(item.updatedAt)}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: 'var(--spacing-xl)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--primary)';
                e.target.style.color = 'white';
                e.target.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--bg-secondary)';
                e.target.style.color = 'var(--text-primary)';
                e.target.style.borderColor = 'var(--border-color)';
              }}
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default DetailsModal;