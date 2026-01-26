import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const AnimatedMembers = ({
  members,
  autoplay = true,
  className = "",
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % members.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + members.length) % members.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay && members.length > 1) {
      const interval = setInterval(handleNext, 4000);
      return () => clearInterval(interval);
    }
  }, [autoplay, members.length]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <div className={`animated-members-container ${className}`} style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    }}>
      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '40px',
      }}>
        {/* Section des images */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          justifyItems: 'center'
        }}>
          <div style={{
            position: 'relative',
            height: '320px',
            width: '250px',
            margin: '0 auto'
          }}>
            <AnimatePresence>
              {members.map((member, index) => (
                <motion.div
                  key={member._id || index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index) ? 999 : members.length + 2 - index,
                    y: isActive(index) ? [0, -20, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transformOrigin: 'bottom',
                  }}
                >
                  <img
                    src={getImageUrl(member.photo) || '/images/default.jpg'}
                    alt={member.name}
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: '24px',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      border: '4px solid var(--primary)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    }}
                    onError={(e) => {
                      e.target.src = '/images/default.jpg';
                    }}
                    draggable={false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Section des informations */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            padding: '16px 0',
            minHeight: '320px'
          }}>
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <h3 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                margin: '0 0 8px 0',
                textAlign: 'center'
              }}>
                {members[active].name}
              </h3>
              
              <p style={{
                fontSize: '1.1rem',
                color: 'var(--primary)',
                fontWeight: '600',
                margin: '0 0 24px 0',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {members[active].role}
              </p>

              <motion.div style={{
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                marginTop: '32px',
                textAlign: 'center',
                lineHeight: '1.6'
              }}>
                <p style={{ margin: '0 0 16px 0' }}>
                  <strong>Email:</strong>{' '}
                  <a 
                    href={`mailto:${members[active].email}`}
                    style={{
                      color: 'var(--primary)',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {members[active].email}
                  </a>
                </p>
                
                {members[active].phone && (
                  <p style={{ margin: '0 0 16px 0' }}>
                    <strong>Téléphone:</strong>{' '}
                    <a 
                      href={`tel:${members[active].phone}`}
                      style={{
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      {members[active].phone}
                    </a>
                  </p>
                )}

                {members[active].description && (
                  <motion.p style={{
                    marginTop: '24px',
                    fontStyle: 'italic',
                    color: 'var(--text-muted)'
                  }}>
                    {members[active].description.split(" ").map((word, index) => (
                      <motion.span
                        key={index}
                        initial={{
                          filter: "blur(10px)",
                          opacity: 0,
                          y: 5,
                        }}
                        animate={{
                          filter: "blur(0px)",
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut",
                          delay: 0.02 * index,
                        }}
                        style={{ display: 'inline-block' }}
                      >
                        {word}&nbsp;
                      </motion.span>
                    ))}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>

            {/* Contrôles de navigation */}
            {members.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                paddingTop: '48px'
              }}>
                <button
                  onClick={handlePrev}
                  style={{
                    height: '40px',
                    width: '40px',
                    borderRadius: '50%',
                    background: 'var(--card-bg)',
                    border: '2px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: 'var(--primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--primary)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--card-bg)';
                    e.target.style.color = 'var(--primary)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                
                <button
                  onClick={handleNext}
                  style={{
                    height: '40px',
                    width: '40px',
                    borderRadius: '50%',
                    background: 'var(--card-bg)',
                    border: '2px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: 'var(--primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--primary)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--card-bg)';
                    e.target.style.color = 'var(--primary)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Indicateurs de pagination */}
      {members.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '32px'
        }}>
          {members.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: isActive(index) ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: isActive(index) ? 1 : 0.5
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedMembers;