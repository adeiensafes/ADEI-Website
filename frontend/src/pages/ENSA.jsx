import React, { useState, useEffect } from 'react';
import Typewriter from '../components/ui/Typewriter';
import { API_ENDPOINTS } from '../config/api';

const ENSA = () => {
  const [pageReady, setPageReady] = useState(false);
  const [activeSection, setActiveSection] = useState('filieres');
  const [filieres, setFilieres] = useState([]);
  const [classesPrepa, setClassesPrepa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiliere, setSelectedFiliere] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFilieres();
    const timer = setTimeout(() => setPageReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const fetchFilieres = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.FILIERES);
      const data = await response.json();
      
      // Parser les données et s'assurer que years est un tableau
      const parsedData = data.map(item => ({
        ...item,
        years: Array.isArray(item.years) 
          ? item.years 
          : (typeof item.years === 'string' 
              ? item.years.split('\n').filter(y => y.trim()) 
              : [])
      }));
      
      // Séparer les filières et les classes prépa
      const filieresData = parsedData.filter(item => item.type === 'filiere');
      const prepaData = parsedData.filter(item => item.type === 'prepa');
      
      setFilieres(filieresData);
      setClassesPrepa(prepaData);
    } catch (error) {
      console.error('Error fetching filières:', error);
      // En cas d'erreur, utiliser des données par défaut
      setFilieres([]);
      setClassesPrepa([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (filiere) => {
    setSelectedFiliere(filiere);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFiliere(null);
  };

  const renderFiliereCard = (filiere, index) => (
    <div
      key={filiere.abbreviation}
      className={`filiere-card ${pageReady ? 'slide-up' : ''}`}
      style={{ 
        animationDelay: pageReady ? `${0.4 + index * 0.1}s` : '0s',
        background: 'var(--card-bg)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--spacing-xl)',
        border: '1px solid var(--card-border)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%' // Assure que toutes les cartes ont la même hauteur
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Header de la carte */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <div>
          <h3 style={{ 
            color: 'var(--color-primary)', 
            margin: 0,
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'bold'
          }}>
            {filiere.abbreviation}
          </h3>
          <p style={{ 
            margin: 0, 
            color: 'var(--text-muted)',
            fontSize: 'var(--font-size-sm)',
            marginTop: 'var(--spacing-xs)'
          }}>
            {filiere.name}
          </p>
        </div>
        <div style={{
          background: 'var(--color-primary)',
          color: 'white',
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'bold'
        }}>
          {filiere.type === 'prepa' ? 'Prépa' : 'Filière'}
        </div>
      </div>

      {/* Années d'étude */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h4 style={{ 
          color: 'var(--text-color)', 
          marginBottom: 'var(--spacing-sm)',
          fontSize: 'var(--font-size-md)'
        }}>
          Années d'étude
        </h4>
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-sm)', 
          flexWrap: 'wrap' 
        }}>
          {(Array.isArray(filiere.years) ? filiere.years : []).map((year, yearIndex) => (
            <span
              key={yearIndex}
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-color)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                border: '1px solid var(--card-border)'
              }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>

      {/* Responsable */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <p style={{ margin: 0, color: 'var(--text-color)' }}>
          <strong>Responsable :</strong> {filiere.responsable}
        </p>
      </div>

      {/* Liens Documentation et Drive */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-md)', 
        flexWrap: 'wrap',
        marginBottom: 'var(--spacing-lg)'
      }}>
        {filiere.documentation && (
          <a
            href={filiere.documentation}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              fontSize: 'var(--font-size-md)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              color: '#DC2626',
              transition: 'opacity 0.3s ease',
              padding: 'var(--spacing-xs) 0'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            <img 
              src={`${process.env.PUBLIC_URL}/images/acrobat.png`} 
              alt="Adobe Acrobat" 
              width="18" 
              height="18"
              style={{ objectFit: 'contain' }}
            />
            Documentation
          </a>
        )}
        {/* Toujours afficher le bouton Drive */}
        <a
          href={filiere.drive || '#'}
          target={filiere.drive ? "_blank" : "_self"}
          rel="noopener noreferrer"
          style={{ 
            fontSize: 'var(--font-size-md)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            opacity: filiere.drive ? 1 : 0.5,
            cursor: filiere.drive ? 'pointer' : 'not-allowed',
            color: '#16A34A',
            transition: 'opacity 0.3s ease',
            padding: 'var(--spacing-xs) 0'
          }}
          onClick={!filiere.drive ? (e) => e.preventDefault() : undefined}
          onMouseEnter={(e) => {
            if (filiere.drive) e.target.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            if (filiere.drive) e.target.style.opacity = '1';
          }}
        >
          <img 
            src={`${process.env.PUBLIC_URL}/images/google-drive.png`} 
            alt="Google Drive" 
            width="18" 
            height="18"
            style={{ objectFit: 'contain' }}
          />
          Drive
        </a>
      </div>
      
      {/* Bouton "Voir détails" centré en bas */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginTop: 'auto' // Pousse le bouton vers le bas
      }}>
        <button
          onClick={() => openModal(filiere)}
          className="btn"
          style={{ 
            fontSize: 'var(--font-size-sm)',
            padding: 'var(--spacing-xs) var(--spacing-xl)',
            whiteSpace: 'nowrap'
          }}
        >
          Voir détails
        </button>
      </div>
    </div>
  );


  return (
    <div className={`page-container ${pageReady ? 'fade-in' : ''}`}>
      <div
        className="hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-about.png)` }}
      >
        <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
          <h1>
            <Typewriter 
              words={[
                "École Nationale des Sciences Appliquées de Fès",
                "ENSAF - Excellence en Ingénierie",
                "Votre Formation d'Ingénieur",
                "Innovation et Technologie"
              ]} 
              speed={60} 
              delayBetweenWords={2500} 
              cursor={true} 
              cursorChar="|"
              className="typewriter-hero"
            />
          </h1>
          <p>Découvrez nos filières d'ingénierie et classes préparatoires</p>
        </div>
      </div>

      <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
        {loading ? (
          <div className="loading fade-in">
            <div className="spinner"></div>
            Chargement des filières...
          </div>
        ) : (
          <>
            {/* Section d'information générale sur l'ENSA */}
            <div className="card-grid" style={{ marginBottom: 'var(--spacing-3xl)' }}>
              <div className={`card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.3s' }}>
                <h2 className="text-primary mt-0">Présentation de l'ENSAF</h2>
                <p>
                  L'École Nationale des Sciences Appliquées de Fès (ENSAF) est un établissement 
                  d'enseignement supérieur public marocain, créé en 1999. Elle fait partie du réseau 
                  des Écoles Nationales des Sciences Appliquées (ENSA) du Royaume du Maroc et relève 
                  de l'Université Sidi Mohamed Ben Abdellah.
                </p>
              </div>
              
              <div className={`card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.4s' }}>
                <h2 className="text-primary mt-0">Formation et Filières</h2>
                <p>
                  L'ENSAF propose des formations d'ingénieur dans plusieurs spécialités : Génie Informatique, 
                  Génie des Télécommunications et Réseaux, Génie Électrique et Systèmes Embarqués, 
                  Génie Industriel, Génie Mécanique et Systèmes Automatisés, et Génie des Matériaux et Procédés. 
                  Les formations allient théorie et pratique avec des stages en entreprise et des projets de fin d'études.
                </p>
              </div>
              
              <div className={`card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.5s' }}>
                <h2 className="text-primary mt-0">Recherche et Innovation</h2>
                <p>
                  L'école développe une recherche de qualité à travers ses laboratoires et équipes de recherche. 
                  Elle entretient des partenariats avec des universités internationales et des entreprises industrielles, 
                  favorisant l'innovation et le transfert de technologie.
                </p>
              </div>
              
              <div className={`card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.6s' }}>
                <h2 className="text-primary mt-0">Vie Étudiante</h2>
                <p>
                  L'ENSAF offre un environnement d'apprentissage stimulant avec des infrastructures modernes, 
                  des laboratoires équipés, une bibliothèque riche, et de nombreuses activités parascolaires. 
                  Les étudiants bénéficient d'un encadrement pédagogique de qualité et d'un accompagnement 
                  vers l'insertion professionnelle.
                </p>
              </div>
            </div>

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
                onClick={() => setActiveSection('filieres')}
                className={`tab-button ${activeSection === 'filieres' ? 'active' : ''}`}
                style={{
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                  border: activeSection === 'filieres' ? 'none' : '1px solid #d1d5db',
                  borderRadius: 'var(--radius-lg)',
                  background: activeSection === 'filieres' ? '#2563eb' : '#f9fafb',
                  color: activeSection === 'filieres' ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-md)',
                  boxShadow: activeSection === 'filieres' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'filieres') {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'filieres') {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
              >
                Filières d'Ingénierie ({filieres.length})
              </button>
              <button
                onClick={() => setActiveSection('prepa')}
                className={`tab-button ${activeSection === 'prepa' ? 'active' : ''}`}
                style={{
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                  border: activeSection === 'prepa' ? 'none' : '1px solid #d1d5db',
                  borderRadius: 'var(--radius-lg)',
                  background: activeSection === 'prepa' ? '#2563eb' : '#f9fafb',
                  color: activeSection === 'prepa' ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-md)',
                  boxShadow: activeSection === 'prepa' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'prepa') {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'prepa') {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
              >
                Classes Préparatoires ({classesPrepa.length})
              </button>
            </div>

            {/* Contenu des filières */}
            {activeSection === 'filieres' && (
              <div>
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: 'var(--spacing-xl)' 
                }}>
                  <h2 style={{ color: 'var(--color-primary)' }}>
                    Filières d'Ingénierie
                  </h2>
                  <p style={{ color: 'var(--text-muted)' }}>
                    Découvrez nos {filieres.length} filières d'excellence en ingénierie
                  </p>
                </div>
                
                {filieres.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: 'var(--spacing-xl)',
                    marginBottom: 'var(--spacing-3xl)'
                  }}>
                    {filieres.map((filiere, index) => renderFiliereCard(filiere, index))}
                  </div>
                ) : (
                  <div className="card text-center">
                    <h3>Aucune filière disponible</h3>
                    <p>Les filières apparaîtront ici dès qu'elles seront configurées.</p>
                  </div>
                )}
              </div>
            )}

            {/* Contenu des classes préparatoires */}
            {activeSection === 'prepa' && (
              <div>
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: 'var(--spacing-xl)' 
                }}>
                  <h2 style={{ color: 'var(--color-primary)' }}>
                    Classes Préparatoires Intégrées
                  </h2>
                  <p style={{ color: 'var(--text-muted)' }}>
                    Formation préparatoire aux études d'ingénieur
                  </p>
                </div>
                
                {classesPrepa.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: 'var(--spacing-xl)',
                    marginBottom: 'var(--spacing-3xl)'
                  }}>
                    {classesPrepa.map((classe, index) => renderFiliereCard(classe, index))}
                  </div>
                ) : (
                  <div className="card text-center">
                    <h3>Aucune classe préparatoire disponible</h3>
                    <p>Les classes préparatoires apparaîtront ici dès qu'elles seront configurées.</p>
                  </div>
                )}

                {/* Informations supplémentaires sur les classes prépa */}
                {classesPrepa.length > 0 && (
                  <div className="card" style={{ 
                    textAlign: 'center',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--card-border)'
                  }}>
                    <h3 style={{ color: 'var(--color-primary)' }}>
                      À propos des Classes Préparatoires
                    </h3>
                    <p>
                      Les Classes Préparatoires Intégrées (CPI) constituent un cycle de formation de 2 ans 
                      qui prépare les étudiants aux études d'ingénieur. Ce cycle couvre les matières 
                      fondamentales : mathématiques, physique, chimie, informatique et langues.
                    </p>
                    <p>
                      À l'issue de ce cycle, les étudiants accèdent directement au cycle ingénieur 
                      dans l'une des filières de l'ENSA Fès selon leurs choix et leurs résultats.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Section d'information générale */}
            <div className="card text-center highlight-card" style={{
              marginTop: 'var(--spacing-3xl)',
              background: 'linear-gradient(135deg, var(--color-primary), var(--primary-dark))',
              color: 'white',
              border: 'none'
            }}>
              <h2>Rejoignez l'ENSA Fès !</h2>
              <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xl)' }}>
                Découvrez nos formations d'excellence et intégrez une communauté d'ingénieurs
                passionnés par l'innovation et la technologie.
              </p>
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <a href="/clubs" style={{ 
                  background: 'white', 
                  color: '#DC2626',
                  border: 'none',
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-md)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}>
                  Découvrir les clubs
                </a>
                <a href="/events" style={{ 
                  background: 'white', 
                  color: '#DC2626',
                  border: 'none',
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-md)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}>
                  Voir les événements
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal des détails */}
      {showModal && selectedFiliere && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              background: 'var(--card-bg)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-3xl)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--card-border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: 'var(--spacing-xl)'
            }}>
              <div>
                <h2 style={{ 
                  color: 'var(--color-primary)', 
                  margin: 0,
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'bold'
                }}>
                  {selectedFiliere.abbreviation}
                </h2>
                <p style={{ 
                  margin: 0, 
                  color: 'var(--text-muted)',
                  fontSize: 'var(--font-size-lg)',
                  marginTop: 'var(--spacing-xs)'
                }}>
                  {selectedFiliere.name}
                </p>
              </div>
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

            {/* Type de formation */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <div style={{
                background: 'var(--color-primary)',
                color: 'white',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                {selectedFiliere.type === 'prepa' ? 'Classe Préparatoire' : 'Filière d\'Ingénierie'}
              </div>
            </div>

            {/* Description */}
            {selectedFiliere.description && (
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 style={{ color: 'var(--text-color)', marginBottom: 'var(--spacing-sm)' }}>Description</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {selectedFiliere.description}
                </p>
              </div>
            )}

            {/* Années d'étude */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3 style={{ color: 'var(--text-color)', marginBottom: 'var(--spacing-sm)' }}>Années d'étude</h3>
              <div style={{ 
                display: 'flex', 
                gap: 'var(--spacing-sm)', 
                flexWrap: 'wrap' 
              }}>
                {(Array.isArray(selectedFiliere.years) ? selectedFiliere.years : []).map((year, yearIndex) => (
                  <span
                    key={yearIndex}
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-color)',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--font-size-sm)',
                      border: '1px solid var(--card-border)',
                      fontWeight: '500'
                    }}
                  >
                    {year}
                  </span>
                ))}
              </div>
            </div>

            {/* Responsable */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3 style={{ color: 'var(--text-color)', marginBottom: 'var(--spacing-sm)' }}>Responsable</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                {selectedFiliere.responsable}
              </p>
            </div>

            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-md)', 
              flexWrap: 'wrap',
              paddingTop: 'var(--spacing-xl)',
              borderTop: '1px solid var(--card-border)'
            }}>
              {selectedFiliere.documentation && (
                <a
                  href={selectedFiliere.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    color: '#DC2626',
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  <img 
                    src={`${process.env.PUBLIC_URL}/images/acrobat.png`} 
                    alt="Adobe Acrobat" 
                    width="16" 
                    height="16"
                    style={{ objectFit: 'contain' }}
                  />
                  Documentation
                </a>
              )}
              <a
                href={selectedFiliere.drive || '#'}
                target={selectedFiliere.drive ? "_blank" : "_self"}
                rel="noopener noreferrer"
                style={{ 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  opacity: selectedFiliere.drive ? 1 : 0.5,
                  cursor: selectedFiliere.drive ? 'pointer' : 'not-allowed',
                  color: '#16A34A',
                  transition: 'opacity 0.3s ease'
                }}
                onClick={!selectedFiliere.drive ? (e) => e.preventDefault() : undefined}
                onMouseEnter={(e) => {
                  if (selectedFiliere.drive) e.target.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  if (selectedFiliere.drive) e.target.style.opacity = '1';
                }}
              >
                <img 
                  src={`${process.env.PUBLIC_URL}/images/google-drive.png`} 
                  alt="Google Drive" 
                  width="16" 
                  height="16"
                  style={{ objectFit: 'contain' }}
                />
                Google Drive
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ENSA;