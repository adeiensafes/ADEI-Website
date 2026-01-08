import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../AuthContext';
import '../styles/card-animations.css';

const ADEI = () => {
  const { token } = useContext(AuthContext);
  const [pageReady, setPageReady] = useState(false);
  const [content] = useState({
    title: "Association des Étudiants Ingénieurs (ADEI)",
    subtitle: "Votre communauté étudiante au cœur de l'ENSAF",
    sections: [
      {
        title: "Notre Mission",
        content: "L'Association des Élèves Ingénieurs (ADEI) vise à unir les étudiants ingénieurs et à organiser des activités sociales, culturelles et académiques. Nous travaillons à faciliter leur vie étudiante et à offrir des opportunités de développement personnel et professionnel."
      },
      {
        title: "Nos Valeurs",
        content: "L'ADEI prône l'excellence académique, l'esprit d'équipe, l'innovation et la solidarité. Nous croyons en l'importance de créer un environnement inclusif où chaque étudiant peut s'épanouir et développer ses compétences."
      },
      {
        title: "Nos Activités",
        content: "Notre association organise régulièrement des événements, ateliers, conférences et compétitions pour enrichir l'expérience des étudiants et promouvoir un esprit de communauté au sein de l'école. Nous coordonnons également les activités des différents clubs étudiants."
      },
      {
        title: "Gouvernance",
        content: "L'ADEI est dirigée par un bureau exécutif élu démocratiquement par les étudiants. Notre structure organisationnelle favorise la participation active de tous les membres et assure une représentation équitable de toutes les filières."
      },
      {
        title: "Partenariats",
        content: "Nous entretenons des relations privilégiées avec l'administration de l'ENSAF, les entreprises partenaires et d'autres associations étudiantes. Ces partenariats nous permettent d'offrir des opportunités uniques à nos membres."
      }
    ]
  });

  const [members, setMembers] = useState([]);

  const roleOrder = [
    'President',
    'Vice President',
    'Secrétaire Générale',
    'Trésorier',
    'Conseillers',
    'IT Manager',
    'IT Team',
    'Représentant des étudiants étrangers',
    'Représentant des Lauréats',
    'Affaires Administratives',
    'Responsable Media',
    'Responsable Interne',
    'Responsables Sponsoring',
    'Responsables Création & Design'
  ];

  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 200);
    fetchMembers();
    return () => clearTimeout(timer);
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/adei-members');
      const data = await response.json();
      const sortedMembers = data.sort((a, b) => {
        const indexA = roleOrder.indexOf(a.role);
        const indexB = roleOrder.indexOf(b.role);
        return indexA - indexB;
      });
      setMembers(sortedMembers);
    } catch (error) {
      console.error('Error fetching ADEI members:', error);
      setMembers([]);
    }
  };




  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const renderMemberCard = (member) => {
    const photoUrl = member.photo?.startsWith('http') ? member.photo :
                    member.photo?.startsWith('/uploads') ? `http://localhost:5001${member.photo}` :
                    member.photo || '/images/default.jpg';

    return (
      <motion.div
        key={member._id}
        variants={itemVariants}
        whileHover={{
          y: -8,
          transition: { duration: 0.3 }
        }}
        className="member-card card"
        style={{
          background: 'var(--card-bg)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-xl)',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--card-border)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          width: '100%',
          maxWidth: '320px'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          opacity: 0.1
        }} />

        <div style={{
          position: 'relative',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto',
            border: '4px solid var(--primary)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
          }}>
            <img
              src={photoUrl}
              alt={member.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onError={(e) => {
                e.target.src = '/images/default.jpg';
              }}
            />
          </div>
        </div>

        <p style={{
          margin: '0 0 var(--spacing-sm) 0',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--primary)',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {member.role}
        </p>

        <h3 style={{
          margin: '0 0 var(--spacing-md) 0',
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'bold',
          color: 'var(--text-primary)'
        }}>
          {member.name}
        </h3>

        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <a
            href={`mailto:${member.email}`}
            className="contact-email-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              background: 'var(--primary)',
              color: 'white',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-sm)',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--primary-dark)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'var(--primary)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }}
          >
            Contact
          </a>
        </div>
      </motion.div>
    );
  };

  const renderMembersByHierarchy = () => {
    const hierarchyLevels = [
      {
        roles: ['President', 'Vice President'],
        columns: 2
      },
      {
        roles: ['Secrétaire Générale', 'Trésorier'],
        columns: 2
      },
      {
        roles: ['Conseillers'],
        columns: 3
      },
      {
        roles: ['IT Manager', 'IT Team'],
        columns: 3
      },
      {
        roles: ['Représentant des étudiants étrangers', 'Représentant des Lauréats', 'Affaires Administratives'],
        columns: 3
      },
      {
        roles: ['Responsable Media', 'Responsable Interne'],
        columns: 2
      },
      {
        roles: ['Responsables Sponsoring'],
        columns: 3
      },
      {
        roles: ['Responsables Création & Design'],
        columns: 3
      }
    ];

    return hierarchyLevels.map((level, levelIndex) => {
      const levelMembers = members.filter(m => level.roles.includes(m.role));

      if (levelMembers.length === 0) return null;

      return (
        <motion.div
          key={levelIndex}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-xl)',
            justifyContent: 'center',
            maxWidth: level.columns === 1 ? '400px' : level.columns === 2 ? '800px' : '1200px',
            margin: '0 auto'
          }}
        >
          {levelMembers.map(member => renderMemberCard(member))}
        </motion.div>
      );
    });
  };

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

          {/* Members Section */}
          <div className={`members-section ${pageReady ? 'fade-in' : ''}`} style={{ 
            marginTop: 'var(--spacing-3xl)',
            animationDelay: '0.7s'
          }}>
            <div className="section-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--spacing-xl)',
              flexWrap: 'wrap',
              gap: 'var(--spacing-md)'
            }}>
              <h2 className="text-primary" style={{ margin: 0 }}>Membres de l'ADEI</h2>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2xl)',
              alignItems: 'center'
            }}>
              {renderMembersByHierarchy()}
            </div>
          </div>
        </div>

      </>
    </div>
  );
};

export default ADEI;