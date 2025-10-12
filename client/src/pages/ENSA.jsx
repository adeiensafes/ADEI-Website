import React, { useState, useEffect } from 'react';

const ENSA = () => {
  const [pageReady, setPageReady] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [content] = useState({
    title: "École Nationale des Sciences Appliquées de Fès",
    subtitle: "Excellence académique et innovation technologique au cœur du Maroc",
    sections: [
      {
        title: "Présentation de l'ENSAF",
        content: "L'École Nationale des Sciences Appliquées de Fès (ENSAF) est un établissement d'enseignement supérieur public marocain, créé en 1999. Elle fait partie du réseau des Écoles Nationales des Sciences Appliquées (ENSA) du Royaume du Maroc et relève de l'Université Sidi Mohamed Ben Abdellah."
      },
      {
        title: "Formation et Filières",
        content: "L'ENSAF propose des formations d'ingénieur dans plusieurs spécialités : Génie Informatique, Génie des Télécommunications et Réseaux, Génie Électrique et Systèmes Embarqués, Génie Industriel, Génie Mécanique et Systèmes Automatisés, et Génie des Matériaux et Procédés. Les formations allient théorie et pratique avec des stages en entreprise et des projets de fin d'études."
      },
      {
        title: "Recherche et Innovation",
        content: "L'école développe une recherche de qualité à travers ses laboratoires et équipes de recherche. Elle entretient des partenariats avec des universités internationales et des entreprises industrielles, favorisant l'innovation et le transfert de technologie."
      },
      {
        title: "Vie Étudiante",
        content: "L'ENSAF offre un environnement d'apprentissage stimulant avec des infrastructures modernes, des laboratoires équipés, une bibliothèque riche, et de nombreuses activités parascolaires. Les étudiants bénéficient d'un encadrement pédagogique de qualité et d'un accompagnement vers l'insertion professionnelle."
      }
    ]
  });

  const filieres = [
    { name: 'Ingénierie des Systèmes Communicants et Sécurité Informatique (ISCSI)', link: 'https://docs.ensaf.ac.ma/home/fil/ISCSN.pdf' },
    { name: 'Ingénierie Informatique, Intelligence Artificielle et Confiance Numérique (3IACN)', link: 'https://docs.ensaf.ac.ma/home/fil/3IACN.pdf' },
    { name: 'Ingénierie des Systèmes Embarqués et Intelligence Artificielle (ISEIA)', link: 'https://docs.ensaf.ac.ma/home/fil/ISEIA.pdf' },
    { name: 'Ingénierie Logicielle et Intelligence Artificielle (ILIA)', link: 'https://docs.ensaf.ac.ma/home/fil/ILIAV2.pdf' },
    { name: 'Génie du développement numérique et Cybersécurité (GDNC)', link: 'https://docs.ensaf.ac.ma/home/fil/DNC.pdf' },
    { name: 'Ingénierie en Science de Données et Intelligence Artificielle (ISDIA)', link: 'https://docs.ensaf.ac.ma/home/fil/ISDIAV3.pdf' },
    { name: 'Génie Informatique', link: 'https://docs.ensaf.ac.ma/home/fil/INFO.pdf' },
    { name: 'Génie Mécanique', link: 'https://docs.ensaf.ac.ma/home/fil/GM.pdf' },
    { name: 'Génie Energétique et systèmes intelligents (GESI)', link: 'https://docs.ensaf.ac.ma/home/fil/GESI.pdf' },
    { name: 'Génie Mécatronique', link: 'https://docs.ensaf.ac.ma/home/fil/GMT.pdf' },
    { name: 'Génie Industriel', link: 'https://docs.ensaf.ac.ma/home/fil/gind.pdf' }
  ];


  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.floating-button-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);


  return (
    <div className={`page-container ${pageReady ? 'fade-in' : ''}`}>
      <>
        <div
          className="hero"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-about.png)` }}
        >
          <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
            <h1>{content.title}</h1>
            <p>{content.subtitle}</p>
          </div>
        </div>

        <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
          <div className="card-grid">
            {content.sections.map((section, index) => (
              <div key={index} className={`card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: pageReady ? `${0.4 + index * 0.1}s` : '0s' }}>
                <h2 className="text-primary mt-0">{section.title}</h2>
                <p>{section.content}</p>
              </div>
            ))}
          </div>

          <div className={`card text-center highlight-card ${pageReady ? 'zoom-in' : ''}`} style={{
            marginTop: 'var(--spacing-3xl)',
            animationDelay: '0.6s'
          }}>
            <h2 className="text-primary">Rejoignez l'ENSAF !</h2>
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
              <a href="/clubs" className="btn">
                Découvrir les clubs
              </a>
              <a href="/events" className="btn secondary">
                Voir les événements
              </a>
              <a href="/contact" className="btn secondary">
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </>

      {/* Floating Button */}
      <div className="floating-button-container">
        <button
          className={`floating-button ${isDropdownOpen ? 'active' : ''}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title="Voir les filières"
        >
          📚
        </button>
        
        {isDropdownOpen && (
          <div className="floating-dropdown">
            <div className="floating-dropdown-header">
              <h4>Filières ENSA</h4>
            </div>
            <div className="floating-dropdown-content">
              {filieres.map((filiere, index) => (
                <a
                  key={index}
                  href={filiere.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="floating-dropdown-item"
                >
                  📄 {filiere.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ENSA;