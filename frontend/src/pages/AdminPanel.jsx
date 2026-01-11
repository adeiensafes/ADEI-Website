import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL, { getImageUrl } from '../config/api';
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
  const [filieresData, setFilieresData] = useState([]);
  const [adeiMembersData, setAdeiMembersData] = useState([]);
  const [feedbacksData, setFeedbacksData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
    setTimeout(() => setPageReady(true), 100);
    
    // Nettoyer le scroll au démontage du composant
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [token, navigate]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: token };

      const [news, events, clubs, filieres, adeiMembers, feedbacks, users] = await Promise.all([
        fetch(`${API_BASE_URL}/api/news').then(r => r.json()),
        fetch(`${API_BASE_URL}/api/events').then(r => r.json()),
        fetch(`${API_BASE_URL}/api/clubs').then(r => r.json()),
        fetch(`${API_BASE_URL}/api/filieres').then(r => r.json()),
        fetch(`${API_BASE_URL}/api/adei-members').then(r => r.json()),
        fetch(`${API_BASE_URL}/api/feedbacks', { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/users', { headers }).then(r => r.json())
      ]);

      // S'assurer que toutes les données sont des tableaux
      setNewsData(Array.isArray(news) ? news : []);
      setEventsData(Array.isArray(events) ? events : []);
      setClubsData(Array.isArray(clubs) ? clubs : []);
      setFilieresData(Array.isArray(filieres) ? filieres : []);
      setAdeiMembersData(Array.isArray(adeiMembers) ? adeiMembers : []);
      setFeedbacksData(Array.isArray(feedbacks) ? feedbacks : []);
      setUsersData(Array.isArray(users) ? users : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // En cas d'erreur, initialiser avec des tableaux vides
      setNewsData([]);
      setEventsData([]);
      setClubsData([]);
      setFilieresData([]);
      setAdeiMembersData([]);
      setFeedbacksData([]);
      setUsersData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setImageFile(null);
    setShowModal(true);
    // Empêcher le scroll de la page en arrière-plan
    document.body.style.overflow = 'hidden';
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setImageFile(null);
    setShowModal(true);
    // Empêcher le scroll de la page en arrière-plan
    document.body.style.overflow = 'hidden';
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token }
      });

      const result = await response.json();

      if (response.ok) {
        await fetchData();
        showNotification(
          result.message || 'Élément supprimé avec succès!',
          'success'
        );
      } else {
        showNotification(
          result.message || 'Erreur lors de la suppression',
          'error'
        );
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showNotification(
        `Erreur lors de la suppression: ${error.message}`,
        'error'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('=== DÉBUT SOUMISSION ===');
    console.log('activeTab:', activeTab);
    console.log('editingItem:', editingItem);
    console.log('formData:', formData);
    console.log('imageFile:', imageFile);

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? `${API_BASE_URL}/api/${activeTab}/${editingItem.id || editingItem._id}`
        : `${API_BASE_URL}/api/${activeTab}`;

      console.log('Method:', method);
      console.log('URL:', url);

      if ((activeTab === 'clubs' || activeTab === 'adei-members') && (imageFile || formData.photo)) {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
          if (key !== '_id' && key !== 'id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'photo') {
            if (key === 'activities' || key === 'achievements') {
              // Convertir les tableaux en JSON string pour FormData
              formDataObj.append(key, JSON.stringify(formData[key] || []));
            } else if (key === 'socialMedia') {
              // Convertir l'objet socialMedia en JSON string
              formDataObj.append(key, JSON.stringify(formData[key] || {}));
            } else if (key === 'members') {
              // Convertir le tableau des membres en JSON string
              formDataObj.append(key, JSON.stringify(formData[key] || []));
            } else {
              formDataObj.append(key, formData[key] || '');
            }
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

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        const result = await response.json();
        console.log('Response result:', result);

        if (response.ok) {
          await fetchData();
          closeModal();
          showNotification(
            result.message || `${editingItem ? 'Modification' : 'Création'} réussie!`,
            'success'
          );
        } else {
          showNotification(
            result.message || `Erreur lors de la ${editingItem ? 'modification' : 'création'}`,
            'error'
          );
        }
      } else {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: token
        };

        const cleanedData = { ...formData };
        delete cleanedData._id;
        delete cleanedData.id;
        delete cleanedData.__v;
        delete cleanedData.createdAt;
        delete cleanedData.updatedAt;

        const response = await fetch(url, {
          method,
          headers,
          body: JSON.stringify(cleanedData)
        });

        console.log('Response status (JSON):', response.status);
        console.log('Response ok (JSON):', response.ok);

        const result = await response.json();
        console.log('Response result (JSON):', result);

        if (response.ok) {
          await fetchData();
          closeModal();
          showNotification(
            result.message || `${editingItem ? 'Modification' : 'Création'} réussie!`,
            'success'
          );
        } else {
          showNotification(
            result.message || `Erreur lors de la ${editingItem ? 'modification' : 'création'}`,
            'error'
          );
        }
      }
    } catch (error) {
      console.error('Error submitting:', error);
      showNotification(
        `Erreur lors de la ${editingItem ? 'modification' : 'création'}: ${error.message}`,
        'error'
      );
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setImageFile(null);
    setShowPassword(false);
    // Restaurer le scroll de la page
    document.body.style.overflow = 'unset';
  };

  const openFeedbackModal = (feedback) => {
    setViewingFeedback(feedback);
    // Empêcher le scroll de la page en arrière-plan
    document.body.style.overflow = 'hidden';
  };

  const closeFeedbackModal = () => {
    setViewingFeedback(null);
    // Restaurer le scroll de la page
    document.body.style.overflow = 'unset';
  };

  // Handle modal body scroll to show/hide scroll indicator
  const handleModalScroll = (e) => {
    const modalBody = e.target;
    if (modalBody.scrollTop > 10) {
      modalBody.classList.add('scrolled');
    } else {
      modalBody.classList.remove('scrolled');
    }
  };

  const renderModal = () => {
    const getModalTitle = () => {
      const action = editingItem ? 'Modifier' : 'Ajouter';
      switch (activeTab) {
        case 'news': return `${action} une actualité`;
        case 'events': return `${action} un événement`;
        case 'clubs': return `${action} un club`;
        case 'filieres': return `${action} une filière`;
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
                      src={imageFile ? URL.createObjectURL(imageFile) : getImageUrl(formData.image)}
                      alt="Preview"
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description détaillée du club..."
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Activités (une par ligne)</label>
                <textarea
                  className="form-textarea"
                  value={Array.isArray(formData.activities) ? formData.activities.join('\n') : formData.activities || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    activities: e.target.value.split('\n').filter(item => item.trim() !== '') 
                  })}
                  placeholder="Ateliers de programmation&#10;Compétitions de robotique&#10;Projets IoT"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Réalisations (une par ligne)</label>
                <textarea
                  className="form-textarea"
                  value={Array.isArray(formData.achievements) ? formData.achievements.join('\n') : formData.achievements || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    achievements: e.target.value.split('\n').filter(item => item.trim() !== '') 
                  })}
                  placeholder="1ère place au concours national&#10;Participation à la RoboCup&#10;Développement de 5 prototypes"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Membres du club</label>
                <div className="members-manager">
                  {(formData.members || []).map((member, index) => (
                    <div key={index} className="member-item">
                      <div className="form-grid three-cols">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Nom du membre"
                          value={member.name || ''}
                          onChange={(e) => {
                            const newMembers = [...(formData.members || [])];
                            newMembers[index] = { ...member, name: e.target.value };
                            setFormData({ ...formData, members: newMembers });
                          }}
                        />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Rôle"
                          value={member.role || ''}
                          onChange={(e) => {
                            const newMembers = [...(formData.members || [])];
                            newMembers[index] = { ...member, role: e.target.value };
                            setFormData({ ...formData, members: newMembers });
                          }}
                        />
                        <div className="member-controls">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Année"
                            value={member.year || ''}
                            onChange={(e) => {
                              const newMembers = [...(formData.members || [])];
                              newMembers[index] = { ...member, year: e.target.value };
                              setFormData({ ...formData, members: newMembers });
                            }}
                          />
                          <button
                            type="button"
                            className="remove-member-btn"
                            onClick={() => {
                              const newMembers = formData.members.filter((_, i) => i !== index);
                              setFormData({ ...formData, members: newMembers });
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-member-btn"
                    onClick={() => {
                      const newMembers = [...(formData.members || []), { name: '', role: '', year: '' }];
                      setFormData({ ...formData, members: newMembers });
                    }}
                  >
                    + Ajouter un membre
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Horaires des réunions</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.meetings || ''}
                  onChange={(e) => setFormData({ ...formData, meetings: e.target.value })}
                  placeholder="ex: Tous les mercredis à 14h00 - Salle des projets"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Réseaux sociaux</label>
                <div className="form-grid three-cols">
                  <input
                    type="url"
                    className="form-input"
                    placeholder="Facebook URL"
                    value={formData.socialMedia?.facebook || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialMedia: { 
                        ...formData.socialMedia, 
                        facebook: e.target.value 
                      } 
                    })}
                  />
                  <input
                    type="url"
                    className="form-input"
                    placeholder="Instagram URL"
                    value={formData.socialMedia?.instagram || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialMedia: { 
                        ...formData.socialMedia, 
                        instagram: e.target.value 
                      } 
                    })}
                  />
                  <input
                    type="url"
                    className="form-input"
                    placeholder="LinkedIn URL"
                    value={formData.socialMedia?.linkedin || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialMedia: { 
                        ...formData.socialMedia, 
                        linkedin: e.target.value 
                      } 
                    })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Observations</label>
                <textarea
                  className="form-textarea"
                  value={formData.observations || ''}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Observations particulières sur le club..."
                  rows="3"
                />
              </div>
            </>
          );

        case 'filieres':
          return (
            <>
              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Nom de la filière</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom complet de la filière"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Abréviation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.abbreviation || ''}
                    onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                    placeholder="ex: INFO, GM, ISCSI"
                    required
                  />
                </div>
              </div>
              
              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select form-input"
                    value={formData.type || 'filiere'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="filiere">Filière d'ingénierie</option>
                    <option value="prepa">Classe préparatoire</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Délégué</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.delegate || ''}
                    onChange={(e) => setFormData({ ...formData, delegate: e.target.value })}
                    placeholder="Nom du délégué"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Années d'étude (une par ligne)</label>
                <textarea
                  className="form-textarea"
                  value={Array.isArray(formData.years) ? formData.years.join('\n') : formData.years || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    years: e.target.value.split('\n').filter(year => year.trim() !== '') 
                  })}
                  placeholder="INFO1&#10;INFO2&#10;INFO3"
                  rows="3"
                />
              </div>

              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Documentation (URL)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.documentation || ''}
                    onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                    placeholder="Lien vers la documentation"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Drive (URL)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.drive || ''}
                    onChange={(e) => setFormData({ ...formData, drive: e.target.value })}
                    placeholder="Lien vers le drive"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact du délégué</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.delegateContact || ''}
                  onChange={(e) => setFormData({ ...formData, delegateContact: e.target.value })}
                  placeholder="Email ou téléphone du délégué"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de la filière..."
                  rows="4"
                />
              </div>

              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Ordre d'affichage</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.order_display || 0}
                    onChange={(e) => setFormData({ ...formData, order_display: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <select
                    className="form-select form-input"
                    value={formData.isActive !== undefined ? formData.isActive : true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
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
                      src={imageFile ? URL.createObjectURL(imageFile) : getImageUrl(formData.photo)}
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
                <label className="form-label">Mot de passe {editingItem && '(laisser vide pour ne pas changer)'}</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingItem}
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
                <div className="modal-body" onScroll={handleModalScroll}>
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
      case 'filieres': return filieresData;
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
        item.abbreviation?.toLowerCase().includes(searchLower) ||
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
        case 'filieres':
          return (
            <>
              <th>Filière</th>
              <th>Abréviation</th>
              <th>Type</th>
              <th>Délégué</th>
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
              <th>Email</th>
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
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'news')}>
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
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'events')}>
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
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'clubs')}>
                    Supprimer
                  </button>
                </div>
              </td>
            </>
          );
        case 'filieres':
          return (
            <>
              <td>{item.name}</td>
              <td>
                <span className={`badge ${item.type === 'prepa' ? 'warning' : 'info'}`}>
                  {item.abbreviation}
                </span>
              </td>
              <td>
                <span className={`badge ${item.type === 'prepa' ? 'secondary' : 'primary'}`}>
                  {item.type === 'prepa' ? 'Classe Prépa' : 'Filière'}
                </span>
              </td>
              <td>{item.delegate}</td>
              <td>
                <div className="admin-actions">
                  <button className="admin-action-btn edit" onClick={() => handleEdit(item)}>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'filieres')}>
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
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'adei-members')}>
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
                  <button className="admin-action-btn edit" onClick={() => openFeedbackModal(item)}>
                    Voir
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'feedbacks')}>
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
              <td>{item.email}</td>
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
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id, 'users')}>
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
              key={item.id || item._id}
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
          <div className="stat-number">{filieresData.length}</div>
          <div className="stat-label">Filières</div>
        </div>
        <div className="stat-card info">
          <div className="stat-number">{adeiMembersData.length}</div>
          <div className="stat-label">Membres ADEI</div>
        </div>
        <div className="stat-card secondary">
          <div className="stat-number">{Array.isArray(feedbacksData) ? feedbacksData.filter(f => !f.read).length : 0}</div>
          <div className="stat-label">Nouveaux Feedbacks</div>
        </div>
      </div>

      <div className="admin-tabs">
        {['news', 'events', 'clubs', 'filieres', 'adei-members', 'feedbacks', 'users'].map(tab => (
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
             tab === 'filieres' ? 'Filières' :
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

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification ${notification.type}`}
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              padding: '12px 24px',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444'
            }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingFeedback && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFeedbackModal}
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
                <button type="button" className="modal-close" onClick={closeFeedbackModal}>×</button>
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
                <button type="button" className="btn-modal secondary" onClick={closeFeedbackModal}>
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
