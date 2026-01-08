import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    // Simulate loading time for consistency
    const timer = setTimeout(() => setPageReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className={`page-container ${pageReady ? 'fade-in' : ''}`}>
      <>
        <div
          className="hero"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-login.png)` }}
        >
          <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
            <h1>Connexion</h1>
            <p>Accédez à votre espace membre pour gérer le contenu du site</p>
          </div>
        </div>

        <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '60vh',
            padding: '0 var(--spacing-md)' 
          }}>
            <div className={`auth-card ${pageReady ? 'zoom-in' : ''}`} style={{ animationDelay: '0.3s' }}>
              <h2 className="text-primary mt-0 text-center">Se connecter</h2>
              
              {error && (
                <div className="message error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="Votre adresse email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Mot de passe
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      placeholder="Votre mot de passe"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn" 
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? (
                    <>
                      <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </form>

              <div style={{ 
                textAlign: 'center', 
                marginTop: 'var(--spacing-xl)', 
                paddingTop: 'var(--spacing-xl)', 
                borderTop: '1px solid var(--card-border)' 
              }}>
                <p className="text-muted">Pas encore de compte ?</p>
                <Link to="/register" className="btn secondary">
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 var(--spacing-md)' }}>
            <div className={`info-card ${pageReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.4s' }}>
              <h3>💡 Informations</h3>
              <p>
                La connexion vous permet d'accéder aux fonctionnalités d'administration 
                pour gérer les actualités, événements, clubs et consulter les messages reçus.
              </p>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Login;