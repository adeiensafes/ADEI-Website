import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const MembersCards3D = ({ members, className = "" }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      rotateY: -90,
      z: -100
    },
    visible: { 
      opacity: 1, 
      rotateY: 0,
      z: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`members-cards-3d ${className}`} style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 20px',
      perspective: '1000px'
    }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          transformStyle: 'preserve-3d'
        }}
      >
        {members.map((member, index) => (
          <motion.div
            key={member._id}
            variants={cardVariants}
            whileHover={{ 
              rotateY: 10,
              rotateX: 5,
              z: 50,
              transition: { duration: 0.3 }
            }}
            onHoverStart={() => setHoveredCard(index)}
            onHoverEnd={() => setHoveredCard(null)}
            onClick={() => setSelectedMember(member)}
            style={{
              background: 'var(--card-bg)',
              borderRadius: '20px',
              padding: '0',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transformStyle: 'preserve-3d',
              boxShadow: hoveredCard === index 
                ? '0 25px 60px rgba(0, 0, 0, 0.3)' 
                : '0 15px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid var(--card-border)',
              height: '400px',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Card Front */}
            <div style={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backfaceVisibility: 'hidden'
            }}>
              {/* Header with gradient */}
              <div style={{
                height: '150px',
                background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Animated background pattern */}
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%']
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    backgroundSize: '100px 100px'
                  }}
                />

                {/* Profile Image */}
                <div style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid var(--card-bg)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  zIndex: 10
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

                {/* Role Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {member.role.split(' ')[0]}
                </div>
              </div>

              {/* Content */}
              <div style={{
                flex: 1,
                padding: '60px 24px 24px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)'
                  }}>
                    {member.name}
                  </h3>

                  <p style={{
                    margin: '0 0 16px 0',
                    fontSize: '14px',
                    color: 'var(--primary)',
                    fontWeight: '600'
                  }}>
                    {member.role}
                  </p>

                  {/* Contact Info */}
                  <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{ marginBottom: '4px' }}>
                      📧 {member.email.split('@')[0]}...
                    </div>
                    {member.phone && (
                      <div>
                        📞 {member.phone.slice(-4)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center'
                }}>
                  <motion.a
                    href={`mailto:${member.email}`}
                    onClick={(e) => e.stopPropagation()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '16px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    ✉️
                  </motion.a>

                  {member.phone && (
                    <motion.a
                      href={`tel:${member.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--secondary)',
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '16px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      📞
                    </motion.a>
                  )}

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMember(member);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--success)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    👁️
                  </motion.button>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredCard === index ? 1 : 0 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.1), rgba(0, 122, 255, 0.1))',
                  pointerEvents: 'none',
                  borderRadius: '20px'
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal for Member Details */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 90 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '24px',
                padding: '40px',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                position: 'relative',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Close Button */}
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
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--card-border)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                }}
              >
                ×
              </button>

              {/* Member Details */}
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 24px auto',
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

              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'var(--text-primary)'
              }}>
                {selectedMember.name}
              </h2>

              <p style={{
                margin: '0 0 24px 0',
                fontSize: '16px',
                color: 'var(--primary)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {selectedMember.role}
              </p>

              <div style={{
                textAlign: 'left',
                background: 'var(--bg-secondary)',
                padding: '24px',
                borderRadius: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Email:</strong>
                  <br />
                  <a 
                    href={`mailto:${selectedMember.email}`}
                    style={{
                      color: 'var(--primary)',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {selectedMember.email}
                  </a>
                </div>

                {selectedMember.phone && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Téléphone:</strong>
                    <br />
                    <a 
                      href={`tel:${selectedMember.phone}`}
                      style={{
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      {selectedMember.phone}
                    </a>
                  </div>
                )}

                {selectedMember.description && (
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Description:</strong>
                    <br />
                    <p style={{
                      margin: '8px 0 0 0',
                      color: 'var(--text-muted)',
                      lineHeight: '1.6'
                    }}>
                      {selectedMember.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center'
              }}>
                <motion.a
                  href={`mailto:${selectedMember.email}`}
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

                {selectedMember.phone && (
                  <motion.a
                    href={`tel:${selectedMember.phone}`}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MembersCards3D;