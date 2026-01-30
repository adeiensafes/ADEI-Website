import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../../config/api';
import AdminNavigation from '../../components/AdminNavigation';
import logger from '../../utils/logger';
import '../../styles/admin-panel.css';

const AdminDashboard = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    clubs: 0,
    filieres: 0,
    partners: 0,
    adeiMembers: 0,
    users: 0,
    feedbacks: 0
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (user === null) {
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchStats();
  }, [token, user, navigate]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: token };
      
      // Fetch statistics for each section
      const [newsRes, eventsRes, clubsRes, filieresRes, partnersRes, adeiRes, usersRes, feedbacksRes] = await Promise.allSettled([
        fetch(API_ENDPOINTS.NEWS).then(r => r.json()),
        fetch(API_ENDPOINTS.EVENTS).then(r => r.json()),
        fetch(API_ENDPOINTS.CLUBS).then(r => r.json()),
        fetch(API_ENDPOINTS.FILIERES).then(r => r.json()),
        fetch(API_ENDPOINTS.PARTNERS).then(r => r.json()),
        fetch(API_ENDPOINTS.ADEI_MEMBERS).then(r => r.json()),
        fetch(API_ENDPOINTS.USERS, { headers }).then(r => r.json()),
        fetch(API_ENDPOINTS.FEEDBACKS, { headers }).then(r => r.json())
      ]);

      const getCount = (result) => {
        if (result.status === 'fulfilled') {
          const data = result.value;
          if (data.success && Array.isArray(data.data)) {
            return data.data.length;
          } else if (Array.isArray(data)) {
            return data.length;
          }
        }
        return 0;
      };

      setStats({
        news: getCount(newsRes),
        events: getCount(eventsRes),
        clubs: getCount(clubsRes),
        filieres: getCount(filieresRes),
        partners: getCount(partnersRes),
        adeiMembers: getCount(adeiRes),
        users: getCount(usersRes),
        feedbacks: getCount(feedbacksRes)
      });
    } catch (error) {
      logger.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const adminSections = [
    {
      id: 'filieres',
      title: 'Filières',
      description: 'Gérer les filières d\'ingénierie et classes préparatoires',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 0 5-1 8-1s5 1 8 1v-5"/>
        </svg>
      ),
      count: stats.filieres,
      color: '#16A34A',
      path: '/admin/filieres'
    },
    {
      id: 'clubs',
      title: 'Clubs',
      description: 'Gérer les clubs étudiants et leurs informations',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      count: stats.clubs,
      color: '#DC2626',
      path: '/admin/clubs'
    },
    {
      id: 'news',
      title: 'Actualités',
      description: 'Gérer les actualités et annonces',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
          <path d="M18 14h-8"/>
          <path d="M15 18h-5"/>
          <path d="M10 6h8v4h-8V6Z"/>
        </svg>
      ),
      count: stats.news,
      color: '#2563EB',
      path: '/admin/news'
    },
    {
      id: 'events',
      title: 'Événements',
      description: 'Gérer les événements et activités',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      count: stats.events,
      color: '#7C3AED',
      path: '/admin/events'
    },
    {
      id: 'partners',
      title: 'Partenaires',
      description: 'Gérer les partenaires et sponsors',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <polyline points="16,11 18,13 22,9"/>
        </svg>
      ),
      count: stats.partners,
      color: '#EA580C',
      path: '/admin/partners'
    },
    {
      id: 'adei-members',
      title: 'Membres ADEI',
      description: 'Gérer les membres de l\'ADEI',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      count: stats.adeiMembers,
      color: '#059669',
      path: '/admin/adei-members'
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      description: 'Gérer les comptes utilisateurs',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      count: stats.users,
      color: '#0891B2',
      path: '/admin/users'
    },
    {
      id: 'feedbacks',
      title: 'Feedbacks',
      description: 'Consulter les retours et suggestions',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      count: stats.feedbacks,
      color: '#DC2626',
      path: '/admin/feedbacks'
    }
  ];

  return (
    <>
      <AdminNavigation />
      <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <h1>Tableau de Bord Administrateur</h1>
            <p>Bienvenue, {user?.username}. Gérez votre plateforme ADEI depuis ce tableau de bord.</p>
          </div>
        </div>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des statistiques...</p>
          </div>
        ) : (
          <div className="admin-grid">
            {adminSections.map((section, index) => (
              <motion.div
                key={section.id}
                className="admin-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              >
                <Link to={section.path} className="admin-card-link">
                  <div className="admin-card-header">
                    <div 
                      className="admin-card-icon"
                      style={{ backgroundColor: `${section.color}15`, color: section.color }}
                    >
                      {section.icon}
                    </div>
                    <div className="admin-card-count" style={{ color: section.color }}>
                      {section.count}
                    </div>
                  </div>
                  
                  <div className="admin-card-content">
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>
                  
                  <div className="admin-card-footer">
                    <span>Gérer</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="admin-quick-stats">
          <div className="quick-stats-header">
            <h2>Statistiques Rapides</h2>
            <button onClick={fetchStats} className="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              Actualiser
            </button>
          </div>
          
          <div className="quick-stats-grid">
            <div className="stat-item">
              <div className="stat-label">Total Contenus</div>
              <div className="stat-value">{stats.news + stats.events}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Organisations</div>
              <div className="stat-value">{stats.clubs + stats.filieres + stats.partners}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Membres</div>
              <div className="stat-value">{stats.adeiMembers + stats.users}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Feedbacks Reçus</div>
              <div className="stat-value">{stats.feedbacks}</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default AdminDashboard;