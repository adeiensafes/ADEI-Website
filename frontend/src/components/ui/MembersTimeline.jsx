import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const MembersTimeline = ({ members, className = "" }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Group members by hierarchy for timeline
  const timelineGroups = [
    { title: "Direction", roles: ['President', 'Vice President'], color: '#ff3b30' },
    { title: "Bureau Exécutif", roles: ['Secrétaire Générale', 'Trésorier'], color: '#007aff' },
    { title: "Conseil", roles: ['Conseillers'], color: '#34c759' },
    { title: "Technique", roles: ['IT Manager', 'IT Team'], color: '#5856d6' },
    { title: "Représentation", roles: ['Représentant des étudiants étrangers', 'Représentant des Lauréats', 'Affaires Administratives'], color: '#ff9500' },
    { title: "Opérations", roles: ['Responsable Media', 'Responsable Interne'], color: '#ff2d92' },
    { title: "Partenariats", roles: ['Responsables Sponsoring'], color: '#30d158' },
    { title: "Créatif", roles: ['Responsables Création & Design'], color: '#64d2ff' }
  ];

  const getGroupMembers = (roles) => {
    return members.filter(member => roles.includes(member.role));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`members-timeline ${className}`} style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* Timeline Line */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '0',
        bottom: '0',
        width: '4px',
        background: 'linear-gradient(180deg, var(--primary), var(--secondary))',
        transform: 'translateX(-50%)',
        borderRadius: '2px',
        zIndex: 1
      }} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {timelineGroups.map((group, groupIndex) => {
          const groupMembers = getGroupMembers(group.roles);
          if (groupMembers.length === 0) return null;

          const isLeft = groupIndex % 2 === 0;

          return (
            <motion.div
              key={groupIndex}
              variants={itemVariants}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '80px',
                position: 'relative'
              }}
            >
              {/* Timeline Node */}
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: group.color,
                border: '4px solid var(--card-bg)',
                boxShadow: `0 0 20px ${group.color}40`,
                zIndex: 10
              }} />

              {/* Content */}
              <div style={{
                width: '45%',
                marginLeft: isLeft ? '0' : '55%',
                textAlign: isLeft ? 'right' : 'left'
              }}>
                {/* Group Header */}
                <div style={{
                  background: 'var(--card-bg)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: `2px solid ${group.color}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px',
                  position: 'relative'
                }}>
                  {/* Arrow pointing to timeline */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    [isLeft ? 'right' : 'left']: '-12px',
                    transform: 'translateY(-50%)',
                    width: '0',
                    height: '0',
                    borderTop: '12px solid transparent',
                    borderBottom: '12px solid transparent',
                    [isLeft ? 'borderRight' : 'borderLeft']: `12px solid ${group.color}`
                  }} />

                  <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: group.color
                  }}>
                    {group.title}
                  </h3>

                  {/* Members Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '16px'
                  }}>
                    {groupMembers.map((member, memberIndex) => (
                      <motion.div
                        key={member._id}
                        whileHover={{ 
                          scale: 1.05,
                          y: -5,
                          transition: { duration: 0.3 }
                        }}
                        style={{
                          textAlign: 'center',
                          background: 'var(--bg-secondary)',
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          margin: '0 auto 12px auto',
                          border: `3px solid ${group.color}`,
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
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: 'var(--text-primary)'
                        }}>
                          {member.name}
                        </h4>

                        <p style={{
                          margin: '0 0 8px 0',
                          fontSize: '11px',
                          color: group.color,
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {member.role}
                        </p>

                        <div style={{
                          display: 'flex',
                          gap: '4px',
                          justifyContent: 'center'
                        }}>
                          <a
                            href={`mailto:${member.email}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: group.color,
                              color: 'white',
                              textDecoration: 'none',
                              fontSize: '12px'
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
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: group.color,
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '12px'
                              }}
                            >
                              📞
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default MembersTimeline;