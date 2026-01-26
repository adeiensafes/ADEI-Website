import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import UserBadges from '../components/ui/UserBadges';
import Typewriter from '../components/ui/Typewriter';

const Profile = () => {
  const { user, token, refreshUserProfile } = useContext(AuthContext);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Refresh user profile when component mounts to get latest badge data
  useEffect(() => {
    if (token && refreshUserProfile) {
      refreshUserProfile();
    }
  }, [token, refreshUserProfile]);

  if (!user) {
    return (
      <div className="loading fade-in">
        <div className="spinner"></div>
        Chargement du profil...
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`page-container ${pageReady ? 'fade-in' : ''}`}>
      <div
        className="hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-login.png)` }}
      >
        <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
          <h1>
            <Typewriter 
              words={[
                "Mon Profil",
                "Mes Informations",
                "Tableau de Bord",
                "Espace Personnel"
              ]} 
              speed={85} 
              delayBetweenWords={2200} 
              cursor={true} 
              cursorChar="|"
              className="typewriter-hero"
            />
          </h1>
          <p>Gérez vos informations personnelles et consultez vos badges</p>
        </div>
      </div>

      <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
        <div className="card-grid">
          {/* Profile Information Card */}
          <div className={`card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.4s' }}>
            <h2 className="text-primary mt-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Informations du compte
            </h2>
            
            <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  color: 'var(--text-primary)', 
                  marginBottom: 'var(--spacing-xs)' 
                }}>
                  Nom d'utilisateur
                </label>
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: 'var(--font-size-md)'
                }}>
                  {user.username}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  color: 'var(--text-primary)', 
                  marginBottom: 'var(--spacing-xs)' 
                }}>
                  Adresse email
                </label>
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: 'var(--font-size-md)'
                }}>
                  {user.email}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  color: 'var(--text-primary)', 
                  marginBottom: 'var(--spacing-xs)' 
                }}>
                  Rôle
                </label>
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: 'var(--font-size-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    backgroundColor: user.role === 'admin' ? '#dc2626' : '#059669',
                    color: 'white'
                  }}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {user.role === 'admin' ? 
                      'Accès complet à l\'administration' : 
                      'Accès aux fonctionnalités utilisateur'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Card */}
          <div className={`card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.6s' }}>
            <h2 className="text-primary mt-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Mes badges
            </h2>
            
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <UserBadges user={user} size="large" />
            </div>

            {(!user.is_president && !user.is_representant && !user.is_membre_adei && !user.is_bureau_adei) && (
              <div style={{
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <h3 style={{ color: 'var(--text-muted)', margin: '0 0 var(--spacing-sm) 0' }}>
                  Aucun badge attribué
                </h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                  Les badges sont attribués par les administrateurs selon votre rôle dans l'association ou les clubs.
                </p>
              </div>
            )}

            <div style={{
              marginTop: 'var(--spacing-lg)',
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <h4 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--text-primary)' }}>
                À propos des badges
              </h4>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#dc2626' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span><strong>Président de club:</strong> Vous dirigez un club étudiant</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#2563eb' }}>
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  <span><strong>Représentant de classe:</strong> Vous représentez votre classe</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#059669' }}>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    <path d="M9 14l2 2 4-4"/>
                  </svg>
                  <span><strong>Membre de l'ADEI:</strong> Vous faites partie de l'association</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#7c3aed' }}>
                    <path d="M3 21h18"/>
                    <path d="M5 21V7l8-4v18"/>
                    <path d="M19 21V11l-6-4"/>
                    <path d="M9 9v.01"/>
                    <path d="M9 12v.01"/>
                    <path d="M9 15v.01"/>
                    <path d="M9 18v.01"/>
                  </svg>
                  <span><strong>Bureau de l'ADEI:</strong> Vous êtes membre du bureau exécutif</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Account Details Card */}
          <div className={`card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.8s' }}>
            <h2 className="text-primary mt-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Détails du compte
            </h2>
            
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  Compte créé le:
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {formatDate(user.createdAt)}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  Dernière modification:
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {formatDate(user.updatedAt)}
                </span>
              </div>
            </div>

            <div style={{
              marginTop: 'var(--spacing-lg)',
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="l9 12 2 2 4-4"/>
                </svg>
                Vos badges sont visibles sur votre profil et vos feedbacks. 
                Pour toute modification, contactez un administrateur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;