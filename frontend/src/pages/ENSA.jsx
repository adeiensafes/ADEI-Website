import React, { useState, useEffect } from 'react';
import Typewriter from '../components/ui/Typewriter';
import { API_ENDPOINTS } from '../config/api';

const ENSA = () => {
  const [pageReady, setPageReady] = useState(false);
  const [activeSection, setActiveSection] = useState('cp1');
  const [contentTransition, setContentTransition] = useState(false);
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

  // Handle section change with transition
  const handleSectionChange = (newSection) => {
    if (newSection !== activeSection) {
      setContentTransition(true);
      setTimeout(() => {
        setActiveSection(newSection);
        setContentTransition(false);
      }, 150);
    }
  };

  // Function to get filtered data based on active section
  const getFilteredData = () => {
    if (activeSection === 'cp1') {
      // For CP1, create 3 separate sections (A1, B1, C1)
      const cp1Data = classesPrepa.filter(item => item.type === 'prepa');
      if (cp1Data.length > 0) {
        const baseData = cp1Data[0];
        return [
          {
            ...baseData,
            id: `${baseData.id}-A1`,
            name: `Classes Préparatoires CP1 - Section A1`,
            abbreviation: `CP1 - Section A1`,
            responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
            delegue: baseData.delegueA1 || 'Étudiant Délégué A1',
            telDelegue: baseData.telDelegueA1 || '',
            section: 'A1',
            level: 'CP1'
          },
          {
            ...baseData,
            id: `${baseData.id}-B1`,
            name: `Classes Préparatoires CP1 - Section B1`,
            abbreviation: `CP1 - Section B1`,
            responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
            delegue: baseData.delegueB1 || 'Étudiant Délégué B1',
            telDelegue: baseData.telDelegueB1 || '',
            section: 'B1',
            level: 'CP1'
          },
          {
            ...baseData,
            id: `${baseData.id}-C1`,
            name: `Classes Préparatoires CP1 - Section C1`,
            abbreviation: `CP1 - Section C1`,
            responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
            delegue: baseData.delegueC1 || 'Étudiant Délégué C1',
            telDelegue: baseData.telDelegueC1 || '',
            section: 'C1',
            level: 'CP1'
          }
        ];
      }
      return [];
    } else if (activeSection === 'cp2') {
      // For CP2, create 3 separate sections (A2, B2, C2)
      const cp2Data = classesPrepa.filter(item => item.type === 'prepa');
      if (cp2Data.length > 0) {
        const baseData = cp2Data[0];
        return [
          {
            ...baseData,
            id: `${baseData.id}-A2`,
            name: `Classes Préparatoires CP2 - Section A2`,
            abbreviation: `CP2 - Section A2`,
            responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
            delegue: baseData.delegueA2 || 'Étudiant Délégué A2',
            telDelegue: baseData.telDelegueA2 || '',
            section: 'A2',
            level: 'CP2'
          },
          {
            ...baseData,
            id: `${baseData.id}-B2`,
            name: `Classes Préparatoires CP2 - Section B2`,
            abbreviation: `CP2 - Section B2`,
            responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
            delegue: baseData.delegueB2 || 'Étudiant Délégué B2',
            telDelegue: baseData.telDelegueB2 || '',
            section: 'B2',
            level: 'CP2'
          },
          {
            ...baseData,
            id: `${baseData.id}-C2`,
            name: `Classes Préparatoires CP2 - Section C2`,
            abbreviation: `CP2 - Section C2`,
            responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
            delegue: baseData.delegueC2 || 'Étudiant Délégué C2',
            telDelegue: baseData.telDelegueC2 || '',
            section: 'C2',
            level: 'CP2'
          }
        ];
      }
      return [];
    } else {
      // For CI levels, show filières with level suffix
      const levelNumber = activeSection.replace('ci', '');
      const filteredFilieres = [];
      
      filieres.forEach(filiere => {
        if (filiere.type === 'filiere') {
          filteredFilieres.push({
            ...filiere,
            id: `${filiere.id}-${activeSection.toUpperCase()}`,
            name: `${filiere.name}`,
            abbreviation: `${filiere.abbreviation}${levelNumber}`,
            displayName: `${filiere.abbreviation} ${levelNumber}`,
            level: activeSection.toUpperCase(),
            delegue: filiere.delegueFiliere || 'Étudiant Délégué',
            telDelegue: filiere.telDelegueFiliere || ''
          });
        }
      });
      
      return filteredFilieres;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'cp1':
        return 'Classes Préparatoires - 1ère année';
      case 'cp2':
        return 'Classes Préparatoires - 2ème année';
      case 'ci1':
        return 'Cycle Ingénieur - 1ère année';
      case 'ci2':
        return 'Cycle Ingénieur - 2ème année';
      case 'ci3':
        return 'Cycle Ingénieur - 3ème année';
      default:
        return 'Formation';
    }
  };

  const getSectionDescription = () => {
    if (activeSection === 'cp1' || activeSection === 'cp2') {
      return 'Formation préparatoire aux études d\'ingénieur';
    } else {
      return 'Filières d\'excellence en ingénierie';
    }
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
            {filiere.displayName || filiere.abbreviation}
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
          {filiere.section ? `Section ${filiere.section}` : 
           filiere.level ? filiere.level :
           filiere.type === 'prepa' ? 'Prépa' : 'Filière'}
        </div>
      </div>

      {/* Responsables et Délégués */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        {filiere.section ? (
          // Pour les sections CP1/CP2 - Responsable pédagogique commun + délégué de section
          <div>
            <h4 style={{ 
              color: 'var(--text-color)', 
              marginBottom: 'var(--spacing-sm)',
              fontSize: 'var(--font-size-md)'
            }}>
              Encadrement
            </h4>
            
            {/* Responsable pédagogique */}
            <div style={{ 
              padding: 'var(--spacing-sm)',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="var(--color-primary)"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="var(--color-primary)"/>
                  <path d="M20 8H22V10H20V12H18V10H16V8H18V6H20V8Z" fill="var(--color-primary)"/>
                </svg>
                <strong style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)' }}>
                  Responsable Pédagogique
                </strong>
              </div>
              <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-sm)' }}>
                {filiere.responsablePedagogique}
              </p>
            </div>
            
            {/* Délégué étudiant de section */}
            <div style={{ 
              padding: 'var(--spacing-sm)',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#DC2626"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="#DC2626"/>
                  <path d="M15 2L17 4L21 0" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <strong style={{ color: '#DC2626', fontSize: 'var(--font-size-sm)' }}>
                  Délégué Section {filiere.section}
                </strong>
              </div>
              <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                {filiere.delegue}
              </p>
              {filiere.telDelegue && (
                <a 
                  href={`tel:${filiere.telDelegue}`}
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: '600',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    background: 'var(--primary-light)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08C5.16 2.08 5.52 4.04 6.2 5.88C6.36 6.24 6.24 6.68 5.92 6.96L4.4 8.48C6.44 12.44 9.56 15.56 13.52 17.6L15.04 16.08C15.32 15.76 15.76 15.64 16.12 15.8C17.96 16.48 19.92 16.84 21.92 16.84C22.52 16.84 23 17.32 23 17.92V20.92Z" fill="currentColor"/>
                  </svg>
                  {filiere.telDelegue}
                </a>
              )}
            </div>
          </div>
        ) : (
          // Pour les filières - Responsable + délégué représentant
          <div>
            <h4 style={{ 
              color: 'var(--text-color)', 
              marginBottom: 'var(--spacing-sm)',
              fontSize: 'var(--font-size-md)'
            }}>
              Encadrement
            </h4>
            
            {/* Responsable de filière */}
            <div style={{ 
              padding: 'var(--spacing-sm)',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="var(--color-primary)"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="var(--color-primary)"/>
                  <path d="M20 8H22V10H20V12H18V10H16V8H18V6H20V8Z" fill="var(--color-primary)"/>
                </svg>
                <strong style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)' }}>
                  Responsable de Filière (3 ans)
                </strong>
              </div>
              <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-sm)' }}>
                {filiere.responsable || 'Prof. Responsable'}
              </p>
            </div>
            
            {/* Délégué représentant */}
            <div style={{ 
              padding: 'var(--spacing-sm)',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#16A34A"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="#16A34A"/>
                  <path d="M15 2L17 4L21 0" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <strong style={{ color: '#16A34A', fontSize: 'var(--font-size-sm)' }}>
                  Délégué Représentant
                </strong>
              </div>
              <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                {filiere.delegue}
              </p>
              {filiere.telDelegue && (
                <a 
                  href={`tel:${filiere.telDelegue}`}
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: '600',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    background: 'var(--primary-light)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08C5.16 2.08 5.52 4.04 6.2 5.88C6.36 6.24 6.24 6.68 5.92 6.96L4.4 8.48C6.44 12.44 9.56 15.56 13.52 17.6L15.04 16.08C15.32 15.76 15.76 15.64 16.12 15.8C17.96 16.48 19.92 16.84 21.92 16.84C22.52 16.84 23 17.32 23 17.92V20.92Z" fill="currentColor"/>
                  </svg>
                  {filiere.telDelegue}
                </a>
              )}
            </div>
          </div>
        )}
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

            {/* Section Title - MOVED TO TOP */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: 'var(--spacing-xl)' 
            }}>
              <h2 style={{ color: 'var(--color-primary)' }}>
                {getSectionTitle()}
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                {getSectionDescription()}
              </p>
            </div>

            {/* Section d'information selon le type - MOVED ABOVE TABS */}
            {(activeSection === 'cp1' || activeSection === 'cp2') && (
              <div className="card" style={{ 
                textAlign: 'center',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--card-border)',
                marginBottom: 'var(--spacing-xl)'
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
                <p>
                  <strong>Organisation :</strong> Les classes préparatoires sont organisées en sections 
                  (A1, B1, C1 pour la première année et A2, B2, C2 pour la deuxième année), 
                  chacune encadrée par un responsable pédagogique dédié.
                </p>
              </div>
            )}

            {(activeSection === 'ci1' || activeSection === 'ci2' || activeSection === 'ci3') && (
              <div className="card" style={{ 
                textAlign: 'center',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--card-border)',
                marginBottom: 'var(--spacing-xl)'
              }}>
                <h3 style={{ color: 'var(--color-primary)' }}>
                  À propos du Cycle Ingénieur
                </h3>
                <p>
                  Le Cycle Ingénieur de l'ENSA Fès s'étend sur 3 années et forme des ingénieurs 
                  d'état dans diverses spécialités. Ce cycle allie formation théorique approfondie, 
                  travaux pratiques en laboratoire, projets industriels et stages en entreprise.
                </p>
                <p>
                  Les étudiants choisissent leur filière de spécialisation selon leurs aptitudes 
                  et leurs projets professionnels. Chaque filière propose un cursus adapté aux 
                  besoins du marché du travail et aux évolutions technologiques.
                </p>
                <p>
                  <strong>Débouchés :</strong> Nos diplômés intègrent les secteurs de l'industrie, 
                  des services, de la recherche et développement, ou poursuivent leurs études 
                  en doctorat. Le diplôme d'ingénieur ENSA est reconnu par l'État marocain 
                  et bénéficie d'une excellente réputation auprès des employeurs.
                </p>
              </div>
            )}

            {/* Onglets de navigation - MOVED BELOW INTRODUCTION */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: 'var(--spacing-xl)',
              gap: 'var(--spacing-sm)',
              background: 'var(--card-bg)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--card-border)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => handleSectionChange('cp1')}
                className={`tab-button ${activeSection === 'cp1' ? 'active' : ''}`}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  border: activeSection === 'cp1' ? 'none' : '1px solid #d1d5db',
                  borderRadius: 'var(--radius-lg)',
                  background: activeSection === 'cp1' ? '#2563eb' : '#f9fafb',
                  color: activeSection === 'cp1' ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-sm)',
                  boxShadow: activeSection === 'cp1' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'cp1') {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'cp1') {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
              >
                CP1
              </button>
              <button
                onClick={() => handleSectionChange('cp2')}
                className={`tab-button ${activeSection === 'cp2' ? 'active' : ''}`}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  border: activeSection === 'cp2' ? 'none' : '1px solid #d1d5db',
                  borderRadius: 'var(--radius-lg)',
                  background: activeSection === 'cp2' ? '#2563eb' : '#f9fafb',
                  color: activeSection === 'cp2' ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-sm)',
                  boxShadow: activeSection === 'cp2' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'cp2') {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'cp2') {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
              >
                CP2
              </button>
              <button
                onClick={() => handleSectionChange('ci1')}
                className={`tab-button ${activeSection === 'ci1' ? 'active' : ''}`}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  border: activeSection === 'ci1' ? 'none' : '1px solid #d1d5db',
                  borderRadius: 'var(--radius-lg)',
                  background: activeSection === 'ci1' ? '#2563eb' : '#f9fafb',
                  color: activeSection === 'ci1' ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-sm)',
                  boxShadow: activeSection === 'ci1' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'ci1') {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'ci1') {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
              >
                CI1
              </button>
              <button
                onClick={() => handleSectionChange('ci2')}
                className={`tab-button ${activeSection === 'ci2' ? 'active' : ''}`}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  border: activeSection === 'ci2' ? 'none' : '1px solid #d1d5db',
                  borderRadius: 'var(--radius-lg)',
                  background: activeSection === 'ci2' ? '#2563eb' : '#f9fafb',
                  color: activeSection === 'ci2' ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-sm)',
                  boxShadow: activeSection === 'ci2' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'ci2') {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'ci2') {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
              >
                CI2
              </button>
              <button
                onClick={() => handleSectionChange('ci3')}
                className={`tab-button ${activeSection === 'ci3' ? 'active' : ''}`}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  border: activeSection === 'ci3' ? 'none' : '1px solid #d1d5db',
                  borderRadius: 'var(--radius-lg)',
                  background: activeSection === 'ci3' ? '#2563eb' : '#f9fafb',
                  color: activeSection === 'ci3' ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-sm)',
                  boxShadow: activeSection === 'ci3' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'ci3') {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'ci3') {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
              >
                CI3
              </button>
            </div>

            {/* Contenu filtré par niveau */}
            <div style={{
              opacity: contentTransition ? 0 : 1,
              transform: contentTransition ? 'translateY(20px)' : 'translateY(0)',
              transition: 'all 0.3s ease-in-out'
            }}>
              
              {getFilteredData().length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: 'var(--spacing-xl)',
                  marginBottom: 'var(--spacing-3xl)'
                }}>
                  {getFilteredData().map((filiere, index) => renderFiliereCard(filiere, index))}
                </div>
              ) : (
                <div className="card text-center">
                  <h3>Aucune formation disponible</h3>
                  <p>Les formations pour ce niveau apparaîtront ici dès qu'elles seront configurées.</p>
                </div>
              )}
            </div>

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

            {/* Encadrement */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              {selectedFiliere.section ? (
                // Pour les sections CP1/CP2
                <div>
                  <h3 style={{ color: 'var(--text-color)', marginBottom: 'var(--spacing-sm)' }}>
                    Encadrement Section {selectedFiliere.section}
                  </h3>
                  
                  {/* Responsable pédagogique */}
                  <div style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--card-border)',
                    marginBottom: 'var(--spacing-md)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="var(--color-primary)"/>
                        <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="var(--color-primary)"/>
                        <path d="M20 8H22V10H20V12H18V10H16V8H18V6H20V8Z" fill="var(--color-primary)"/>
                      </svg>
                      <h4 style={{ 
                        color: 'var(--color-primary)', 
                        margin: 0,
                        fontSize: 'var(--font-size-lg)'
                      }}>
                        Responsable Pédagogique
                      </h4>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-md)' }}>
                      {selectedFiliere.responsablePedagogique}
                    </p>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
                      Commun à toutes les sections CP1 et CP2
                    </p>
                  </div>
                  
                  {/* Délégué étudiant */}
                  <div style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--card-border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#DC2626"/>
                        <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="#DC2626"/>
                        <path d="M15 2L17 4L21 0" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h4 style={{ 
                        color: '#DC2626', 
                        margin: 0,
                        fontSize: 'var(--font-size-lg)'
                      }}>
                        Délégué Section {selectedFiliere.section}
                      </h4>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-md)' }}>
                      {selectedFiliere.delegue}
                    </p>
                    {selectedFiliere.telDelegue && (
                      <a 
                        href={`tel:${selectedFiliere.telDelegue}`}
                        style={{
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          fontSize: 'var(--font-size-md)',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)',
                          padding: 'var(--spacing-md) var(--spacing-lg)',
                          background: 'var(--primary-light)',
                          borderRadius: 'var(--radius-lg)',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.opacity = '0.8';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.opacity = '1';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08C5.16 2.08 5.52 4.04 6.2 5.88C6.36 6.24 6.24 6.68 5.92 6.96L4.4 8.48C6.44 12.44 9.56 15.56 13.52 17.6L15.04 16.08C15.32 15.76 15.76 15.64 16.12 15.8C17.96 16.48 19.92 16.84 21.92 16.84C22.52 16.84 23 17.32 23 17.92V20.92Z" fill="currentColor"/>
                        </svg>
                        Contacter: {selectedFiliere.telDelegue}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                // Pour les filières
                <div>
                  <h3 style={{ color: 'var(--text-color)', marginBottom: 'var(--spacing-sm)' }}>Encadrement de Filière</h3>
                  
                  {/* Responsable de filière */}
                  <div style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--card-border)',
                    marginBottom: 'var(--spacing-md)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="var(--color-primary)"/>
                        <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="var(--color-primary)"/>
                        <path d="M20 8H22V10H20V12H18V10H16V8H18V6H20V8Z" fill="var(--color-primary)"/>
                      </svg>
                      <h4 style={{ 
                        color: 'var(--color-primary)', 
                        margin: 0,
                        fontSize: 'var(--font-size-lg)'
                      }}>
                        Responsable de Filière
                      </h4>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-md)' }}>
                      {selectedFiliere.responsable || 'Prof. Responsable'}
                    </p>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
                      Responsable pour les 3 années du cycle ingénieur
                    </p>
                  </div>
                  
                  {/* Délégué représentant */}
                  <div style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--card-border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#16A34A"/>
                        <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="#16A34A"/>
                        <path d="M15 2L17 4L21 0" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h4 style={{ 
                        color: '#16A34A', 
                        margin: 0,
                        fontSize: 'var(--font-size-lg)'
                      }}>
                        Délégué Représentant
                      </h4>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-md)' }}>
                      {selectedFiliere.delegue}
                    </p>
                    {selectedFiliere.telDelegue && (
                      <a 
                        href={`tel:${selectedFiliere.telDelegue}`}
                        style={{
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          fontSize: 'var(--font-size-md)',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)',
                          padding: 'var(--spacing-md) var(--spacing-lg)',
                          background: 'var(--primary-light)',
                          borderRadius: 'var(--radius-lg)',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.opacity = '0.8';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.opacity = '1';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08C5.16 2.08 5.52 4.04 6.2 5.88C6.36 6.24 6.24 6.68 5.92 6.96L4.4 8.48C6.44 12.44 9.56 15.56 13.52 17.6L15.04 16.08C15.32 15.76 15.76 15.64 16.12 15.8C17.96 16.48 19.92 16.84 21.92 16.84C22.52 16.84 23 17.32 23 17.92V20.92Z" fill="currentColor"/>
                        </svg>
                        Contacter: {selectedFiliere.telDelegue}
                      </a>
                    )}
                  </div>
                </div>
              )}
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