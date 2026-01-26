import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const MembersSpiral = ({ members, className = "" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  // Auto-rotate through members
  useEffect(() => {
    if (isRotating && members.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % members.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isRotating, members.length]);

  // Calculate spiral positions
  const getSpiralPosition = (index, total) => {
    const angle = (index * 2 * Math.PI) / total;
    const radius = 150 + (index * 20); // Increasing radius for spiral effect
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y, angle };
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.1
      }
    }
  };

  const spiralVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      rotate: -360
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`members-spiral ${className}`} style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      minHeight: '600px',
      position: 'relative'
    }}>
      {/* Spiral Container */}
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
        {/* Background Spiral Pattern */}
        <svg
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            opacity: 0.1,
            zIndex: 1
          }}
        >
          <motion.path
            d="M 300,300 m -150,0 A 150,150 0 0,1 300,150 A 170,170 0 0,1 300,470 A 190,190 0 0,1 300,110 A 210,210 0 0,1 300,510"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>

        {/* Member Nodes in Spiral */}
        {members.map((member, index) => {
          const position = getSpiralPosition(index, members.length);
          const isActive = index === activeIndex;
          
          return (
            <motion.div
              key={member._id}
              variants={spiralVariants}
              whileHover={{ 
                scale: 1.2,
                z: 50,
                transition: { duration: 0.3 }
              }}
              onClick={() => {
                setActiveIndex(index);
                setIsRotating(false);
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                cursor: 'pointer',
                zIndex: isActive ? 20 : 10
              }}
            >
              {/* Connecting Line to Center */}
              <svg
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: Math.abs(position.x) + 60,
                  height: Math.abs(position.y) + 60,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              >
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2={position.x > 0 ? '0%' : '100%'}
                  y2={position.y > 0 ? '0%' : '100%'}
                  stroke={isActive ? 'var(--primary)' : 'var(--text-muted)'}
                  strokeWidth={isActive ? 3 : 1}
                  strokeDasharray="5,5"
                  opacity={isActive ? 0.8 : 0.3}
                  animate={{
                    strokeDashoffset: [0, -10]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </svg>

              {/* Member Circle */}
              <motion.div
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                  rotate: isActive ? [0, 360] : 0
                }}
                transition={{
                  scale: { duration: 2, repeat: isActive ? Infinity : 0 },
                  rotate: { duration: 10, repeat: isActive ? Infinity : 0, ease: "linear" }
                }}
                style={{
                  width: isActive ? '100px' : '80px',
                  height: isActive ? '100px' : '80px',
                  borderRadius: '50%',
                  background: `conic-gradient(from ${position.angle}rad, var(--primary), var(--secondary), var(--primary))`,
                  padding: '4px',
                  boxShadow: isActive 
                    ? '0 0 30px var(--primary)' 
                    : '0 8px 25px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid var(--card-bg)'
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
              </motion.div>

              {/* Member Label */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.8
                }}
                style={{
                  position: 'absolute',
                  top: '110px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--card-bg)',
                  border: '2px solid var(--primary)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--primary)',
                  textAlign: 'center',
                  minWidth: '120px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  whiteSpace: 'nowrap'
                }}
              >
                {member.name.split(' ')[0]}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Center Info Display */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--card-bg)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            border: '3px solid var(--primary)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
            minWidth: '250px',
            zIndex: 30
          }}
        >
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'var(--text-primary)'
          }}>
            {members[activeIndex]?.name}
          </h3>

          <p style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            color: 'var(--primary)',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            {members[activeIndex]?.role}
          </p>

          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center'
          }}>
            <a
              href={`mailto:${members[activeIndex]?.email}`}
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
                fontSize: '16px'
              }}
            >
              ✉️
            </a>
            
            {members[activeIndex]?.phone && (
              <a
                href={`tel:${members[activeIndex]?.phone}`}
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
                  fontSize: '16px'
                }}
              >
                📞
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '32px'
      }}>
        <button
          onClick={() => setIsRotating(!isRotating)}
          style={{
            background: isRotating ? 'var(--primary)' : 'var(--card-bg)',
            color: isRotating ? 'white' : 'var(--primary)',
            border: '2px solid var(--primary)',
            borderRadius: '25px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          {isRotating ? '⏸️ Pause' : '▶️ Auto-Rotate'}
        </button>

        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          {members.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setIsRotating(false);
              }}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: index === activeIndex ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: index === activeIndex ? 1 : 0.5
              }}
            />
          ))}
        </div>
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
        🌀 Les membres sont disposés en spirale • Cliquez sur n'importe qui pour le centrer
      </div>
    </div>
  );
};

export default MembersSpiral;