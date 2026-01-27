import React, { useState, useEffect } from 'react';
import Typewriter from '../components/ui/Typewriter';
import { API_BASE_URL } from '../config/api';

const ENSA = () => {
  const [pageReady, setPageReady] = useState(false);
  const [activeSection, setActiveSection] = useState('cp1');
  const [contentTransition, setContentTransition] = useState(false);
  const [academicStructure, setAcademicStructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAcademicStructure();
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

  const fetchAcademicStructure = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/filieres`);
      const data = await response.json();
      
      // Transform the existing filières data into the expected structure
      const prepaData = data.find(f => f.type === 'prepa');
      const filieresData = data.filter(f => f.type === 'filiere');
      
      const transformedData = [
        {
          id: 1,
          name: 'Cycle Préparatoire',
          type: 'preparatoire',
          academicYears: [
            {
              id: 1,
              name: 'CP1',
              sections: [
                { 
                  id: 1, 
                  name: 'A', 
                  delegate_name: prepaData?.delegueA1 || 'À définir', 
                  delegate_phone: prepaData?.telDelegueA1 || '', 
                  delegate_email: '' 
                },
                { 
                  id: 2, 
                  name: 'B', 
                  delegate_name: prepaData?.delegueB1 || 'À définir', 
                  delegate_phone: prepaData?.telDelegueB1 || '', 
                  delegate_email: '' 
                },
                { 
                  id: 3, 
                  name: 'C', 
                  delegate_name: prepaData?.delegueC1 || 'À définir', 
                  delegate_phone: prepaData?.telDelegueC1 || '', 
                  delegate_email: '' 
                }
              ]
            },
            {
              id: 2,
              name: 'CP2',
              sections: [
                { 
                  id: 4, 
                  name: 'A', 
                  delegate_name: prepaData?.delegueA2 || 'À définir', 
                  delegate_phone: prepaData?.telDelegueA2 || '', 
                  delegate_email: '' 
                },
                { 
                  id: 5, 
                  name: 'B', 
                  delegate_name: prepaData?.delegueB2 || 'À définir', 
                  delegate_phone: prepaData?.telDelegueB2 || '', 
                  delegate_email: '' 
                },
                { 
                  id: 6, 
                  name: 'C', 
                  delegate_name: prepaData?.delegueC2 || 'À définir', 
                  delegate_phone: prepaData?.telDelegueC2 || '', 
                  delegate_email: '' 
                }
              ]
            }
          ],
          responsable_pedagogique: prepaData?.responsablePedagogique || 'À définir',
          responsable_contact: prepaData?.RespoContact || ''
        },
        {
          id: 2,
          name: 'Cycle d\'Ingénieur',
          type: 'ingenieur',
          filieres: filieresData.map(filiere => ({
            ...filiere,
            academicYears: filiere.years ? filiere.years.map((year, index) => ({
              id: `${filiere.id}-${index + 1}`,
              name: year,
              year_number: index + 1,
              delegate_name: filiere.delegueFiliere || 'À définir',
              delegate_phone: filiere.telDelegueFiliere || '',
              documentation: filiere.documentation,
              drive: filiere.drive
            })) : []
          }))
        }
      ];
      
      setAcademicStructure(transformedData);
    } catch (error) {
      console.error('Error fetching academic structure:', error);
      setAcademicStructure([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
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
    const cyclePreparatoire = academicStructure.find(cycle => cycle.type === 'preparatoire');
    const cycleIngenieur = academicStructure.find(cycle => cycle.type === 'ingenieur');

    if (activeSection === 'cp1') {
      // For CP1, get sections from CP1 academic year
      if (cyclePreparatoire && cyclePreparatoire.academicYears) {
        const cp1Year = cyclePreparatoire.academicYears.find(year => year.name === 'CP1');
        if (cp1Year && cp1Year.sections) {
          return cp1Year.sections.map(section => ({
            id: `cp1-${section.name}`,
            name: `Classes Préparatoires CP1 - Section ${section.name}`,
            abbreviation: `CP1 - Section ${section.name}`,
            displayName: `CP1 - Section ${section.name}`,
            responsablePedagogique: cyclePreparatoire.responsable_pedagogique || 'À définir',
            responsableContact: cyclePreparatoire.responsable_contact || '',
            delegue: section.delegate_name || 'À définir',
            telDelegue: section.delegate_phone || '',
            emailDelegue: section.delegate_email || '',
            section: section.name,
            level: 'CP1',
            type: 'prepa',
            description: 'Formation préparatoire aux études d\'ingénieur - 1ère année'
          }));
        }
      }
      return [];
    } else if (activeSection === 'cp2') {
      // For CP2, get sections from CP2 academic year
      if (cyclePreparatoire && cyclePreparatoire.academicYears) {
        const cp2Year = cyclePreparatoire.academicYears.find(year => year.name === 'CP2');
        if (cp2Year && cp2Year.sections) {
          return cp2Year.sections.map(section => ({
            id: `cp2-${section.name}`,
            name: `Classes Préparatoires CP2 - Section ${section.name}`,
            abbreviation: `CP2 - Section ${section.name}`,
            displayName: `CP2 - Section ${section.name}`,
            responsablePedagogique: cyclePreparatoire.responsable_pedagogique || 'À définir',
            responsableContact: cyclePreparatoire.responsable_contact || '',
            delegue: section.delegate_name || 'À définir',
            telDelegue: section.delegate_phone || '',
            emailDelegue: section.delegate_email || '',
            section: section.name,
            level: 'CP2',
            type: 'prepa',
            description: 'Formation préparatoire aux études d\'ingénieur - 2ème année'
          }));
        }
      }
      return [];
    } else {
      // For CI levels, show filières with level suffix
      const levelNumber = activeSection.replace('ci', '');
      const filteredFilieres = [];
      
      if (cycleIngenieur && cycleIngenieur.filieres) {
        cycleIngenieur.filieres.forEach(filiere => {
          // Find the academic year for this level
          const academicYear = filiere.academicYears?.find(year => 
            year.name === `${filiere.abbreviation}${levelNumber}`
          );
          
          if (academicYear) {
            filteredFilieres.push({
              id: `${filiere.id}-${activeSection.toUpperCase()}`,
              name: filiere.name,
              abbreviation: filiere.abbreviation,
              displayName: `${filiere.abbreviation} ${levelNumber}`,
              level: activeSection.toUpperCase(),
              responsable: filiere.responsable || 'À définir',
              responsableContact: filiere.RespoContact || '',
              delegue: academicYear.delegate_name || 'À définir',
              telDelegue: academicYear.delegate_phone || '',
              type: 'filiere',
              description: filiere.description || `Formation d'ingénieur en ${filiere.name}`,
              documentation: academicYear.documentation || filiere.documentation,
              drive: academicYear.drive || filiere.drive
            });
          }
        });
      }
      
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

  const renderCard = (item, index) => (
    <div
      key={item.id}
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
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0                   style={{ objectFit: 'contain' }}
                  />
                  Google Drive
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ENSA;: undefined}
                  onMouseEnter={(e) => {
                    if (selectedItem.drive) e.target.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedItem.drive) e.target.style.opacity = '1';
                  }}
                >
                  <img 
                    src={`${process.env.PUBLIC_URL}/images/google-drive.png`} 
                    alt="Google Drive" 
                    width="16" 
                    height="16"
 
                  style={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    opacity: selectedItem.drive ? 1 : 0.5,
                    cursor: selectedItem.drive ? 'pointer' : 'not-allowed',
                    color: '#16A34A',
                    transition: 'opacity 0.3s ease'
                  }}
                  onClick={!selectedItem.drive ? (e) => e.preventDefault()               src={`${process.env.PUBLIC_URL}/images/acrobat.png`} 
                      alt="Adobe Acrobat" 
                      width="16" 
                      height="16"
                      style={{ objectFit: 'contain' }}
                    />
                    Documentation
                  </a>
                )}
                <a
                  href={selectedItem.drive || '#'}
                  target={selectedItem.drive ? "_blank" : "_self"}
                  rel="noopener noreferrer"            style={{ 
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
        electedItem.type === 'filiere' && (
              <div style={{ 
                display: 'flex', 
                gap: 'var(--spacing-md)', 
                flexWrap: 'wrap',
                paddingTop: 'var(--spacing-xl)',
                borderTop: '1px solid var(--card-border)'
              }}>
                {selectedItem.documentation && (
                  <a
                    href={selectedItem.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
        22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Envoyer un email
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {s  e.target.style.opacity = '0.8';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9           display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-md) var(--spacing-lg)',
                        background: '#F0FDF4',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                      />
                      </svg>
                      Contacter: {selectedItem.telDelegue}
                    </a>
                  )}
                  {selectedItem.emailDelegue && (
                    <a 
                      href={`mailto:${selectedItem.emailDelegue}`}
                      style={{
                        color: '#16A34A',
                        textDecoration: 'none',
                        fontSize: 'var(--font-size-md)',
                        fontWeight: '600',
              
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08C5.16 2.08 5.52 4.04 6.2 5.88C6.36 6.24 6.24 6.68 5.92 6.96L4.4 8.48C6.44 12.44 9.56 15.56 13.52 17.6L15.04 16.08C15.32 15.76 15.76 15.64 16.12 15.8C17.96 16.48 19.92 16.84 21.92 16.84C22.52 16.84 23 17.32 23 17.92V20.92Z" fill="currentColor"all 0.3s ease',
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
                    >,
                        textDecoration: 'none',
                        fontSize: 'var(--font-size-md)',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-md) var(--spacing-lg)',
                        background: 'var(--primary-light)',
                        borderRadius: 'var(--radius-lg)',
                        transition: '>
                <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-md)' }}>
                  {selectedItem.delegue}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                  {selectedItem.telDelegue && (
                    <a 
                      href={`tel:${selectedItem.telDelegue}`}
                      style={{
                        color: 'var(--color-primary)'866 14 12 14Z" fill="#DC2626"/>
                    <path d="M15 2L17 4L21 0" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h4 style={{ 
                    color: '#DC2626', 
                    margin: 0,
                    fontSize: 'var(--font-size-lg)'
                  }}>
                    {selectedItem.section ? `Délégué Section ${selectedItem.section}` : 'Délégué Représentant'}
                  </h4>
                </divyle={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#DC2626"/>
                    <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15. 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
                    Commun à toutes les sections {selectedItem.level}
                  </p>
                )}
              </div>
              
              {/* Délégué étudiant */}
              <div style={{
                background: 'var(--bg-secondary)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--card-border)'
              }}>
                <div st}>
                  {selectedItem.responsablePedagogique || selectedItem.responsable}
                </p>
                {selectedItem.responsableContact && (
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
                    {selectedItem.responsableContact}
                  </p>
                )}
                {selectedItem.section && (
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize:H20V12H18V10H16V8H18V6H20V8Z" fill="var(--color-primary)"/>
                  </svg>
                  <h4 style={{ 
                    color: 'var(--color-primary)', 
                    margin: 0,
                    fontSize: 'var(--font-size-lg)'
                  }}>
                    {selectedItem.section ? 'Responsable Pédagogique' : 'Responsable de Filière'}
                  </h4>
                </div>
                <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-md)' }cing-sm)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="var(--color-primary)"/>
                    <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="var(--color-primary)"/>
                    <path d="M20 8H22V10 'de Filière'}
              </h3>
              
              {/* Responsable pédagogique */}
              <div style={{
                background: 'var(--bg-secondary)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--card-border)',
                marginBottom: 'var(--spacing-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spaottom: 'var(--spacing-sm)' }}>Description</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {selectedItem.description}
                </p>
              </div>
            )}

            {/* Encadrement détaillé */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3 style={{ color: 'var(--text-color)', marginBottom: 'var(--spacing-sm)' }}>
                Encadrement {selectedItem.section ? `Section ${selectedItem.section}` :  borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                {selectedItem.type === 'prepa' ? 'Classe Préparatoire' : 'Filière d\'Ingénierie'}
              </div>
            </div>

            {/* Description */}
            {selectedItem.description && (
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 style={{ color: 'var(--text-color)', marginB           cursor: 'pointer',
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
                      </h2>
                <p style={{ 
                  margin: 0, 
                  color: 'var(--text-muted)',
                  fontSize: 'var(--font-size-lg)',
                  marginTop: 'var(--spacing-xs)'
                }}>
                  {selectedItem.name}
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
       modal */}
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
                  {selectedItem.abbreviation}
        
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
            {/* Header du v>
          </>
        )}
      </div>

      {/* Modal des détails */}
      {showModal && selectedItem && (
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
        >1fr))',
                  gap: 'var(--spacing-xl)',
                  marginBottom: 'var(--spacing-3xl)'
                }}>
                  {getFilteredData().map((item, index) => renderCard(item, index))}
                </div>
              ) : (
                <div className="card text-center">
                  <h3>Aucune formation disponible</h3>
                  <p>Les formations pour ce niveau apparaîtront ici dès qu'elles seront configurées.</p>
                </div>
              )}
            </diutton>
              ))}
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
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== section) {
                      e.currentTarget.style.background = '#e5e7eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== section) {
                      e.currentTarget.style.background = '#f9fafb';
                    }
                  }}
                >
                  {section.toUpperCase()}
                </b' : '1px solid #d1d5db',
                    borderRadius: 'var(--radius-lg)',
                    background: activeSection === section ? '#2563eb' : '#f9fafb',
                    color: activeSection === section ? 'white' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    fontSize: 'var(--font-size-sm)',
                    boxShadow: activeSection === section ? '0 4px 12px rgba(37, 99, 235, 0.3)' w: '0 4px 20px rgba(0, 0, 0, 0.1)',
              flexWrap: 'wrap'
            }}>
              {['cp1', 'cp2', 'ci1', 'ci2', 'ci3'].map(section => (
                <button
                  key={section}
                  onClick={() => handleSectionChange(section)}
                  className={`tab-button ${activeSection === section ? 'active' : ''}`}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                    border: activeSection === section ? 'nones des employeurs.
                </p>
              </div>
            )}

            {/* Onglets de navigation */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: 'var(--spacing-xl)',
              gap: 'var(--spacing-sm)',
              background: 'var(--card-bg)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--card-border)',
              boxShadohaque filière propose un cursus adapté aux 
                  besoins du marché du travail et aux évolutions technologiques.
                </p>
                <p>
                  <strong>Débouchés :</strong> Nos diplômés intègrent les secteurs de l'industrie, 
                  des services, de la recherche et développement, ou poursuivent leurs études 
                  en doctorat. Le diplôme d'ingénieur ENSA est reconnu par l'État marocain 
                  et bénéficie d'une excellente réputation auprè      </h3>
                <p>
                  Le Cycle Ingénieur de l'ENSA Fès s'étend sur 3 années et forme des ingénieurs 
                  d'état dans diverses spécialités. Ce cycle allie formation théorique approfondie, 
                  travaux pratiques en laboratoire, projets industriels et stages en entreprise.
                </p>
                <p>
                  Les étudiants choisissent leur filière de spécialisation selon leurs aptitudes 
                  et leurs projets professionnels. C   </p>
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
                <p>
                  À l'issue de ce cycle, les étudiants accèdent directement au cycle ingénieur 
                  dans l'une des filières de l'ENSA Fès selon leurs choix et leurs résultats.
                </p>
                <p>
                  <strong>Organisation :</strong> Les classes préparatoires sont organisées en sections 
                  (A, B, C pour chaque année), chacune encadrée par un responsable pédagogique commun 
                  et représentée par un délégué étudiant.
             acing-xl)'
              }}>
                <h3 style={{ color: 'var(--color-primary)' }}>
                  À propos des Classes Préparatoires
                </h3>
                <p>
                  Les Classes Préparatoires Intégrées (CPI) constituent un cycle de formation de 2 ans 
                  qui prépare les étudiants aux études d'ingénieur. Ce cycle couvre les matières 
                  fondamentales : mathématiques, physique, chimie, informatique et langues.
                </p>
          
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                {getSectionDescription()}
              </p>
            </div>

            {/* Section d'information selon le type */}
            {(activeSection === 'cp1' || activeSection === 'cp2') && (
              <div className="card" style={{ 
                textAlign: 'center',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--card-border)',
                marginBottom: 'var(--spbreuses activités parascolaires. 
                  Les étudiants bénéficient d'un encadrement pédagogique de qualité et d'un accompagnement 
                  vers l'insertion professionnelle.
                </p>
              </div>
            </div>

            {/* Section Title */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: 'var(--spacing-xl)' 
            }}>
              <h2 style={{ color: 'var(--color-primary)' }}>
                {getSectionTitle()}ielles, 
                  favorisant l'innovation et le transfert de technologie.
                </p>
              </div>
              
              <div className={`card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.6s' }}>
                <h2 className="text-primary mt-0">Vie Étudiante</h2>
                <p>
                  L'ENSAF offre un environnement d'apprentissage stimulant avec des infrastructures modernes, 
                  des laboratoires équipés, une bibliothèque riche, et de nomrojets de fin d'études.
                </p>
              </div>
              
              <div className={`card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.5s' }}>
                <h2 className="text-primary mt-0">Recherche et Innovation</h2>
                <p>
                  L'école développe une recherche de qualité à travers ses laboratoires et équipes de recherche. 
                  Elle entretient des partenariats avec des universités internationales et des entreprises industr           <h2 className="text-primary mt-0">Formation et Filières</h2>
                <p>
                  L'ENSAF propose des formations d'ingénieur dans plusieurs spécialités : Génie Informatique, 
                  Génie des Télécommunications et Réseaux, Génie Électrique et Systèmes Embarqués, 
                  Génie Industriel, Génie Mécanique et Systèmes Automatisés, et Génie des Matériaux et Procédés. 
                  Les formations allient théorie et pratique avec des stages en entreprise et des p    L'École Nationale des Sciences Appliquées de Fès (ENSAF) est un établissement 
                  d'enseignement supérieur public marocain, créé en 1999. Elle fait partie du réseau 
                  des Écoles Nationales des Sciences Appliquées (ENSA) du Royaume du Maroc et relève 
                  de l'Université Sidi Mohamed Ben Abdellah.
                </p>
              </div>
              
              <div className={`card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.4s' }}>
     Name="loading fade-in">
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
              Ingénieur",
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
          <div classiv>
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
                "Votre Formation d'      </a>
        </div>
      )}
      
      {/* Bouton "Voir détails" */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginTop: 'auto'
      }}>
        <button
          onClick={() => openModal(item)}
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
    </default() : undefined}
            onMouseEnter={(e) => {
              if (item.drive) e.target.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              if (item.drive) e.target.style.opacity = '1';
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
    eferrer"
            style={{ 
              fontSize: 'var(--font-size-md)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              opacity: item.drive ? 1 : 0.5,
              cursor: item.drive ? 'pointer' : 'not-allowed',
              color: '#16A34A',
              transition: 'opacity 0.3s ease',
              padding: 'var(--spacing-xs) 0'
            }}
            onClick={!item.drive ? (e) => e.preventD          onMouseLeave={(e) => e.target.style.opacity = '1'}
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
          <a
            href={item.drive || '#'}
            target={item.drive ? "_blank" : "_self"}
            rel="noopener norn}
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
    "round" strokeLinejoin="round"/>
                </svg>
                Email
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Liens Documentation et Drive (pour les filières) */}
      {item.type === 'filiere' && (
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-md)', 
          flexWrap: 'wrap',
          marginBottom: 'var(--spacing-lg)'
        }}>
          {item.documentation && (
            <a
              href={item.documentatioacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap=extDecoration: 'none',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: '600',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  background: '#F0FDF4',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}
                onMouseEnter={(e) => e.target.style.op16 2.08 5.52 4.04 6.2 5.88C6.36 6.24 6.24 6.68 5.92 6.96L4.4 8.48C6.44 12.44 9.56 15.56 13.52 17.6L15.04 16.08C15.32 15.76 15.76 15.64 16.12 15.8C17.96 16.48 19.92 16.84 21.92 16.84C22.52 16.84 23 17.32 23 17.92V20.92Z" fill="currentColor"/>
                </svg>
                {item.telDelegue}
              </a>
            )}
            {item.emailDelegue && (
              <a 
                href={`mailto:${item.emailDelegue}`}
                style={{
                  color: '#16A34A',
                  t                alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08C5.             href={`tel:${item.telDelegue}`}
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
  ng style={{ color: '#DC2626', fontSize: 'var(--font-size-sm)' }}>
              {item.section ? `Délégué Section ${item.section}` : 'Délégué Représentant'}
            </strong>
          </div>
          <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
            {item.delegue}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
            {item.telDelegue && (
              <a 
   fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#DC2626"/>
              <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="#DC2626"/>
              <path d="M15 2L17 4L21 0" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <stro      {item.responsableContact}
            </p>
          )}
        </div>
        
        {/* Délégué étudiant */}
        <div style={{ 
          padding: 'var(--spacing-sm)',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--card-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" y)', fontSize: 'var(--font-size-sm)' }}>
              {item.section ? 'Responsable Pédagogique' : 'Responsable de Filière'}
            </strong>
          </div>
          <p style={{ margin: 0, color: 'var(--text-color)', fontSize: 'var(--font-size-sm)' }}>
            {item.responsablePedagogique || item.responsable}
          </p>
          {(item.responsableContact) && (
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-xs)' }}>
        g/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="var(--color-primary)"/>
              <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="var(--color-primary)"/>
              <path d="M20 8H22V10H20V12H18V10H16V8H18V6H20V8Z" fill="var(--color-primary)"/>
            </svg>
            <strong style={{ color: 'var(--color-primar{/* Responsable pédagogique */}
        <div style={{ 
          padding: 'var(--spacing-sm)',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--card-border)',
          marginBottom: 'var(--spacing-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.or       fontWeight: 'bold'
        }}>
          {item.section ? `Section ${item.section}` : 
           item.level ? item.level :
           item.type === 'prepa' ? 'Prépa' : 'Filière'}
        </div>
      </div>

      {/* Encadrement */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h4 style={{ 
          color: 'var(--text-color)', 
          marginBottom: 'var(--spacing-sm)',
          fontSize: 'var(--font-size-md)'
        }}>
          Encadrement
        </h4>
        
        em.abbreviation}
          </h3>
          <p style={{ 
            margin: 0, 
            color: 'var(--text-muted)',
            fontSize: 'var(--font-size-sm)',
            marginTop: 'var(--spacing-xs)'
          }}>
            {item.name}
          </p>
        </div>
        <div style={{
          background: 'var(--color-primary)',
          color: 'white',
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--font-size-sm)',
   )';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Header */}
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
            {item.displayName || it