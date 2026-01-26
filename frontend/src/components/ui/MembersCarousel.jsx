import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const MembersCarousel = ({ members, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3);

  // Responsive visible cards
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && members.length > visibleCards) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % members.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, members.length, visibleCards]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % members.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + members.length) % members.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Get visible members based on current index
  const getVisibleMembers = () => {
    const visible = [];
    for (let i = 0; i < visibleCards; i++) {
      const index = (currentIndex + i) % members.length;
      visible.push({ ...members[index], displayIndex: i });
    }
    return visible;
  };

  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
      transition: {
        duration: 0.4
      }
    })
  };

  const MemberCard = ({ member, index, isCenter = false }) => {
    return (
      <motion.div
        key={member._id}
        custom={1}
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        whileHover={{ 
          y: -10,
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
        style={{
          background: 'var(--card-bg)',
          borderRadius: '24px',
          padding: '32px 24px',
          textAlign: 'center',
          boxShadow: isCenter 
            ? '0 20px 60px rgba(0, 0, 0, 0.15)' 
            : '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: `2px solid ${isCenter ? 'var(--primary)' : 'var(--card-border)'}`,
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '320px',
          margin: '0 auto',
          transform: isCenter ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Animated Background */}
        <motion.div
          animate={{
            background: [
              'linear-gradient(135deg, var(--primary), var(--secondary))',
              'linear-gradient(135deg, var(--secondary), var(--primary))',
              'linear-gradient(135deg, var(--primary), var(--secondary))'
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '120px',
            opacity: 0.1,
            borderRadius: '24px 24px 0 0'
          }}
        />

        {/* Profile Section */}
        <div style={{
          position: 'relative',
          marginBottom: '24px'
        }}>
          {/* Profile Image with Floating Animation */}
          <motion.div
            animate={{
              y: [0, -8, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto',
              border: '4px solid var(--primary)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
              position: 'relative'
            }}
          >
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
            
            {/* Online Status */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'var(--success)',
                border: '3px solid var(--card-bg)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            />
          </motion.div>

          {/* Floating Particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              style={{
                position: 'absolute',
                top: `${20 + i * 15}%`,
                left: `${10 + i * 25}%`,
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--primary)',
                opacity: 0.3
              }}
            />
          ))}
        </div>

        {/* Member Information */}
        <div style={{ position: 'relative' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              margin: '0 0 12px 0',
              fontSize: '13px',
              color: 'var(--primary)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {member.role}
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              margin: '0 0 20px 0',
              fontSize: '22px',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              lineHeight: '1.3'
            }}
          >
            {member.name}
          </motion.h3>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'var(--bg-secondary)',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '14px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '8px',
              color: 'var(--text-muted)'
            }}>
              <span>📧</span>
              <span>{member.email}</span>
            </div>
            
            {member.phone && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'var(--text-muted)'
              }}>
                <span>📞</span>
                <span>{member.phone}</span>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}
          >
            <a
              href={`mailto:${member.email}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--primary)',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '20px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              }}
            >
              ✉️ Contact
            </a>

            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--secondary)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                📞 Appel
              </a>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  };

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <div className={`members-carousel ${className}`} style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* Carousel Container */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px'
      }}>
        {/* Cards Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${visibleCards}, 1fr)`,
          gap: '24px',
          padding: '20px',
          minHeight: '500px'
        }}>
          <AnimatePresence mode="wait">
            {getVisibleMembers().map((member, index) => (
              <MemberCard 
                key={`${member._id}-${currentIndex}`}
                member={member} 
                index={index}
                isCenter={visibleCards === 3 && index === 1}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {members.length > visibleCards && (
          <>
            <button
              onClick={prevSlide}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'var(--card-bg)',
                border: '2px solid var(--primary)',
                color: 'var(--primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--card-bg)';
                e.target.style.color = 'var(--primary)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              ←
            </button>

            <button
              onClick={nextSlide}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'var(--card-bg)',
                border: '2px solid var(--primary)',
                color: 'var(--primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--card-bg)';
                e.target.style.color = 'var(--primary)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {members.length > visibleCards && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '32px'
        }}>
          {members.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentIndex ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: index === currentIndex ? 1 : 0.5,
                transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      )}

      {/* Auto-play Control */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '20px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            color: 'var(--text-muted)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--card-bg)';
            e.target.style.color = 'var(--text-muted)';
          }}
        >
          {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
      </div>
    </div>
  );
};

export default MembersCarousel;