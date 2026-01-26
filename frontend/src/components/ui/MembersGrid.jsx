import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const MembersGrid = ({ members, className = "" }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [filter, setFilter] = useState('all');

  // Get unique roles for filtering
  const roles = ['all', ...new Set(members.map(member => member.role))];

  // Filter members based on selected role
  const filteredMembers = filter === 'all' 
    ? members 
    : members.filter(member => member.role === filter);

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
      y: 20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className={`members-grid-container ${className}`} style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '40px'
      }}>
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            style={{
              padding: '8px 16px',
              borderRadius: '25px',
              border: '2px solid var(--primary)',
              background: filter === role ? 'var(--primary)' : 'transparent',
              color: filter === role ? 'white' : 'var(--primary)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}
            onMouseEnter={(e) => {
              if (filter !== role) {
                e.target.style.background = 'var(--primary)';
                e.target.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== role) {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--primary)';
              }
            }}
          >
            {role === 'all' ? 'Tous' : role}
          </button>
        ))}
      </div>

      {/* Members Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          justifyItems: 'center'
        }}
      >
        <AnimatePresence>
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member._id || index}
              variants={itemVariants}
              layout
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              onClick={() => setSelectedMember(member)}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '20px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--card-border)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                maxWidth: '300px',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Background Gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '80px',
                background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                opacity: 0.1,
                borderRadius: '20px 20px 0 0'
              }} />

              {/* Profile Image */}
              <div style={{
                position: 'relative',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto',
                  border: '4px solid var(--primary)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  position: 'relative'
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
              </div>

              {/* Member Info */}
              <div style={{ position: 'relative' }}>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '12px',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {member.role}
                </p>

                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  lineHeight: '1.3'
                }}>
                  {member.name}
                </h3>

                {/* Quick Contact */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                  marginTop: '16px'
                }}>
                  <a
                    href={`mailto:${member.email}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: '16px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    ✉️
                  </a>
                  
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--secondary)',
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        fontSize: '16px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      📞
                    </a>
                  )}
                </div>

                {/* View More Button */}
                <div style={{
                  marginTop: '16px',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  fontWeight: '500'
                }}>
                  Cliquer pour plus d'infos
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
              padding: '20px'
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
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
                textAlign: 'center'
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
                <a
                  href={`mailto:${selectedMember.email}`}
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
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ✉️ Envoyer un email
                </a>

                {selectedMember.phone && (
                  <a
                    href={`tel:${selectedMember.phone}`}
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
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    📞 Appeler
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MembersGrid;