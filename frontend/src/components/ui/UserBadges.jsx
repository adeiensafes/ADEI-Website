import React from 'react';

const UserBadges = ({ user, size = 'small', className = '' }) => {
  if (!user) return null;

  const badges = [];
  
  if (user.is_president) {
    badges.push({
      key: 'president',
      label: 'Président de club',
      color: '#dc2626', // red-600
      bgColor: '#fef2f2', // red-50
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    });
  }
  
  if (user.is_representant) {
    badges.push({
      key: 'representant',
      label: 'Représentant de classe',
      color: '#2563eb', // blue-600
      bgColor: '#eff6ff', // blue-50
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      )
    });
  }
  
  if (user.is_membre_adei) {
    badges.push({
      key: 'membre_adei',
      label: 'Membre de l\'ADEI',
      color: '#059669', // emerald-600
      bgColor: '#ecfdf5', // emerald-50
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          <path d="M9 14l2 2 4-4"/>
        </svg>
      )
    });
  }
  
  if (user.is_bureau_adei) {
    badges.push({
      key: 'bureau_adei',
      label: 'Bureau de l\'ADEI',
      color: '#7c3aed', // violet-600
      bgColor: '#f5f3ff', // violet-50
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18"/>
          <path d="M5 21V7l8-4v18"/>
          <path d="M19 21V11l-6-4"/>
          <path d="M9 9v.01"/>
          <path d="M9 12v.01"/>
          <path d="M9 15v.01"/>
          <path d="M9 18v.01"/>
        </svg>
      )
    });
  }

  if (badges.length === 0) return null;

  const sizeClasses = {
    small: {
      container: 'gap-1',
      badge: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3'
    },
    medium: {
      container: 'gap-2',
      badge: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4'
    },
    large: {
      container: 'gap-2',
      badge: 'px-4 py-2 text-base',
      icon: 'w-5 h-5'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.small;

  return (
    <div className={`flex flex-wrap ${currentSize.container} ${className}`}>
      {badges.map((badge) => (
        <span
          key={badge.key}
          className={`inline-flex items-center ${currentSize.badge} font-medium rounded-full border`}
          style={{
            color: badge.color,
            backgroundColor: badge.bgColor,
            borderColor: badge.color + '40' // Add transparency to border
          }}
          title={badge.label}
        >
          <span className={`mr-1 ${currentSize.icon}`} style={{ color: badge.color }}>
            {badge.icon}
          </span>
          {badge.label}
        </span>
      ))}
    </div>
  );
};

export default UserBadges;