import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const MembersTable = ({ members, className = "" }) => {
  const [sortBy, setSortBy] = useState('role');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const roleOrder = [
    'President',
    'Vice President',
    'Secrétaire Générale',
    'Trésorier',
    'Conseillers',
    'IT Manager',
    'IT Team',
    'Représentant des étudiants étrangers',
    'Représentant des Lauréats',
    'Affaires Administratives',
    'Responsable Media',
    'Responsable Interne',
    'Responsables Sponsoring',
    'Responsables Création & Design'
  ];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedMembers = members
    .filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'role') {
        aValue = roleOrder.indexOf(a.role);
        bValue = roleOrder.indexOf(b.role);
        if (aValue === -1) aValue = 999;
        if (bValue === -1) bValue = 999;
      } else {
        aValue = a[sortBy]?.toLowerCase() || '';
        bValue = b[sortBy]?.toLowerCase() || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`members-table-container ${className}`} style={{
      background: 'var(--card-bg)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--spacing-xl)',
      border: '1px solid var(--card-border)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      {/* Header avec recherche */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-xl)',
        flexWrap: 'wrap',
        gap: 'var(--spacing-md)'
      }}>
        <h3 style={{
          margin: 0,
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'bold'
        }}>
          Membres de l'ADEI ({filteredAndSortedMembers.length})
        </h3>
        
        <div style={{
          position: 'relative',
          minWidth: '250px'
        }}>
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              paddingLeft: '40px',
              border: '2px solid var(--card-border)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-size-sm)',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(var(--primary-rgb), 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--card-border)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <svg 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              color: 'var(--text-muted)'
            }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
      </div>

      {/* Table responsive */}
      <div style={{
        overflowX: 'auto',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--card-border)'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'var(--bg-secondary)'
        }}>
          <thead>
            <tr style={{
              background: 'var(--primary)',
              color: 'white'
            }}>
              <th style={{
                padding: 'var(--spacing-md)',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: 'var(--font-size-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                minWidth: '80px'
              }}>
                Photo
              </th>
              <th 
                style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  minWidth: '150px'
                }}
                onClick={() => handleSort('name')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Nom
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </div>
              </th>
              <th 
                style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  minWidth: '200px'
                }}
                onClick={() => handleSort('role')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Rôle
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </div>
              </th>
              <th 
                style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  minWidth: '200px'
                }}
                onClick={() => handleSort('email')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Email
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </div>
              </th>
              <th style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: 'var(--font-size-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                minWidth: '120px'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAndSortedMembers.map((member, index) => (
              <motion.tr
                key={member._id || index}
                variants={rowVariants}
                style={{
                  borderBottom: '1px solid var(--card-border)',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td style={{ padding: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-secondary)'
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
                </td>
                <td style={{
                  padding: 'var(--spacing-md)',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-md)'
                }}>
                  {member.name}
                </td>
                <td style={{
                  padding: 'var(--spacing-md)',
                  color: 'var(--primary)',
                  fontWeight: '500',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  <span style={{
                    background: 'rgba(var(--primary-rgb), 0.1)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {member.role}
                  </span>
                </td>
                <td style={{
                  padding: 'var(--spacing-md)',
                  color: 'var(--text-muted)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  <a
                    href={`mailto:${member.email}`}
                    style={{
                      color: 'var(--primary)',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textDecoration = 'none';
                    }}
                  >
                    {member.email}
                  </a>
                </td>
                <td style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center'
                  }}>
                    <a
                      href={`mailto:${member.email}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 4px 12px rgba(var(--primary-rgb), 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                      title="Envoyer un email"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </a>
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--secondary)',
                          color: 'white',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          fontSize: '14px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 4px 12px rgba(var(--secondary-rgb), 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }}
                        title="Appeler"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {filteredAndSortedMembers.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-3xl)',
          color: 'var(--text-muted)'
        }}>
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
            style={{ margin: '0 auto 16px auto', opacity: 0.5 }}
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <p style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>
            Aucun membre trouvé pour "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};

export default MembersTable;