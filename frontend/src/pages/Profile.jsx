import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import UserBadges from '../components/ui/UserBadges';
import Typewriter from '../components/ui/Typewriter';

const Profile = () => {
  const { user, token, refreshUserProfile } = useContext(AuthContext);
  const [pageReady, setPageReady] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [notification, setNotification] = useState(null);

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

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Les nouveaux mots de passe ne correspondent pas', 'error');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showNotification('Le nouveau mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showNotification('Mot de passe modifié avec succès', 'success');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showNotification(result.message || 'Erreur lors de la modification du mot de passe', 'error');
      }
    } catch (error) {
      showNotification('Erreur lors de la modification du mot de passe', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    document.body.style.overflow = 'unset';
  };

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

              <div style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 var(--spacing-xs) 0', color: 'var(--text-primary)' }}>
                    Sécurité du compte
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Modifiez votre mot de passe pour sécuriser votre compte
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    document.body.style.overflow = 'hidden';
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  Changer le mot de passe
                </button>
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

            
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          color: 'white',
          backgroundColor: notification.type === 'error' ? '#dc2626' : '#059669',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {notification.message}
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 var(--spacing-lg) 0', color: 'var(--text-primary)' }}>
              Changer le mot de passe
            </h3>
            
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  color: 'var(--text-primary)', 
                  marginBottom: 'var(--spacing-xs)' 
                }}>
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-md)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  color: 'var(--text-primary)', 
                  marginBottom: 'var(--spacing-xs)' 
                }}>
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-md)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                  required
                  minLength="6"
                />
              </div>

              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  color: 'var(--text-primary)', 
                  marginBottom: 'var(--spacing-xs)' 
                }}>
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-md)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                  required
                  minLength="6"
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closePasswordModal}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: passwordLoading ? '#ccc' : 'var(--primary-color)',
                    color: 'white',
                    cursor: passwordLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {passwordLoading ? 'Modification...' : 'Modifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;