import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const MembersFlowChart = ({ members, className = "" }) => {
  const [selectedPath, setSelectedPath] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [flowDirection, setFlowDirection] = useState('top-down'); // 'top-down', 'left-right'
  const [selectedMember, setSelectedMember] = useState(null);

  // Enhanced flow structure with more detailed positioning
  const flowStructure = {
    levels: [
      {
        id: 'direction',
        title: "Direction Stratégique",
        roles: ['President'],
        color: '#FF3B30',
        position: { x: 400, y: 80 },
        description: 'Vision et leadership global',
        connections: ['vice-direction']
      },
      {
        id: 'vice-direction',
        title: "Vice-Direction", 
        roles: ['Vice President'],
        color: '#FF3B30',
        position: { x: 400, y: 200 },
        description: 'Support exécutif et coordination',
        connections: ['bureau-executif', 'conseil']
      },
      {
        id: 'bureau-executif',
        title: "Bureau Exécutif",
        roles: ['Secrétaire Générale', 'Trésorier'],
        color: '#007AFF',
        positions: [{ x: 250, y: 320 }, { x: 550, y: 320 }],
        description: 'Administration et finances',
        connections: ['operations', 'technique']
      },
      {
        id: 'conseil',
        title: "Conseil Consultatif",
        roles: ['Conseillers'],
        color: '#34C759',
        position: { x: 400, y: 440 },
        description: 'Conseil et expertise stratégique',
        connections: ['representation', 'technique']
      },
      {
        id: 'technique',
        title: "Département Technique",
        roles: ['IT Manager', 'IT Team'],
        color: '#5856D6',
        positions: [{ x: 150, y: 560 }, { x: 300, y: 560 }],
        description: 'Infrastructure et développement',
        connections: ['creatif']
      },
      {
        id: 'representation',
        title: "Représentation Étudiante",
        roles: ['Représentant des étudiants étrangers', 'Représentant des Lauréats', 'Affaires Administratives'],
        color: '#FF9500',
        positions: [{ x: 500, y: 560 }, { x: 650, y: 560 }, { x: 575, y: 680 }],
        description: 'Liaison et représentation',
        connections: ['externe']
      },
      {
        id: 'operations',
        title: "Opérations & Communication",
        roles: ['Responsable Media', 'Responsable Interne'],
        color: '#FF2D92',
        positions: [{ x: 200, y: 680 }, { x: 350, y: 680 }],
        description: 'Communication et gestion interne',
        connections: []
      },
      {
        id: 'externe',
        title: "Relations Externes",
        roles: ['Responsables Sponsoring'],
        color: '#30D158',
        position: { x: 100, y: 800 },
        description: 'Partenariats et sponsoring',
        connections: []
      },
      {
        id: 'creatif',
        title: "Département Créatif",
        roles: ['Responsables Création & Design'],
        color: '#64D2FF',
        position: { x: 700, y: 800 },
        description: 'Design et création de contenu',
        connections: []
      }
    ]
  };

  // Enhanced connections with flow types
  const connections = [
    { from: 'direction', to: 'vice-direction', type: 'direct', strength: 'strong' },
    { from: 'vice-direction', to: 'bureau-executif', type: 'branch', strength: 'strong' },
    { from: 'vice-direction', to: 'conseil', type: 'direct', strength: 'medium' },
    { from: 'bureau-executif', to: 'operations', type: 'flow', strength: 'medium' },
    { from: 'bureau-executif', to: 'technique', type: 'flow', strength: 'medium' },
    { from: 'conseil', to: 'representation', type: 'flow', strength: 'medium' },
    { from: 'conseil', to: 'technique', type: 'coordination', strength: 'weak' },
    { from: 'technique', to: 'creatif', type: 'collaboration', strength: 'medium' },
    { from: 'representation', to: 'externe', type: 'flow', strength: 'weak' },
    { from: 'operations', to: 'externe', type: 'coordination', strength: 'weak' }
  ];

  const getMembersByRole = (roles) => {
    return members.filter(member => roles.includes(member.role));
  };

  const getLevelById = (id) => {
    return flowStructure.levels.find(level => level.id === id);
  };

  const getConnectionsForLevel = (levelId) => {
    return connections.filter(conn => conn.from === levelId || conn.to === levelId);
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
      y: -50,
      rotateX: -90
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const EnhancedFlowNode = ({ level, member, position, isMultiple = false }) => {
    const isHovered = hoveredNode?.id === member._id;
    const isPathSelected = selectedPath === level.id;
    const levelConnections = getConnectionsForLevel(level.id);

    return (
      <motion.div
        variants={nodeVariants}
        whileHover={{ 
          scale: 1.15,
          z: 100,
          rotateY: 10,
          transition: { duration: 0.3 }
        }}
        onClick={() => {
          setSelectedPath(selectedPath === level.id ? null : level.id);
          setSelectedMember(member);
        }}
        onHoverStart={() => setHoveredNode({ id: member._id, level: level.id })}
        onHoverEnd={() => setHoveredNode(null)}
        style={{
          position: 'absolute',
          left: position.x - 50,
          top: position.y - 50,
          width: '100px',
          height: '100px',
          cursor: 'pointer',
          zIndex: isHovered || isPathSelected ? 30 : 10,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Node Glow Effect */}
        <motion.div
          animate={{
            scale: isHovered ? [1, 1.4, 1] : [1, 1.1, 1],
            opacity: isHovered ? [0.3, 0.8, 0.3] : [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: isHovered ? 1.5 : 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${level.color}40, transparent)`,
            pointerEvents: 'none',
            zIndex: -1
          }}
        />

        {/* Enhanced Node Shape */}
        <motion.div
          animate={{
            rotateZ: isHovered ? [0, 360] : 0
          }}
          transition={{
            duration: 8,
            repeat: isHovered ? Infinity : 0,
            ease: "linear"
          }}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: isMultiple ? '25px' : '50%',
            background: `conic-gradient(from 0deg, ${level.color}, ${level.color}dd, ${level.color})`,
            border: '4px solid var(--card-bg)',
            boxShadow: isHovered 
              ? `0 15px 40px ${level.color}60` 
              : `0 8px 25px ${level.color}40`,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Member Photo */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: isMultiple ? '20px' : '50%',
            overflow: 'hidden',
            border: '3px solid var(--card-bg)',
            position: 'relative',
            zIndex: 2
          }}>
            <img
              src={getImageUrl(member.photo) || '/images/default.jpg'}
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

          {/* Animated Border */}
          <motion.div
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              borderRadius: isMultiple ? '27px' : '50%',
              background: `conic-gradient(from 0deg, ${level.color}, transparent, ${level.color})`,
              zIndex: 1,
              opacity: isHovered ? 0.8 : 0.3
            }}
          />

          {/* Level Indicator */}
          <div style={{
            position: 'absolute',
            bottom: '-12px',
            right: '-12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--card-bg)',
            border: `3px solid ${level.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: level.color,
            zIndex: 10,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}>
            {flowStructure.levels.findIndex(l => l.id === level.id) + 1}
          </div>
        </motion.div>

        {/* Enhanced Node Label */}
        <AnimatePresence>
          {(isHovered || isPathSelected || showLabels) && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1
              }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              style={{
                position: 'absolute',
                top: '110px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--card-bg)',
                border: `2px solid ${level.color}`,
                borderRadius: '12px',
                padding: '8px 12px',
                fontSize: '11px',
                fontWeight: '600',
                color: level.color,
                textAlign: 'center',
                minWidth: '120px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                whiteSpace: 'nowrap',
                zIndex: 20,
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ marginBottom: '2px' }}>
                {member.name.split(' ')[0]}
              </div>
              <div style={{ 
                fontSize: '9px', 
                opacity: 0.8,
                color: 'var(--text-muted)'
              }}>
                {member.role.split(' ')[0]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection Indicators */}
        {levelConnections.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            right: '-5px',
            bottom: '-5px',
            pointerEvents: 'none'
          }}>
            {levelConnections.map((conn, index) => (
              <motion.div
                key={index}
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 5 + index,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: level.color,
                  top: `${20 + index * 20}%`,
                  left: `${20 + index * 20}%`,
                  opacity: 0.6,
                  boxShadow: `0 0 10px ${level.color}`
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={`members-flowchart-enhanced ${className}`} style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      {/* Enhanced Control Panel */}
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '40px',
        border: '1px solid var(--card-border)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Animation Speed Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
              ⚡ Vitesse:
            </span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              style={{
                width: '100px',
                accentColor: 'var(--primary)'
              }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {animationSpeed}x
            </span>
          </div>

          {/* Toggle Controls */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowLabels(!showLabels)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: '2px solid var(--primary)',
                background: showLabels ? 'var(--primary)' : 'transparent',
                color: showLabels ? 'white' : 'var(--primary)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              {showLabels ? '🏷️ Masquer Labels' : '🏷️ Afficher Labels'}
            </button>

            <button
              onClick={() => setFlowDirection(flowDirection === 'top-down' ? 'left-right' : 'top-down')}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: '2px solid var(--secondary)',
                background: 'var(--secondary)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 {flowDirection === 'top-down' ? 'Vue Verticale' : 'Vue Horizontale'}
            </button>
          </div>

          {/* Flow Statistics */}
          <div style={{
            display: 'flex',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            <span>📊 {flowStructure.levels.length} Niveaux</span>
            <span>🔗 {connections.length} Connexions</span>
            <span>👥 {members.length} Membres</span>
          </div>
        </div>
      </div>

      {/* Enhanced Flow Chart Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{
          position: 'relative',
          width: '900px',
          height: '900px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, var(--card-bg), var(--bg-secondary))',
          borderRadius: '24px',
          border: '2px solid var(--card-border)',
          boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Enhanced Background Grid */}
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
            <pattern id="enhancedgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--primary)" strokeWidth="1"/>
              <circle cx="30" cy="30" r="2" fill="var(--primary)" opacity="0.3"/>
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#enhancedgrid)" />
        </svg>

        {/* Enhanced Flow Connections */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5
          }}
        >
          {connections.map((connection, index) => {
            const fromLevel = getLevelById(connection.from);
            const toLevel = getLevelById(connection.to);
            
            if (!fromLevel || !toLevel) return null;

            const fromPos = fromLevel.positions ? fromLevel.positions[0] : fromLevel.position;
            const toPos = toLevel.positions ? toLevel.positions[0] : toLevel.position;

            const strokeWidth = connection.strength === 'strong' ? 4 : connection.strength === 'medium' ? 3 : 2;
            const strokeColor = hoveredNode?.level === connection.from || hoveredNode?.level === connection.to 
              ? fromLevel.color 
              : 'var(--primary)';

            return (
              <motion.g key={index}>
                {/* Enhanced Connection Line */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: hoveredNode?.level === connection.from || hoveredNode?.level === connection.to ? 0.9 : 0.4
                  }}
                  transition={{ 
                    duration: 2 / animationSpeed, 
                    delay: index * 0.2 / animationSpeed 
                  }}
                  d={`M ${fromPos.x} ${fromPos.y + 50} Q ${(fromPos.x + toPos.x) / 2} ${(fromPos.y + toPos.y) / 2 - 50} ${toPos.x} ${toPos.y - 50}`}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={connection.type === 'coordination' ? "10,5" : connection.type === 'collaboration' ? "5,5" : "none"}
                  markerEnd="url(#enhancedarrow)"
                  filter="url(#glow)"
                />
                
                {/* Enhanced Arrow Marker */}
                <defs>
                  <marker
                    id="enhancedarrow"
                    markerWidth="12"
                    markerHeight="10"
                    refX="10"
                    refY="5"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <polygon
                      points="0 0, 12 5, 0 10"
                      fill={strokeColor}
                      filter="url(#glow)"
                    />
                  </marker>
                </defs>

                {/* Enhanced Flow Animation */}
                <motion.circle
                  r="4"
                  fill={strokeColor}
                  filter="url(#glow)"
                  animate={{
                    offsetDistance: ['0%', '100%']
                  }}
                  transition={{
                    duration: 4 / animationSpeed,
                    repeat: Infinity,
                    delay: index * 0.5 / animationSpeed,
                    ease: "easeInOut"
                  }}
                  style={{
                    offsetPath: `path('M ${fromPos.x} ${fromPos.y + 50} Q ${(fromPos.x + toPos.x) / 2} ${(fromPos.y + toPos.y) / 2 - 50} ${toPos.x} ${toPos.y - 50}')`
                  }}
                />

                {/* Connection Type Label */}
                <motion.text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 - 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill={strokeColor}
                  fontWeight="600"
                  opacity={hoveredNode?.level === connection.from || hoveredNode?.level === connection.to ? 1 : 0}
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {connection.type}
                </motion.text>
              </motion.g>
            );
          })}
        </svg>

        {/* Enhanced Flow Nodes */}
        {flowStructure.levels.map((level, levelIndex) => {
          const levelMembers = getMembersByRole(level.roles);
          
          if (levelMembers.length === 0) return null;

          const positions = level.positions || [level.position];
          
          return levelMembers.map((member, memberIndex) => {
            const position = positions[memberIndex] || positions[0];
            
            return (
              <EnhancedFlowNode
                key={member._id}
                level={level}
                member={member}
                position={position}
                isMultiple={levelMembers.length > 1}
              />
            );
          });
        })}

        {/* Enhanced Level Labels */}
        {flowStructure.levels.map((level, index) => {
          const levelMembers = getMembersByRole(level.roles);
          if (levelMembers.length === 0) return null;

          const position = level.positions ? level.positions[0] : level.position;
          
          return (
            <motion.div
              key={`label-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{
                position: 'absolute',
                left: position.x - 80,
                top: position.y - 120,
                color: level.color,
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: `0 2px 8px ${level.color}40`,
                pointerEvents: 'none',
                width: '160px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '8px',
                border: `1px solid ${level.color}30`
              }}
            >
              <div style={{ marginBottom: '4px' }}>{level.title}</div>
              <div style={{ 
                fontSize: '10px', 
                color: 'var(--text-muted)',
                fontWeight: 'normal'
              }}>
                {level.description}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enhanced Selected Member Details */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              background: 'var(--card-bg)',
              borderRadius: '24px',
              padding: '32px',
              marginTop: '40px',
              border: `3px solid ${flowStructure.levels.find(l => l.roles.includes(selectedMember.role))?.color}`,
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${flowStructure.levels.find(l => l.roles.includes(selectedMember.role))?.color}10, transparent)`,
              backgroundImage: `radial-gradient(circle at 20% 50%, ${flowStructure.levels.find(l => l.roles.includes(selectedMember.role))?.color}15 0%, transparent 50%)`,
              backgroundSize: '100px 100px'
            }} />

            <button
              onClick={() => setSelectedMember(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                zIndex: 10
              }}
            >
              ×
            </button>

            <div style={{ position: 'relative', zIndex: 5 }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 24px auto',
                border: `4px solid ${flowStructure.levels.find(l => l.roles.includes(selectedMember.role))?.color}`,
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
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
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'var(--text-primary)'
              }}>
                {selectedMember.name}
              </h3>

              <p style={{
                margin: '0 0 24px 0',
                fontSize: '16px',
                color: flowStructure.levels.find(l => l.roles.includes(selectedMember.role))?.color,
                fontWeight: '600'
              }}>
                {selectedMember.role}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '24px'
              }}>
                <div style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: '16px',
                  padding: '20px',
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
                    borderRadius: '16px',
                    padding: '20px',
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
                    background: flowStructure.levels.find(l => l.roles.includes(selectedMember.role))?.color,
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
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
                      fontWeight: '600',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    📞 Appeler
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Instructions */}
      <div style={{
        textAlign: 'center',
        marginTop: '32px',
        padding: '20px',
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        fontSize: '14px',
        color: 'var(--text-muted)',
        border: '1px solid var(--card-border)'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
          🎯 Guide d'Utilisation
        </div>
        <div>
          🔄 Suivez les flux organisationnels animés • 🖱️ Cliquez sur un nœud pour explorer • ⚡ Ajustez la vitesse d'animation
        </div>
      </div>
    </div>
  );
};

export default MembersFlowChart;