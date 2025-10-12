import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/admin-panel.css';

const AdminPanel = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('news');
  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [clubsData, setClubsData] = useState([]);
  const [adeiMembersData, setAdeiMembersData] = useState([]);
  const [feedbacksData, setFeedbacksData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingFeedback, setViewingFeedback] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
    setTimeout(() => setPageReady(true), 100);
  }, [token, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: token };

      const [news, events, clubs, adeiMembers, feedbacks, users] = await Promise.all([
        fetch('http://localhost:5000/api/news').then(r => r.json()),
        fetch('http://localhost:5000/api/events').then(r => r.json()),
        fetch('http://localhost:5000/api/clubs').then(r => r.json()),
        fetch('http://localhost:5000/api/adei-members').then(r => r.json()),
        fetch('http://localhost:5000/api/feedbacks', { headers }).then(r => r.json()),
        fetch('http://localhost:5000/api/users', { headers }).then(r => r.json())
      ]);

      setNewsData(news);
      setEventsData(events);
      setClubsData(clubs);
      setAdeiMembersData(adeiMembers);
      setFeedbacksData(feedbacks);
      setUsersData(users);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setImageFile(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token }
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Erreur lors de la suppression: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? `http://localhost:5000/api/${activeTab}/${editingItem._id}`
        : `http://localhost:5000/api/${activeTab}`;

      if ((activeTab === 'clubs' || activeTab === 'adei-members') && (imageFile || formData.photo)) {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
          if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'photo') {
            formDataObj.append(key, formData[key] || '');
          }
        });

        if (imageFile) {
          formDataObj.append(activeTab === 'clubs' ? 'image' : 'photo', imageFile);
        }

        const response = await fetch(url, {
          method,
          headers: { Authorization: token },
          body: formDataObj
        });

        if (response.ok) {
          await fetchData();
          closeModal();
        }
      } else {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: token
        };

        const cleanedData = { ...formData };
        delete cleanedData._id;
        delete cleanedData.__v;
        delete cleanedData.createdAt;

        const response = await fetch(url, {
          method,
          headers,
          body: JSON.stringify(cleanedData)
        });

        if (response.ok) {
          await fetchData();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Erreur lors de la sauvegarde: ' + error.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setImageFile(null);
  };

  const renderModal = () => {
    const getModalTitle = () => {
      const action = editingItem ? 'Modifier' : 'Ajouter';
      switch (activeTab) {
        case 'news': return `${action} une actualité`;
        case 'events': return `${action} un événement`;
        case 'clubs': return `${action} un club`;
        case 'adei-members': return `${action} un membre ADEI`;
        case 'users': return `${action} un utilisateur`;
        default: return action;
      }
    };

    const renderFormFields = () => {
      switch (activeTab) {
        case 'news':
          return (
            <>
              <div className="form-group">
                <label className="form-label">Titre</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contenu</label>
                <textarea
                  className="form-textarea"
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
            </>
          );

        case 'events':
          return (
            <>
              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Titre</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Heure</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.time || ''}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="ex: 14:00 - 16:00"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Lieu</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </>
          );

        case 'clubs':
          return (
            <>
              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Nom du club</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.club || ''}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Président</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.president || ''}
                    onChange={(e) => setFormData({ ...formData, president: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Année d'étude</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.annees_etude || ''}
                    onChange={(e) => setFormData({ ...formData, annees_etude: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.tel || ''}
                    onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Site web</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="form-input"
                />
                {(imageFile || formData.image) && (
                  <div className="image-preview">
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : `http://localhost:5000${formData.image}`}
                      alt="Preview"
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Observations</label>
                <textarea
                  className="form-textarea"
                  value={formData.observations || ''}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                />
              </div>
            </>
          );

        case 'adei-members':
          return (
            <>
              <div className="form-group">
                <label className="form-label">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="form-input"
                />
                {(imageFile || formData.photo) && (
                  <div className="image-preview">
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) :
                           (formData.photo?.startsWith('http') ? formData.photo :
                            formData.photo?.startsWith('/uploads') ? `http://localhost:5000${formData.photo}` :
                            formData.photo)}
                      alt="Preview"
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Prénom Nom"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rôle</label>
                <select
                  className="form-select form-input"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="">Sélectionnez un rôle</option>
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Secrétaire Générale">Secrétaire Générale</option>
                  <option value="Trésorier">Trésorier</option>
                  <option value="Conseillers">Conseillers</option>
                  <option value="IT Manager">IT Manager</option>
                  <option value="IT Team">IT Team</option>
                  <option value="Représentant des étudiants étrangers">Représentant des étudiants étrangers</option>
                  <option value="Représentant des Lauréats">Représentant des Lauréats</option>
                  <option value="Affaires Administratives">Affaires Administratives</option>
                  <option value="Responsable Media">Responsable Media</option>
                  <option value="Responsable Interne">Responsable Interne</option>
                  <option value="Responsables Sponsoring">Responsables Sponsoring</option>
                  <option value="Responsables Création & Design">Responsables Création & Design</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@usmba.ac.ma"
                  required
                />
              </div>
            </>
          );

        case 'users':
          return (
            <>
              <div className="form-group">
                <label className="form-label">Nom d'utilisateur</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mot de passe {editingItem && '(laisser vide pour ne pas changer)'}</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingItem}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rôle</label>
                <select
                  className="form-select form-input"
                  value={formData.role || 'user'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h2>{getModalTitle()}</h2>
                  <button type="button" className="modal-close" onClick={closeModal}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-grid">
                    {renderFormFields()}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-modal secondary" onClick={closeModal}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-modal primary">
                    {editingItem ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'news': return newsData;
      case 'events': return eventsData;
      case 'clubs': return clubsData;
      case 'adei-members': return adeiMembersData;
      case 'feedbacks': return feedbacksData;
      case 'users': return usersData;
      default: return [];
    }
  };

  const getFilteredData = () => {
    const data = getCurrentData();
    if (!searchTerm) return data;

    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchLower) ||
        item.club?.toLowerCase().includes(searchLower) ||
        item.name?.toLowerCase().includes(searchLower) ||
        item.username?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower) ||
        item.content?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    });
  };

  const renderTable = () => {
    const data = getFilteredData();

    if (data.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">Aucune donnée disponible</div>
          <div className="empty-state-description">
            {searchTerm ? 'Aucun résultat ne correspond à votre recherche.' : 'Commencez par ajouter un élément.'}
          </div>
        </div>
      );
    }

    const renderTableHeaders = () => {
      switch (activeTab) {
        case 'news':
          return (
            <>
              <th>Titre</th>
              <th>Date</th>
              <th>Contenu</th>
              <th>Actions</th>
            </>
          );
        case 'events':
          return (
            <>
              <th>Titre</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Lieu</th>
              <th>Actions</th>
            </>
          );
        case 'clubs':
          return (
            <>
              <th>Club</th>
              <th>Président</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </>
          );
        case 'adei-members':
          return (
            <>
              <th>Nom</th>
              <th>Rôle</th>
              <th>Email</th>
              <th>Actions</th>
            </>
          );
        case 'feedbacks':
          return (
            <>
              <th>Nom</th>
              <th>Email</th>
              <th>Type</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </>
          );
        case 'users':
          return (
            <>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Date de création</th>
              <th>Actions</th>
            </>
          );
        default:
          return null;
      }
    };

    const renderTableRow = (item) => {
      switch (activeTab) {
        case 'news':
          return (
            <>
              <td>{item.title}</td>
              <td>{item.date}</td>
              <td>{item.content?.substring(0, 60)}...</td>
              <td>
                <div className="admin-actions">
                  <button className="admin-action-btn edit" onClick={() => handleEdit(item)}>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item._id, 'news')}>
                    Supprimer
                  </button>
                </div>
              </td>
            </>
          );
        case 'events':
          return (
            <>
              <td>{item.title}</td>
              <td>{item.date}</td>
              <td>{item.time}</td>
              <td>{item.location}</td>
              <td>
                <div className="admin-actions">
                  <button className="admin-action-btn edit" onClick={() => handleEdit(item)}>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item._id, 'events')}>
                    Supprimer
                  </button>
                </div>
              </td>
            </>
          );
        case 'clubs':
          return (
            <>
              <td>{item.club}</td>
              <td>{item.president}</td>
              <td>{item.email}</td>
              <td>{item.tel}</td>
              <td>
                <div className="admin-actions">
                  <button className="admin-action-btn edit" onClick={() => handleEdit(item)}>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item._id, 'clubs')}>
                    Supprimer
                  </button>
                </div>
              </td>
            </>
          );
        case 'adei-members':
          return (
            <>
              <td>{item.name}</td>
              <td>{item.role}</td>
              <td>{item.email}</td>
              <td>
                <div className="admin-actions">
                  <button className="admin-action-btn edit" onClick={() => handleEdit(item)}>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item._id, 'adei-members')}>
                    Supprimer
                  </button>
                </div>
              </td>
            </>
          );
        case 'feedbacks':
          return (
            <>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.type}</td>
              <td>{item.message?.substring(0, 50)}...</td>
              <td>{new Date(item.createdAt).toLocaleDateString('fr-FR')}</td>
              <td>
                <div className="admin-actions">
                  <button className="admin-action-btn edit" onClick={() => setViewingFeedback(item)}>
                    Voir
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item._id, 'feedbacks')}>
                    Supprimer
                  </button>
                </div>
              </td>
            </>
          );
        case 'users':
          return (
            <>
              <td>{item.username}</td>
              <td>
                <span className={`badge ${item.role === 'admin' ? 'danger' : 'info'}`}>
                  {item.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </span>
              </td>
              <td>{new Date(item.createdAt).toLocaleDateString('fr-FR')}</td>
              <td>
                <div className="admin-actions">
                  <button className="admin-action-btn edit" onClick={() => handleEdit(item)}>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item._id, 'users')}>
                    Supprimer
                  </button>
                </div>
              </td>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <table className="admin-table">
        <thead>
          <tr>{renderTableHeaders()}</tr>
        </thead>
        <tbody>
          {data.map(item => (
            <motion.tr
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderTableRow(item)}
            </motion.tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${pageReady ? 'fade-in' : ''}`}>
      <div className="admin-header">
        <h1>Tableau de Bord Admin</h1>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{newsData.length}</div>
          <div className="stat-label">Actualités</div>
        </div>
        <div className="stat-card secondary">
          <div className="stat-number">{eventsData.length}</div>
          <div className="stat-label">Événements</div>
        </div>
        <div className="stat-card success">
          <div className="stat-number">{clubsData.length}</div>
          <div className="stat-label">Clubs</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-number">{adeiMembersData.length}</div>
          <div className="stat-label">Membres ADEI</div>
        </div>
        <div className="stat-card info">
          <div className="stat-number">{feedbacksData.filter(f => !f.read).length}</div>
          <div className="stat-label">Nouveaux Feedbacks</div>
        </div>
      </div>

      <div className="admin-tabs">
        {['news', 'events', 'clubs', 'adei-members', 'feedbacks', 'users'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchTerm('');
            }}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
          >
            {tab === 'news' ? 'Actualités' :
             tab === 'events' ? 'Événements' :
             tab === 'clubs' ? 'Clubs' :
             tab === 'adei-members' ? 'Membres ADEI' :
             tab === 'feedbacks' ? 'Feedbacks' :
             'Utilisateurs'}
          </button>
        ))}
      </div>

      <div className="admin-content">
        <div className="admin-toolbar">
          <input
            type="text"
            className="admin-search"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {activeTab !== 'feedbacks' && (
            <button className="admin-add-btn" onClick={handleAdd}>
              + Ajouter
            </button>
          )}
        </div>

        {renderTable()}
      </div>

      {renderModal()}

      <AnimatePresence>
        {viewingFeedback && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingFeedback(null)}
          >
            <motion.div
              className="modal-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Détails du Feedback</h2>
                <button type="button" className="modal-close" onClick={() => setViewingFeedback(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="feedback-details">
                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <div className="feedback-detail-value">{viewingFeedback.name}</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <div className="feedback-detail-value">
                      <a href={`mailto:${viewingFeedback.email}`} className="text-primary">
                        {viewingFeedback.email}
                      </a>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <div className="feedback-detail-value">{viewingFeedback.type}</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <div className="feedback-detail-value">
                      {new Date(viewingFeedback.createdAt).toLocaleString('fr-FR')}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <div className="feedback-detail-value" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                      {viewingFeedback.message}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-modal secondary" onClick={() => setViewingFeedback(null)}>
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
