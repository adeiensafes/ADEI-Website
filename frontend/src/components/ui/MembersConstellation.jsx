import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const MembersConstellation = ({ members, className = "" }) => {
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [showConnections, setShowConnections] = useState(true);

  // Group members into constellations by role hierarchy
  const constellations = {
    'Ursa Major': {
      members: members.filter(m => ['President', 'Vice President'].includes(m.role)),
      color: '#FFD700',
      position: { x: 200, y: 150 }
    },
    'Orion': {
      members: members.filter(m => ['Secrétaire Générale', 'Trésorier'].includes(m.role)),
      color: '#87CEEB',
      position: { x: 500, y: 200 }
    },
    'Cassiopeia': {
      members: members.filter(m => m.role === 'Conseillers'),
      color: '#FF6B6B',
      position: { x: 350, y: 100 }
    },
    'Draco': {
      members: members.filter(m => ['IT Manager', 'IT Team'].includes(m.role)),
      color: '#4ECDC4',
      position: { x: 150, y: 300 }
    },
    'Andromeda': {
      members: members.filter(m => ['Représentant des étudiants étrangers', 'Représentant des Lauréats', 'Affaires Administratives'].includes(m.role)),
      color: '#45B7D1',
      position: { x: 550, y: 350 }
    },
    'Pegasus': {
      members: members.filter(m => ['Responsable Media', 'Responsable Interne'].includes(m.role)),
      color: '#F7DC6F',
      position: { x: 300, y: 400 }
    },
    'Cygnus': {
      members: members.filter(m => m.role === 'Responsables Sponsoring'),
      color: '#BB8FCE',
      position: { x: 100, y: 450 }
    },
    'Phoenix': {
      members: members.filter(m => m.role === 'Responsables Création & Design'),
      color: '#F8C471',
      position: { x: 600, y: 450 }
    }
  };

  // Filter out empty constellations
  const activeConstellations = Object.entries(constellations).filter(([_, data]) => data.members.length > 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const constellationVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      rotate: -180
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const getStarPosition = (memberIndex, totalMembers, basePosition) => {
    if (totalMembers === 1) {
      return { x: basePosition.x, y: basePosition.y };
    }
    
    const angle = (memberIndex * 2 * Math.PI) / totalMembers;
    const radius = 40 + (totalMembers * 5);
    return {
      x: basePosition.x + Math.cos(angle) * radius,
      y: basePosition.y + Math.sin(angle) * radius
    };
  };

  const StarComponent = ({ member, position, color, constellationName, memberIndex, totalMembers }) => {
    const isHovered = hoveredStar?.id === member._id;
    const isSelected = selectedConstellation === constellationName;

    return (
      <motion.div
        whileHover={{ 
          scale: 1.3,
          z: 50,
          transition: { duration: 0.3 }
        }}
        onClick={() => setSelectedConstellation(constellationName)}
        onHoverStart={() => setHoveredStar({ id: member._id, constellation: constellationName })}
        onHoverEnd={() => setHoveredStar(null)}
        style={{
          position: 'absolute',
          left: position.x - 25,
          top: position.y - 25,
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          zIndex: isHovered || isSelected ? 20 : 10
        }}
      >
        {/* Star Glow Effect */}
        <motion.div
          animate={{
            scale: isHovered ? [1, 1.5, 1] : [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: isHovered ? 1 : 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}60, transparent)`,
            pointerEvents: 'none'
          }}
        />

        {/* Star Shape */}
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            filter: `drop-shadow(0 0 10px ${color})`
          }}
        >
          <motion.path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={color}
            animate={{
              rotate: isHovered ? [0, 360] : 0
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: "linear"
            }}
          />
        </svg>

        {/* Member Photo in Center */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${color}`,
          boxShadow: `0 0 15px ${color}40`
        }}>
          <img
            src={getImageUrl(member.photo) || '/images/default.jpg'}
            alt={member.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.src = '/images/default.jpg';
            }}
          />
        </div>

        {/* Star Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isHovered || isSelected ? 1 : 0,
            y: isHovered || isSelected ? 0 : 10
          }}
          style={{
            position: 'absolute',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--card-bg)',
            border: `2px solid ${color}`,
            borderRadius: '8px',
            padding: '4px 8px',
            fontSize: '10px',
            fontWeight: '600',
            color: color,
            textAlign: 'center',
            minWidth: '80px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            whiteSpace: 'nowrap'
          }}
        >
          {member.name.split(' ')[0]}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className={`members-constellation ${className}`} style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      {/* Night Sky Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{
          position: 'relative',
          width: '800px',
          height: '600px',
          margin: '0 auto',
          background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}
      >
        {/* Twinkling Stars Background */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              background: 'white',
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Constellation Lines */}
        {showConnections && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            {activeConstellations.map(([name, data]) => {
              if (data.members.length < 2) return null;
              
              return data.members.map((member, index) => {
                if (index === data.members.length - 1) return null;
                
                const pos1 = getStarPosition(index, data.members.length, data.position);
                const pos2 = getStarPosition(index + 1, data.members.length, data.position);
                
                return (
                  <motion.line
                    key={`${name}-${index}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: selectedConstellation === name ? 0.8 : 0.3 
                    }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    stroke={data.color}
                    strokeWidth={selectedConstellation === name ? 2 : 1}
                    strokeDasharray="3,3"
                  />
                );
              });
            })}
          </svg>
        )}

        {/* Constellation Stars */}
        {activeConstellations.map(([name, data]) => (
          <motion.div
            key={name}
            variants={constellationVariants}
          >
            {data.members.map((member, memberIndex) => {
              const position = getStarPosition(memberIndex, data.members.length, data.position);
              
              return (
                <StarComponent
                  key={member._id}
                  member={member}
                  position={position}
                  color={data.color}
                  constellationName={name}
                  memberIndex={memberIndex}
                  totalMembers={data.members.length}
                />
              );
            })}
          </motion.div>
        ))}

        {/* Constellation Names */}
        {activeConstellations.map(([name, data]) => (
          <motion.div
            key={`label-${name}`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: selectedConstellation === name ? 1 : 0.6 
            }}
            style={{
              position: 'absolute',
              left: data.position.x - 50,
              top: data.position.y - 80,
              color: data.color,
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: `0 0 10px ${data.color}`,
              pointerEvents: 'none',
              width: '100px'
            }}
          >
            {name}
          </motion.div>
        ))}
      </motion.div>

      {/* Selected Constellation Info */}
      <AnimatePresence>
        {selectedConstellation && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{
              background: 'var(--card-bg)',
              borderRadius: '20px',
              padding: '32px',
              marginTop: '32px',
              border: `2px solid ${constellations[selectedConstellation]?.color}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}
          >
            <button
              onClick={() => setSelectedConstellation(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              ×
            </button>

            <h3 style={{
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: 'bold',
              color: constellations[selectedConstellation]?.color
            }}>
              Constellation {selectedConstellation}
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {constellations[selectedConstellation]?.members.map(member => (
                <div
                  key={member._id}
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '0 auto 12px auto',
                    border: `3px solid ${constellations[selectedConstellation]?.color}`,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}>
                    <img
                      src={getImageUrl(member.photo) || '/images/default.jpg'}
                      alt={member.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = '/images/default.jpg';
                      }}
                    />
                  </div>

                  <h4 style={{
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)'
                  }}>
                    {member.name}
                  </h4>

                  <p style={{
                    margin: '0 0 12px 0',
                    fontSize: '12px',
                    color: constellations[selectedConstellation]?.color,
                    fontWeight: '600'
                  }}>
                    {member.role}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center'
                  }}>
                    <a
                      href={`mailto:${member.email}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: constellations[selectedConstellation]?.color,
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '14px'
                      }}
                    >
                      ✉️
                    </a>
                    
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: constellations[selectedConstellation]?.color,
                          color: 'white',
                          textDecoration: 'none',
                          fontSize: '14px'
                        }}
                      >
                        📞
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '24px'
      }}>
        <button
          onClick={() => setShowConnections(!showConnections)}
          style={{
            background: showConnections ? 'var(--primary)' : 'var(--card-bg)',
            color: showConnections ? 'white' : 'var(--primary)',
            border: '2px solid var(--primary)',
            borderRadius: '25px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          {showConnections ? '🌟 Masquer Lignes' : '✨ Afficher Lignes'}
        </button>

        <button
          onClick={() => setSelectedConstellation(null)}
          style={{
            background: 'var(--card-bg)',
            color: 'var(--text-muted)',
            border: '2px solid var(--card-border)',
            borderRadius: '25px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          🌌 Vue Globale
        </button>
      </div>

      {/* Instructions */}
      <div style={{
        textAlign: 'center',
        marginTop: '24px',
        padding: '16px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        fontSize: '14px',
        color: 'var(--text-muted)'
      }}>
        ⭐ Cliquez sur une étoile pour explorer sa constellation • Chaque constellation représente un département
      </div>
    </div>
  );
};

export default MembersConstellation;