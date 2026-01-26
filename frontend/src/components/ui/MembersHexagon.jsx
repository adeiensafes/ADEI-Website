import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const MembersHexagon = ({ members, className = "" }) => {
  const [centerMember, setCenterMember] = useState(members[0] || null);
  const [hoveredMember, setHoveredMember] = useState(null);

  // Calculate hexagon positions
  const getHexagonPosition = (index, total, radius = 200) => {
    const angle = (index * 2 * Math.PI) / total;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const hexagonVariants = {
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

  const HexagonShape = ({ size = 80, color = 'var(--primary)' }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon
        points="50,5 85,25 85,75 50,95 15,75 15,25"
        fill={color}
        stroke="var(--card-bg)"
        strokeWidth="3"
      />
    </svg>
  );

  const MemberHexagon = ({ member, position, isCenter = false, onClick }) => {
    const size = isCenter ? 120 : 80;
    
    return (
      <motion.div
        variants={hexagonVariants}
        whileHover={{ 
          scale: 1.1,
          z: 50,
          transition: { duration: 0.3 }
        }}
        onClick={() => onClick(member)}
        onHoverStart={() => setHoveredMember(member)}
        onHoverEnd={() => setHoveredMember(null)}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          cursor: 'pointer',
          zIndex: isCenter ? 10 : 5
        }}
      >
        {/* Hexagon Background */}
        <div style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`
        }}>
          <HexagonShape 
            size={size} 
            color={isCenter ? 'var(--primary)' : 'var(--secondary)'} 
          />
          
          {/* Member Photo */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${size - 20}px`,
            height: `${size - 20}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--card-bg)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
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

          {/* Pulse Animation for Center */}
          {isCenter && (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${size + 20}px`,
                height: `${size + 20}px`,
                pointerEvents: 'none'
              }}
            >
              <HexagonShape 
                size={size + 20} 
                color="var(--primary)" 
              />
            </motion.div>
          )}

          {/* Role Badge */}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--card-bg)',
            border: '2px solid var(--primary)',
            borderRadius: '12px',
            padding: '4px 8px',
            fontSize: '10px',
            fontWeight: '600',
            color: 'var(--primary)',
            textAlign: 'center',
            minWidth: '60px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            {member.role.split(' ')[0]}
          </div>
        </div>
      </motion.div>
    );
  };

  // Arrange members in hexagon pattern
  const arrangeMembers = () => {
    if (!centerMember) return [];
    
    const otherMembers = members.filter(m => m._id !== centerMember._id);
    const arrangements = [];

    // Center member
    arrangements.push({
      member: centerMember,
      position: { x: 0, y: 0 },
      isCenter: true
    });

    // Surrounding members in hexagon pattern
    otherMembers.forEach((member, index) => {
      const position = getHexagonPosition(index, otherMembers.length);
      arrangements.push({
        member,
        position,
        isCenter: false
      });
    });

    return arrangements;
  };

  return (
    <div className={`members-hexagon ${className}`} style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      minHeight: '600px',
      position: 'relative'
    }}>
      {/* Hexagon Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{
          position: 'relative',
          width: '100%',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Background Hexagon Pattern */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.1,
          zIndex: 1
        }}>
          <HexagonShape size={400} color="var(--primary)" />
        </div>

        {/* Member Hexagons */}
        {arrangeMembers().map((arrangement, index) => (
          <MemberHexagon
            key={arrangement.member._id}
            member={arrangement.member}
            position={arrangement.position}
            isCenter={arrangement.isCenter}
            onClick={setCenterMember}
          />
        ))}

        {/* Connecting Lines */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 2
          }}
        >
          {arrangeMembers().slice(1).map((arrangement, index) => (
            <motion.line
              key={index}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${arrangement.position.x}px)`}
              y2={`calc(50% + ${arrangement.position.y}px)`}
              stroke="var(--primary)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          ))}
        </svg>
      </motion.div>

      {/* Center Member Info */}
      {centerMember && (
        <motion.div
          key={centerMember._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center',
            border: '2px solid var(--primary)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginTop: '40px'
          }}
        >
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'var(--text-primary)'
          }}>
            {centerMember.name}
          </h3>

          <p style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            color: 'var(--primary)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {centerMember.role}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'left'
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Email:</strong>
              <br />
              <a 
                href={`mailto:${centerMember.email}`}
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                {centerMember.email}
              </a>
            </div>

            {centerMember.phone && (
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left'
              }}>
                <strong style={{ color: 'var(--text-primary)' }}>Téléphone:</strong>
                <br />
                <a 
                  href={`tel:${centerMember.phone}`}
                  style={{
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  {centerMember.phone}
                </a>
              </div>
            )}
          </div>

          {centerMember.description && (
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Description:</strong>
              <br />
              <p style={{
                margin: '8px 0 0 0',
                color: 'var(--text-muted)',
                lineHeight: '1.6'
              }}>
                {centerMember.description}
              </p>
            </div>
          )}

          {/* Contact Actions */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center'
          }}>
            <motion.a
              href={`mailto:${centerMember.email}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--primary)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              ✉️ Envoyer un email
            </motion.a>

            {centerMember.phone && (
              <motion.a
                href={`tel:${centerMember.phone}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--secondary)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
              >
                📞 Appeler
              </motion.a>
            )}
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div style={{
        textAlign: 'center',
        marginTop: '32px',
        padding: '16px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        fontSize: '14px',
        color: 'var(--text-muted)'
      }}>
        💡 Cliquez sur n'importe quel hexagone pour voir les détails du membre au centre
      </div>

      {/* Hover Tooltip */}
      {hoveredMember && hoveredMember._id !== centerMember?._id && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--card-bg)',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--card-border)',
            zIndex: 100,
            textAlign: 'center',
            fontSize: '14px'
          }}
        >
          <strong style={{ color: 'var(--text-primary)' }}>
            {hoveredMember.name}
          </strong>
          <br />
          <span style={{ color: 'var(--primary)', fontSize: '12px' }}>
            {hoveredMember.role}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default MembersHexagon;