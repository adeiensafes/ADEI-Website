import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { NavIcons } from './NavIcons';

const Navbar = () => {
  const { token, logout, user } = useContext(AuthContext);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);

  // Amélioration de l'affichage du nom d'utilisateur
  const getDisplayName = () => {
    if (!token || !user?.username) return null;
    
    const username = user.username;
    
    // Handle special case for admin
    if (username.toLowerCase() === 'admin') {
      return 'Administrateur';
    }
    
    // Capitaliser la première lettre de chaque mot
    return username
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const displayName = getDisplayName();

  // Debug log to check user data
  console.log('Navbar - Current user:', user);
  console.log('Navbar - Display name:', displayName);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menus when route changes
    setIsMobileMenuOpen(false);
    setIsAuthDropdownOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.auth-dropdown')) {
        setIsAuthDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsAuthDropdownOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        {/* Mobile toggle - Moved to left */}
        <button 
          className="navbar-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Logo centré sur mobile */}
        <Link to="/" className="navbar-brand" onClick={() => setIsMobileMenuOpen(false)}>
          <img 
            src="/images/ADEI.png" 
            alt="ADEI" 
            className="navbar-logo"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'inline';
            }}
          />
          <span className="navbar-brand-text">
            ADEI
          </span>
        </Link>

        {/* Links avec nouvel ordre et icônes - ENSA supprimé */}
        <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <NavIcons.Home />
            <span>Accueil</span>
          </Link>
          <Link to="/adei" className={`navbar-link ${isActive('/adei') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <NavIcons.ADEI />
            <span>ADEI</span>
          </Link>
          <Link to="/news" className={`navbar-link ${isActive('/news') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <NavIcons.News />
            <span>Actualités</span>
          </Link>
          <Link to="/events" className={`navbar-link ${isActive('/events') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <NavIcons.Events />
            <span>Événements</span>
          </Link>
          <Link to="/clubs" className={`navbar-link ${isActive('/clubs') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <NavIcons.Clubs />
            <span>Clubs</span>
          </Link>
          <Link to="/feedbacks" className={`navbar-link ${isActive('/feedbacks') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <NavIcons.Feedbacks />
            <span>Feedbacks</span>
          </Link>
        </div>

        {/* Auth Dropdown amélioré */}
        <div className="navbar-auth">
          <div className="auth-dropdown">
            <button 
              className="auth-dropdown-toggle"
              onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
              aria-expanded={isAuthDropdownOpen}
            >
              {token ? (
                <>
                  <NavIcons.User />
                  <span className="auth-username">{displayName}</span>
                  <span className="dropdown-arrow">▾</span>
                </>
              ) : (
                <>
                  <NavIcons.Login />
                  <span>Connexion</span>
                  <span className="dropdown-arrow">▾</span>
                </>
              )}
            </button>
            <div className={`auth-dropdown-menu ${isAuthDropdownOpen ? 'open' : ''}`}>
              {token ? (
                <>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="auth-dropdown-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <NavIcons.Admin />
                      <span>Panneau Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="auth-dropdown-item"
                  >
                    <NavIcons.Logout />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="auth-dropdown-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <NavIcons.Login />
                    <span>Se connecter</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
