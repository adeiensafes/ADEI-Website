import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const MembersNetwork = ({ members, className = "" }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);
  const [nodes, setNodes] = useState([]);
  const containerRef = useRef(null);

  // Create network nodes with physics-like positioning
  useEffect(() => {
    if (!members.length) return;

    const createNodes = () => {
      const centerX = 400;
      const centerY = 300;
      
      // Hierarchy levels with different radii
      const hierarchyLevels = {
        'President': { level: 0, radius: 0, color: '#ff3b30' },
        'Vice President': { level: 1, radius: 80, color: '#ff3b30' },
        'Secrétaire Générale': { level: 2, radius: 160, color: '#007aff' },
        'Trésorier': { level: 2, radius: 160, color: '#007aff' },
        'Conseillers': { level: 3, radius: 220, color: '#34c759' },
        'IT Manager': { level: 3, radius: 220, color: '#5856d6' },
        'IT Team': { level: 4, radius: 280, color: '#5856d6' },
        'Représentant des étudiants étrangers': { level: 4, radius: 280, color: '#ff9500' },
        'Représentant des Lauréats': { level: 4, radius: 280, color: '#ff9500' },
        'Affaires Administratives': { level: 4, radius: 280, color: '#ff9500' },
        'Responsable Media': { level: 5, radius: 340, color: '#ff2d92' },
        'Responsable Interne': { level: 5, radius: 340, color: '#ff2d92' },
        'Responsables Sponsoring': { level: 5, radius: 340, color: '#30d158' },
        'Responsables Création & Design': { level: 5, radius: 340, color: '#64d2ff' }
      };

      const newNodes = members.map((member, index) => {
        const hierarchy = hierarchyLevels[member.role] || { level: 5, radius: 340, color: '#8e8e93' };
        
        // Calculate position based on hierarchy
        let x, y;
        if (hierarchy.level === 0) {
          x = centerX;
          y = centerY;
        } else {
          // Count members at same level for even distribution
          const sameLevelMembers = members.filter(m => 
            hierarchyLevels[m.role]?.level === hierarchy.level
          );
          const memberIndex = sameLevelMembers.findIndex(m => m._id === member._id);
          const angle = (memberIndex * 2 * Math.PI) / sameLevelMembers.length;
          
          x = centerX + Math.cos(angle) * hierarchy.radius;
          y = centerY + Math.sin(angle) * hierarchy.radius;
        }

        return {
          id: member._id,
          member,
          x,
          y,
          level: hierarchy.level,
          color: hierarchy.color,
          connections: [] // Will be populated based on hierarchy
        };
      });

      // Create connections based on hierarchy
      newNodes.forEach(node => {
        if (node.level > 0) {
          // Connect to nodes at previous level
          const parentNodes = newNodes.filter(n => n.level === node.level - 1);
          if (parentNodes.length > 0) {
            // Connect to closest parent or president if level 1
            const parent = node.level === 1 
              ? newNodes.find(n => n.level === 0) 
              : parentNodes[0];
            if (parent) {
              node.connections.push(parent.id);
            }
          }
        }
      });

      setNodes(newNodes);
    };

    createNodes();
  }, [members]);

  const getConnections = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.connections : [];
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

  const nodeVariants = {
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`members-network ${className}`} style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      {/* Network Visualization */}
      <motion.div
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{
          position: 'relative',
          width: '800px',
          height: '600px',
          margin: '0 auto',
          background: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Background Grid */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            pointerEvents: 'none'
          }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--primary)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Connection Lines */}
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
          {nodes.map(node => 
            node.connections.map(connectionId => {
              const connectedNode = nodes.find(n => n.id === connectionId);
              if (!connectedNode) return null;

              return (
                <motion.line
                  key={`${node.id}-${connectionId}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: hoveredMember?.id === node.id || hoveredMember?.id === connectionId ? 0.8 : 0.3 
                  }}
                  transition={{ duration: 1, delay: Math.random() * 0.5 }}
                  x1={node.x}
                  y1={node.y}
                  x2={connectedNode.x}
                  y2={connectedNode.y}
                  stroke={hoveredMember?.id === node.id || hoveredMember?.id === connectionId ? node.color : 'var(--primary)'}
                  strokeWidth={hoveredMember?.id === node.id || hoveredMember?.id === connectionId ? 3 : 2}
                  strokeDasharray="5,5"
                />
              );
            })
          )}
        </svg>

        {/* Network Nodes */}
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            variants={nodeVariants}
            whileHover={{ 
              scale: 1.2,
              z: 50,
              transition: { duration: 0.3 }
            }}
            onClick={() => setSelectedMember(node.member)}
            onHoverStart={() => setHoveredMember(node)}
            onHoverEnd={() => setHoveredMember(null)}
            style={{
              position: 'absolute',
              left: node.x - 30,
              top: node.y - 30,
              width: '60px',
              height: '60px',
              cursor: 'pointer',
              zIndex: hoveredMember?.id === node.id ? 20 : 10
            }}
          >
            {/* Node Glow Effect */}
            <motion.div
              animate={{
                scale: hoveredMember?.id === node.id ? [1, 1.5, 1] : 1,
                opacity: hoveredMember?.id === node.id ? [0.3, 0.6, 0.3] : 0
              }}
              transition={{
                duration: 2,
                repeat: hoveredMember?.id === node.id ? Infinity : 0,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${node.color}40, transparent)`,
                pointerEvents: 'none'
              }}
            />

            {/* Node Circle */}
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: node.color,
              border: '3px solid var(--card-bg)',
              boxShadow: `0 4px 15px ${node.color}40`,
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img
                src={getImageUrl(node.member.photo) || '/images/default.jpg'}
                alt={node.member.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = '/images/default.jpg';
                }}
              />

              {/* Level Indicator */}
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'var(--card-bg)',
                border: `2px solid ${node.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
                color: node.color
              }}>
                {node.level}
              </div>
            </div>

            {/* Node Label */}
            <div style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--card-bg)',
              border: `1px solid ${node.color}`,
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: '600',
              color: node.color,
              textAlign: 'center',
              minWidth: '80px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              opacity: hoveredMember?.id === node.id ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}>
              {node.member.name.split(' ')[0]}
            </div>
          </motion.div>
        ))}

        {/* Legend */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'var(--text-primary)'
          }}>
            Niveaux Hiérarchiques
          </h4>
          {[
            { level: 0, label: 'Direction', color: '#ff3b30' },
            { level: 1, label: 'Vice-Direction', color: '#ff3b30' },
            { level: 2, label: 'Bureau', color: '#007aff' },
            { level: 3, label: 'Conseil', color: '#34c759' },
            { level: 4, label: 'Représentants', color: '#ff9500' },
            { level: 5, label: 'Responsables', color: '#ff2d92' }
          ].map(item => (
            <div key={item.level} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: item.color
              }} />
              <span style={{ color: 'var(--text-primary)' }}>
                Niveau {item.level}: {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Selected Member Details */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{
              background: 'var(--card-bg)',
              borderRadius: '20px',
              padding: '32px',
              marginTop: '32px',
              border: '2px solid var(--primary)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}
          >
            <button
              onClick={() => setSelectedMember(null)}
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

            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 20px auto',
              border: '4px solid var(--primary)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            }}>
              <img
                src={getImageUrl(selectedMember.photo) || '/images/default.jpg'}
                alt={selectedMember.name}
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

            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--text-primary)'
            }}>
              {selectedMember.name}
            </h3>

            <p style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
              color: 'var(--primary)',
              fontWeight: '600'
            }}>
              {selectedMember.role}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left'
              }}>
                <strong>Email:</strong><br />
                <a href={`mailto:${selectedMember.email}`} style={{ color: 'var(--primary)' }}>
                  {selectedMember.email}
                </a>
              </div>

              {selectedMember.phone && (
                <div style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'left'
                }}>
                  <strong>Téléphone:</strong><br />
                  <a href={`tel:${selectedMember.phone}`} style={{ color: 'var(--primary)' }}>
                    {selectedMember.phone}
                  </a>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center'
            }}>
              <motion.a
                href={`mailto:${selectedMember.email}`}
                whileHover={{ scale: 1.05 }}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                ✉️ Envoyer un email
              </motion.a>

              {selectedMember.phone && (
                <motion.a
                  href={`tel:${selectedMember.phone}`}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: 'var(--secondary)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  📞 Appeler
                </motion.a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        💡 Survolez les nœuds pour voir les connexions hiérarchiques • Cliquez pour voir les détails
      </div>
    </div>
  );
};

export default MembersNetwork;