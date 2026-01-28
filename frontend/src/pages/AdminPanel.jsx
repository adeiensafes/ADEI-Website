import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS, getApiUrl, getImageUrl } from '../config/api';
import { getCategoryLabel, getOrganizerName, CATEGORY_OPTIONS } from '../utils/helpers';
import logger from '../utils/logger';
import '../styles/admin-panel.css';

const AdminPanel = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('news');
  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [clubsData, setClubsData] = useState([]);
  const [filieresData, setFilieresData] = useState([]);
  const [partnersData, setPartnersData] = useState([]);
  const [adeiMembersData, setAdeiMembersData] = useState([]);
  const [feedbacksData, setFeedbacksData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const [modalNotification, setModalNotification] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Attendre que user soit chargé avant de vérifier le rôle
    // Si user est null mais qu'on a un token, on attend qu'il se charge
    if (user === null) {
      return; // Attendre que AuthContext charge les données utilisateur
    }
    
    // Vérifier si l'utilisateur est admin
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchData();
    setTimeout(() => setPageReady(true), 100);
    
    // Nettoyer le scroll au démontage du composant
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [token, user, navigate]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const showModalNotification = (message, type = 'success') => {
    setModalNotification({ message, type });
    setTimeout(() => setModalNotification(null), 5000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: token };

      // Fetch chaque endpoint individuellement
      let news = [];
      let events = [];
      let clubs = [];
      let filieres = [];
      let partners = [];
      let adeiMembers = [];
      let feedbacks = [];
      let users = [];

      try {
        const newsResult = await fetch(API_ENDPOINTS.NEWS).then(r => r.json());
        // Gérer la nouvelle structure de réponse de l'API
        news = newsResult.success && Array.isArray(newsResult.data) 
          ? newsResult.data 
          : (Array.isArray(newsResult) ? newsResult : []);
      } catch (e) {
        logger.error('Erreur lors du chargement des actualités');
      }

      try {
        const eventsResult = await fetch(API_ENDPOINTS.EVENTS).then(r => r.json());
        // Gérer la nouvelle structure de réponse de l'API
        events = eventsResult.success && Array.isArray(eventsResult.data) 
          ? eventsResult.data 
          : (Array.isArray(eventsResult) ? eventsResult : []);
      } catch (e) {
        logger.error('Erreur lors du chargement des événements');
      }

      try {
        const clubsResult = await fetch(API_ENDPOINTS.CLUBS).then(r => r.json());
        // Gérer la nouvelle structure de réponse de l'API
        clubs = clubsResult.success && Array.isArray(clubsResult.data) 
          ? clubsResult.data 
          : (Array.isArray(clubsResult) ? clubsResult : []);
      } catch (e) {
        logger.error('Erreur lors du chargement des clubs');
      }

      try {
        const filieresResult = await fetch(API_ENDPOINTS.FILIERES).then(r => r.json());
        // Gérer la nouvelle structure de réponse de l'API
        filieres = filieresResult.success && Array.isArray(filieresResult.data) 
          ? filieresResult.data 
          : (Array.isArray(filieresResult) ? filieresResult : []);
      } catch (e) {
        logger.error('Erreur lors du chargement des filières');
      }

      try {
        partners = await fetch(API_ENDPOINTS.PARTNERS).then(r => r.json());
      } catch (e) {
        logger.error('Erreur lors du chargement des partenaires');
      }

      try {
        adeiMembers = await fetch(API_ENDPOINTS.ADEI_MEMBERS).then(r => r.json());
      } catch (e) {
        logger.error('Erreur lors du chargement des membres ADEI');
      }

      try {
        const feedbacksResult = await fetch(API_ENDPOINTS.FEEDBACKS, { headers }).then(r => r.json());
        // Gérer la nouvelle structure de réponse de l'API
        feedbacks = feedbacksResult.success && Array.isArray(feedbacksResult.data) 
          ? feedbacksResult.data 
          : (Array.isArray(feedbacksResult) ? feedbacksResult : []);
      } catch (e) {
        logger.error('Erreur lors du chargement des feedbacks');
      }

      try {
        const usersResponse = await fetch(API_ENDPOINTS.USERS, { headers });
        const usersData = await usersResponse.json();
        users = usersData;
      } catch (e) {
        logger.error('Erreur lors du chargement des utilisateurs');
      }

      // S'assurer que toutes les données sont des tableaux
      setNewsData(Array.isArray(news) ? news : []);
      setEventsData(Array.isArray(events) ? events : []);
      setClubsData(Array.isArray(clubs) ? clubs : []);
      setFilieresData(Array.isArray(filieres) ? filieres : []);
      setPartnersData(Array.isArray(partners) ? partners : []);
      setAdeiMembersData(Array.isArray(adeiMembers) ? adeiMembers : []);
      setFeedbacksData(Array.isArray(feedbacks) ? feedbacks : []);
      setUsersData(Array.isArray(users) ? users : []);
    } catch (error) {
      logger.error('Erreur lors du chargement des données');
      // En cas d'erreur, initialiser avec des tableaux vides
      setNewsData([]);
      setEventsData([]);
      setClubsData([]);
      setFilieresData([]);
      setPartnersData([]);
      setAdeiMembersData([]);
      setFeedbacksData([]);
      setUsersData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    
    // Initialiser formData avec des valeurs par défaut selon le type
    let initialData = {};
    
    if (activeTab === 'clubs') {
      initialData = {
        club: '',
        president: '',
        annees_etude: '',
        tel: '',
        email: '',
        website: '',
        description: '',
        activities: [],
        achievements: [],
        members: [],
        meetings: '',
        socialMedia: { facebook: '', instagram: '', linkedin: '' },
        observations: ''
      };
    } else if (activeTab === 'filieres') {
      initialData = {
        name: '',
        abbreviation: '',
        type: 'filiere',
        // Responsable pédagogique commun pour classes préparatoires
        responsablePedagogique: '',
        // Délégués étudiants CP1
        delegueA1: '',
        telDelegueA1: '',
        delegueB1: '',
        telDelegueB1: '',
        delegueC1: '',
        telDelegueC1: '',
        // Délégués étudiants CP2
        delegueA2: '',
        telDelegueA2: '',
        delegueB2: '',
        telDelegueB2: '',
        delegueC2: '',
        telDelegueC2: '',
        // Délégué filière
        delegueFiliere: '',
        telDelegueFiliere: '',
        // Délégués par année pour les filières d'ingénierie
        delegue_annee1: '',
        tel_delegue_annee1: '',
        delegue_annee2: '',
        tel_delegue_annee2: '',
        delegue_annee3: '',
        tel_delegue_annee3: '',
        documentation: '',
        drive: '',
        RespoContact: '',
        description: '',
        order_display: 0,
        isActive: true
      };
    } else if (activeTab === 'partners') {
      initialData = {
        name: '',
        website: '',
        description: '',
        order_display: 0,
        isActive: true
      };
    } else if (activeTab === 'adei-members') {
      initialData = {
        name: '',
        role: '',
        email: ''
      };
    } else if (activeTab === 'users') {
      initialData = {
        username: '',
        email: '',
        password: '',
        role: 'user',
        is_president: false,
        is_representant: false,
        is_membre_adei: false,
        is_bureau_adei: false
      };
    }
    
    setFormData(initialData);
    setImageFile(null);
    setShowModal(true);
    // Empêcher le scroll de la page en arrière-plan
    document.body.style.overflow = 'hidden';
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    
    // Préparer les données pour l'édition en s'assurant que les champs JSON sont des tableaux/objets
    const preparedData = { ...item };
    
    // S'assurer que members est un tableau
    if (typeof preparedData.members === 'string') {
      try {
        preparedData.members = JSON.parse(preparedData.members);
      } catch (e) {
        preparedData.members = [];
      }
    } else if (!Array.isArray(preparedData.members)) {
      preparedData.members = [];
    }
    
    // S'assurer que activities est un tableau
    if (typeof preparedData.activities === 'string') {
      try {
        preparedData.activities = JSON.parse(preparedData.activities);
      } catch (e) {
        preparedData.activities = [];
      }
    } else if (!Array.isArray(preparedData.activities)) {
      preparedData.activities = [];
    }
    
    // S'assurer que achievements est un tableau
    if (typeof preparedData.achievements === 'string') {
      try {
        preparedData.achievements = JSON.parse(preparedData.achievements);
      } catch (e) {
        preparedData.achievements = [];
      }
    } else if (!Array.isArray(preparedData.achievements)) {
      preparedData.achievements = [];
    }
    
    // S'assurer que socialMedia est un objet
    if (typeof preparedData.socialMedia === 'string') {
      try {
        preparedData.socialMedia = JSON.parse(preparedData.socialMedia);
      } catch (e) {
        preparedData.socialMedia = { facebook: '', instagram: '', linkedin: '' };
      }
    } else if (!preparedData.socialMedia || typeof preparedData.socialMedia !== 'object') {
      preparedData.socialMedia = { facebook: '', instagram: '', linkedin: '' };
    }
    
    setFormData(preparedData);
    setImageFile(null);
    setShowModal(true);
    // Empêcher le scroll de la page en arrière-plan
    document.body.style.overflow = 'hidden';
  };

  const handleViewDetails = (item, type) => {
    setViewingDetails({ item, type });
    document.body.style.overflow = 'hidden';
  };

  const handleDelete = async (id, type) => {
    // Special handling for users
    if (type === 'users') {
      const user = usersData.find(u => u.id === id);
      if (user) {
        // Prevent deleting the last admin
        if (user.role === 'admin' && usersData.filter(u => u.role === 'admin').length <= 1) {
          showNotification(
            'Impossible de supprimer le dernier administrateur du système',
            'error'
          );
          return;
        }
        
        // Enhanced confirmation for user deletion
        const confirmMessage = user.role === 'admin' 
          ? `ATTENTION: Vous êtes sur le point de supprimer l'administrateur "${user.username}" (${user.email}).\n\nCette action est irréversible et supprimera définitivement ce compte admin.\n\nÊtes-vous absolument sûr de vouloir continuer ?`
          : `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.username}" (${user.email}) ?\n\nCette action est irréversible.`;
          
        if (!window.confirm(confirmMessage)) return;
      }
    } else {
      // Standard confirmation for other items
      if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    }

    try {
      const response = await fetch(getApiUrl(`${type}/${id}`), {
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
      logger.error('Erreur lors de la suppression');
      showNotification(
        'Erreur lors de la suppression',
        'error'
      );
    }
  };

  const handleReorder = async (id, direction, type) => {
    try {
      const response = await fetch(getApiUrl(`${type}/${id}/reorder`), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: token 
        },
        body: JSON.stringify({ direction })
      });

      const result = await response.json();

      if (response.ok) {
        await fetchData();
        showNotification(
          'Ordre modifié avec succès!',
          'success'
        );
      } else {
        showNotification(
          result.message || 'Erreur lors de la modification de l\'ordre',
          'error'
        );
      }
    } catch (error) {
      logger.error('Erreur lors de la modification de l\'ordre');
      showNotification(
        'Erreur lors de la modification de l\'ordre',
        'error'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // User validation
    if (activeTab === 'users') {
      // Username length validation
      if (!formData.username || formData.username.length < 3) {
        showModalNotification(
          'Le nom d\'utilisateur doit contenir au moins 3 caractères',
          'error'
        );
        return;
      }

      // Check for duplicate username
      const existingUserByUsername = usersData.find(user => 
        user.username.toLowerCase() === formData.username?.toLowerCase() && 
        user.id !== editingItem?.id
      );
      if (existingUserByUsername) {
        showModalNotification(
          `Le nom d'utilisateur "${formData.username}" est déjà utilisé`,
          'error'
        );
        return;
      }

      // Check for duplicate email
      const existingUserByEmail = usersData.find(user => 
        user.email.toLowerCase() === formData.email?.toLowerCase() && 
        user.id !== editingItem?.id
      );
      if (existingUserByEmail) {
        showModalNotification(
          `L'adresse email "${formData.email}" est déjà utilisée`,
          'error'
        );
        return;
      }

      // Password validation for new users
      if (!editingItem && (!formData.password || formData.password.length < 6)) {
        showModalNotification(
          'Le mot de passe doit contenir au moins 6 caractères',
          'error'
        );
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email)) {
        showModalNotification(
          'Veuillez saisir une adresse email valide',
          'error'
        );
        return;
      }
    }

    // User validation
    if (activeTab === 'users') {
      // Username length validation
      if (!formData.username || formData.username.length < 3) {
        showNotification(
          'Le nom d\'utilisateur doit contenir au moins 3 caractères',
          'error'
        );
        return;
      }

      // Check for duplicate username
      const existingUserByUsername = usersData.find(user => 
        user.username.toLowerCase() === formData.username?.toLowerCase() && 
        user.id !== editingItem?.id
      );
      if (existingUserByUsername) {
        showNotification(
          `Le nom d'utilisateur "${formData.username}" est déjà utilisé`,
          'error'
        );
        return;
      }

      // Check for duplicate email
      const existingUserByEmail = usersData.find(user => 
        user.email.toLowerCase() === formData.email?.toLowerCase() && 
        user.id !== editingItem?.id
      );
      if (existingUserByEmail) {
        showNotification(
          `L'adresse email "${formData.email}" est déjà utilisée`,
          'error'
        );
        return;
      }

      // Password validation for new users
      if (!editingItem && (!formData.password || formData.password.length < 6)) {
        showNotification(
          'Le mot de passe doit contenir au moins 6 caractères',
          'error'
        );
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email)) {
        showNotification(
          'Veuillez saisir une adresse email valide',
          'error'
        );
        return;
      }
    }

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? getApiUrl(`${activeTab}/${editingItem.id || editingItem._id}`)
        : getApiUrl(activeTab);

      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Active tab:', activeTab);
      console.log('Method:', method);
      console.log('URL:', url);
      console.log('Form data before submission:', formData);

      // Special handling for users with badges
      if (activeTab === 'users') {
        console.log('User badge data:');
        console.log('is_president:', formData.is_president, typeof formData.is_president);
        console.log('is_representant:', formData.is_representant, typeof formData.is_representant);
        console.log('is_membre_adei:', formData.is_membre_adei, typeof formData.is_membre_adei);
        console.log('is_bureau_adei:', formData.is_bureau_adei, typeof formData.is_bureau_adei);
      }
      if ((activeTab === 'clubs' || activeTab === 'partners' || activeTab === 'adei-members' || activeTab === 'news' || activeTab === 'events') && (imageFile || formData.documentFile)) {
        const formDataObj = new FormData();
        
        // Add all form fields except files and metadata
        Object.keys(formData).forEach(key => {
          if (key !== '_id' && key !== 'id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'photo' && key !== 'documentFile') {
            if (key === 'activities' || key === 'achievements') {
              // Convert arrays to JSON string for FormData
              formDataObj.append(key, JSON.stringify(formData[key] || []));
            } else if (key === 'socialMedia') {
              // Convert socialMedia object to JSON string
              formDataObj.append(key, JSON.stringify(formData[key] || {}));
            } else if (key === 'members') {
              // Convert members array to JSON string
              formDataObj.append(key, JSON.stringify(formData[key] || []));
            } else if (key === 'clubId') {
              // Handle special organizer values
              if (formData[key] === 'adei' || formData[key] === 'ensa') {
                // Don't append clubId if it's a special value, let it be null
                formDataObj.append('organizer', formData[key] === 'adei' ? 'ADEI' : 'Administration ENSA Fès');
              } else if (formData[key]) {
                formDataObj.append(key, formData[key]);
              }
            } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
              formDataObj.append(key, formData[key]);
            }
          }
        });

        // Add image file
        if (imageFile) {
          if (activeTab === 'clubs') {
            formDataObj.append('image', imageFile);
          } else if (activeTab === 'partners') {
            formDataObj.append('logo', imageFile);
          } else if (activeTab === 'news' || activeTab === 'events') {
            formDataObj.append('image', imageFile);
          } else {
            formDataObj.append('photo', imageFile);
          }
        }

        // Add document file for news and events
        if (formData.documentFile && (activeTab === 'news' || activeTab === 'events')) {
          formDataObj.append('document', formData.documentFile);
        }

        const response = await fetch(url, {
          method,
          headers: { Authorization: token },
          body: formDataObj
        });

        const result = await response.json();

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
        // Handle non-file submissions
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
        delete cleanedData.documentFile; // Remove this from JSON submissions

        // Handle special organizer values
        if (cleanedData.clubId === 'adei' || cleanedData.clubId === 'ensa') {
          cleanedData.organizer = cleanedData.clubId === 'adei' ? 'ADEI' : 'Administration ENSA Fès';
          delete cleanedData.clubId; // Remove clubId instead of setting to null
        }

        const response = await fetch(url, {
          method,
          headers,
          body: JSON.stringify(cleanedData)
        });

        const result = await response.json();

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
      logger.error('Erreur lors de la soumission');
      showModalNotification(
        `Erreur lors de la ${editingItem ? 'modification' : 'création'}`,
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
    setModalNotification(null); // Clear modal notifications
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
        case 'partners': return `${action} un partenaire`;
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
              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Titre</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre de l'actualité"
                    required
                  />
                </div>
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
              </div>

              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Club organisateur</label>
                  <select
                    className="form-select form-input"
                    value={formData.clubId || ''}
                    onChange={(e) => setFormData({ ...formData, clubId: e.target.value || null })}
                  >
                    <option value="">Sélectionner un organisateur</option>
                    <option value="adei">ADEI</option>
                    <option value="ensa">Administration ENSA Fès</option>
                    {clubsData.map(club => (
                      <option key={club.id} value={club.id}>
                        {club.club}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Organisateur personnalisé</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.organizer || ''}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    placeholder="Nom de l'organisateur (optionnel)"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contenu</label>
                <textarea
                  className="form-textarea"
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Contenu détaillé de l'actualité..."
                  rows="6"
                  required
                />
              </div>

              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Image (optionnelle)</label>
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
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Document (optionnel)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, documentFile: e.target.files[0] })}
                    className="form-input"
                  />
                  {formData.document && (
                    <div style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Document actuel: {formData.document.split('/').pop()}
                    </div>
                  )}
                </div>
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
                    placeholder="Titre de l'événement"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <select
                    className="form-select form-input"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {CATEGORY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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

              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Club organisateur</label>
                  <select
                    className="form-select form-input"
                    value={formData.clubId || ''}
                    onChange={(e) => setFormData({ ...formData, clubId: e.target.value || null })}
                  >
                    <option value="">Sélectionner un organisateur</option>
                    <option value="adei">ADEI</option>
                    <option value="ensa">Administration ENSA Fès</option>
                    {clubsData.map(club => (
                      <option key={club.id} value={club.id}>
                        {club.club}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Organisateur personnalisé</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.organizer || ''}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    placeholder="Nom de l'organisateur (optionnel)"
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
                  placeholder="Amphithéâtre, Salle de conférence..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description détaillée de l'événement..."
                  rows="6"
                  required
                />
              </div>

              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Image (optionnelle)</label>
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
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Document (optionnel)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, documentFile: e.target.files[0] })}
                    className="form-input"
                  />
                  {formData.document && (
                    <div style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Document actuel: {formData.document.split('/').pop()}
                    </div>
                  )}
                </div>
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
                  <select
                    className="form-select form-input"
                    value={formData.annees_etude || ''}
                    onChange={(e) => setFormData({ ...formData, annees_etude: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner une année</option>
                    <option value="CP1">CP1</option>
                    <option value="CP2">CP2</option>
                    <option value="CI1">CI1</option>
                    <option value="CI2">CI2</option>
                    <option value="CI3">CI3</option>
                  </select>
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
                  {Array.isArray(formData.members) ? formData.members.map((member, index) => (
                    <div key={index} className="member-item">
                      <div className="form-grid three-cols">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Nom du membre"
                          value={member.name || ''}
                          onChange={(e) => {
                            const currentMembers = Array.isArray(formData.members) ? formData.members : [];
                            const newMembers = [...currentMembers];
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
                            const currentMembers = Array.isArray(formData.members) ? formData.members : [];
                            const newMembers = [...currentMembers];
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
                              const currentMembers = Array.isArray(formData.members) ? formData.members : [];
                              const newMembers = [...currentMembers];
                              newMembers[index] = { ...member, year: e.target.value };
                              setFormData({ ...formData, members: newMembers });
                            }}
                          />
                          <button
                            type="button"
                            className="remove-member-btn"
                            onClick={() => {
                              const currentMembers = Array.isArray(formData.members) ? formData.members : [];
                              const newMembers = currentMembers.filter((_, i) => i !== index);
                              setFormData({ ...formData, members: newMembers });
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : null}
                  <button
                    type="button"
                    className="add-member-btn"
                    onClick={() => {
                      const currentMembers = Array.isArray(formData.members) ? formData.members : [];
                      const newMembers = [...currentMembers, { name: '', role: '', year: '' }];
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
                {formData.type === 'prepa' ? (
                  <div className="form-group">
                    <label className="form-label">Responsable Pédagogique</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.responsablePedagogique || ''}
                      onChange={(e) => setFormData({ ...formData, responsablePedagogique: e.target.value })}
                      placeholder="Prof. Nom du responsable pédagogique"
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Délégué Filière</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.delegueFiliere || ''}
                      onChange={(e) => setFormData({ ...formData, delegueFiliere: e.target.value })}
                      placeholder="Nom du délégué filière"
                    />
                  </div>
                )}
              </div>

              {/* Téléphone du délégué filière pour les filières d'ingénierie */}
              {formData.type === 'filiere' && (
                <div className="form-group">
                  <label className="form-label">Téléphone du délégué filière</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.telDelegueFiliere || ''}
                    onChange={(e) => setFormData({ ...formData, telDelegueFiliere: e.target.value })}
                    placeholder="+212 6 12 34 56 78"
                  />
                </div>
              )}

              {/* Section pour les filières d'ingénierie */}
              {formData.type === 'filiere' && (
                <>
                  
                  {/* Délégués étudiants pour les 3 années */}
                  <div style={{ 
                    border: '2px solid #16A34A', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: 'var(--spacing-lg)', 
                    marginTop: 'var(--spacing-lg)',
                    background: 'var(--bg-secondary)'
                  }}>
                    <h3 style={{ color: '#16A34A', marginTop: 0, marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#16A34A"/>
                        <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="#16A34A"/>
                        <path d="M15 2L17 4L21 0" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Délégués Étudiants par Année (ex: {formData.abbreviation || 'FILIERE'}1, {formData.abbreviation || 'FILIERE'}2, {formData.abbreviation || 'FILIERE'}3)
                    </h3>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: 'var(--spacing-lg)' 
                    }}>
                      <div>
                        <h4 style={{ color: '#16A34A', marginBottom: 'var(--spacing-sm)' }}>1ère Année ({formData.abbreviation || 'FILIERE'}1)</h4>
                        <div className="form-group">
                          <label className="form-label">Nom complet</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.delegue_annee1 || ''}
                            onChange={(e) => setFormData({ ...formData, delegue_annee1: e.target.value })}
                            placeholder="Nom complet délégué 1ère année"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Téléphone</label>
                          <input
                            type="tel"
                            className="form-input"
                            value={formData.tel_delegue_annee1 || ''}
                            onChange={(e) => setFormData({ ...formData, tel_delegue_annee1: e.target.value })}
                            placeholder="+212 6 12 34 56 78"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h4 style={{ color: '#16A34A', marginBottom: 'var(--spacing-sm)' }}>2ème Année ({formData.abbreviation || 'FILIERE'}2)</h4>
                        <div className="form-group">
                          <label className="form-label">Nom complet</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.delegue_annee2 || ''}
                            onChange={(e) => setFormData({ ...formData, delegue_annee2: e.target.value })}
                            placeholder="Nom complet délégué 2ème année"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Téléphone</label>
                          <input
                            type="tel"
                            className="form-input"
                            value={formData.tel_delegue_annee2 || ''}
                            onChange={(e) => setFormData({ ...formData, tel_delegue_annee2: e.target.value })}
                            placeholder="+212 6 12 34 56 78"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h4 style={{ color: '#16A34A', marginBottom: 'var(--spacing-sm)' }}>3ème Année ({formData.abbreviation || 'FILIERE'}3)</h4>
                        <div className="form-group">
                          <label className="form-label">Nom complet</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.delegue_annee3 || ''}
                            onChange={(e) => setFormData({ ...formData, delegue_annee3: e.target.value })}
                            placeholder="Nom complet délégué 3ème année"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Téléphone</label>
                          <input
                            type="tel"
                            className="form-input"
                            value={formData.tel_delegue_annee3 || ''}
                            onChange={(e) => setFormData({ ...formData, tel_delegue_annee3: e.target.value })}
                            placeholder="+212 6 12 34 56 78"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Structure pour les classes préparatoires */}
              {formData.type === 'prepa' && (
                <>
                  {/* Responsable pédagogique commun */}
                  <div style={{ 
                    border: '2px solid var(--color-primary)', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: 'var(--spacing-lg)', 
                    marginTop: 'var(--spacing-lg)',
                    background: 'var(--bg-secondary)'
                  }}>
                    <h3 style={{ color: 'var(--color-primary)', marginTop: 0, marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="var(--color-primary)"/>
                        <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="var(--color-primary)"/>
                        <path d="M20 8H22V10H20V12H18V10H16V8H18V6H20V8Z" fill="var(--color-primary)"/>
                      </svg>
                      Responsable Pédagogique Commun
                    </h3>
                    
                    <div className="form-group">
                      <label className="form-label">Responsable pédagogique (toutes sections)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.responsablePedagogique || ''}
                        onChange={(e) => setFormData({ ...formData, responsablePedagogique: e.target.value })}
                        placeholder="Prof. Nom du responsable pédagogique"
                      />
                    </div>
                  </div>

                  {/* CP1 - Délégués étudiants */}
                  <div style={{ 
                    border: '2px solid #DC2626', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: 'var(--spacing-lg)', 
                    marginTop: 'var(--spacing-lg)',
                    background: 'var(--bg-secondary)'
                  }}>
                    <h3 style={{ color: '#DC2626', marginTop: 0, marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#DC2626"/>
                        <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="#DC2626"/>
                        <path d="M15 2L17 4L21 0" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Délégués Étudiants CP1 (Sections A1, B1, C1)
                    </h3>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: 'var(--spacing-lg)' 
                    }}>
                      <div>
                        <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section A1</h4>
                        <div className="form-group">
                          <label className="form-label">Nom complet</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.delegueA1 || ''}
                            onChange={(e) => setFormData({ ...formData, delegueA1: e.target.value })}
                            placeholder="Nom complet délégué A1"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Téléphone</label>
                          <input
                            type="tel"
                            className="form-input"
                            value={formData.telDelegueA1 || ''}
                            onChange={(e) => setFormData({ ...formData, telDelegueA1: e.target.value })}
                            placeholder="+212 6 12 34 56 78"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section B1</h4>
                        <div className="form-group">
                          <label className="form-label">Nom complet</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.delegueB1 || ''}
                            onChange={(e) => setFormData({ ...formData, delegueB1: e.target.value })}
                            placeholder="Nom complet délégué B1"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Téléphone</label>
                          <input
                            type="tel"
                            className="form-input"
                            value={formData.telDelegueB1 || ''}
                            onChange={(e) => setFormData({ ...formData, telDelegueB1: e.target.value })}
                            placeholder="+212 6 12 34 56 78"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section C1</h4>
                        <div className="form-group">
                          <label className="form-label">Nom complet</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.delegueC1 || ''}
                            onChange={(e) => setFormData({ ...formData, delegueC1: e.target.value })}
                            placeholder="Nom complet délégué C1"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Téléphone</label>
                          <input
                            type="tel"
                            className="form-input"
                            value={formData.telDelegueC1 || ''}
                            onChange={(e) => setFormData({ ...formData, telDelegueC1: e.target.value })}
                            placeholder="+212 6 12 34 56 78"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CP2 - Délégués étudiants */}
                  <div style={{ 
                    border: '2px solid #DC2626', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: 'var(--spacing-lg)', 
                    marginTop: 'var(--spacing-lg)',
                    background: 'var(--bg-secondary)'
                  }}>
                    <h3 style={{ color: '#DC2626', marginTop: 0, marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#DC2626"/>
                        <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="#DC2626"/>
                        <path d="M15 2L17 4L21 0" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Délégués Étudiants CP2 (Sections A2, B2, C2)
                    </h3>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: 'var(--spacing-lg)' 
                    }}>
                      <div>
                        <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section A2</h4>
                        <div className="form-group">
                          <label className="form-label">Nom complet</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.delegueA2 || ''}
                            onChange={(e) => setFormData({ ...formData, delegueA2: e.target.value })}
                            placeholder="Nom complet délégué A2"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Téléphone</label>
                          <input
                            type="tel"
                            className="form-input"
                            value={formData.telDelegueA2 || ''}
                            onChange={(e) => setFormData({ ...formData, telDelegueA2: e.target.value })}
                            placeholder="+212 6 12 34 56 78"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section B2</h4>
                        <div className="form-group">
                          <label className="form-label">Nom complet</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.delegueB2 || ''}
                            onChange={(e) => setFormData({ ...formData, delegueB2: e.target.value })}
                            placeholder="Nom complet délégué B2"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Téléphone</label>
                          <input
                            type="tel"
                            className="form-input"
                            value={formData.telDelegueB2 || ''}
                            onChange={(e) => setFormData({ ...formData, telDelegueB2: e.target.value })}
                            placeholder="+212 6 12 34 56 78"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section C2</h4>
                        <div className="form-group">
                          <label className="form-label">Nom complet</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.delegueC2 || ''}
                            onChange={(e) => setFormData({ ...formData, delegueC2: e.target.value })}
                            placeholder="Nom complet délégué C2"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Téléphone</label>
                          <input
                            type="tel"
                            className="form-input"
                            value={formData.telDelegueC2 || ''}
                            onChange={(e) => setFormData({ ...formData, telDelegueC2: e.target.value })}
                            placeholder="+212 6 12 34 56 78"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

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
                <label className="form-label">Contact du responsable</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.RespoContact || ''}
                  onChange={(e) => setFormData({ ...formData, RespoContact: e.target.value })}
                  placeholder="Email ou téléphone du responsable"
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

        case 'partners':
          return (
            <>
              <div className="form-group">
                <label className="form-label">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="form-input"
                />
                {(imageFile || formData.logo) && (
                  <div className="image-preview">
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : getImageUrl(formData.logo)}
                      alt="Preview"
                    />
                  </div>
                )}
              </div>
              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Nom du partenaire</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom de l'entreprise/organisation"
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
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du partenariat..."
                  rows="4"
                />
              </div>

              {/* Social Media Section */}
              <div className="form-group">
                <label className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  Réseaux sociaux
                </label>
                <div className="form-grid three-cols">
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', color: '#1877F2' }}>
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                      Facebook
                    </label>
                    <input
                      type="url"
                      className="form-input"
                      value={formData.facebook || ''}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="https://facebook.com/page"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', color: '#E4405F' }}>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                      Instagram
                    </label>
                    <input
                      type="url"
                      className="form-input"
                      value={formData.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="https://instagram.com/profile"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', color: '#25D366' }}>
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.whatsapp || ''}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="https://wa.me/212600000000 ou +212600000000"
                    />
                  </div>
                </div>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px', display: 'block' }}>
                  Pour WhatsApp, vous pouvez utiliser un lien wa.me ou un numéro de téléphone
                </small>
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
                    <option value={true}>Actif</option>
                    <option value={false}>Inactif</option>
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
              <div className="form-grid two-cols">
                <div className="form-group">
                  <label className="form-label">Nom d'utilisateur</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="ex: john_doe, marie.martin, user123"
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
                    placeholder="adresse@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Mot de passe {editingItem && '(laisser vide pour ne pas changer)'}
                </label>
                <div className="password-input-container" style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingItem ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                    required={!editingItem}
                    style={{ paddingRight: '45px' }}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: '5px'
                    }}
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
                {!editingItem && (
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Minimum 6 caractères recommandés
                  </small>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Rôle</label>
                <select
                  className="form-select form-input"
                  value={formData.role || 'user'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="user">Utilisateur Standard</option>
                  <option value="admin">Administrateur</option>
                </select>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {formData.role === 'admin' ? 
                    'Accès complet à l\'administration' : 
                    'Accès limité aux fonctionnalités utilisateur'
                  }
                </small>
              </div>

              {/* Badge Management Section */}
              <div className="form-group">
                <label className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Badges utilisateur
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_president || false}
                      onChange={(e) => setFormData({ ...formData, is_president: e.target.checked })}
                      style={{ margin: 0 }}
                    />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#dc2626' }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span>Président de club</span>
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_representant || false}
                      onChange={(e) => setFormData({ ...formData, is_representant: e.target.checked })}
                      style={{ margin: 0 }}
                    />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#2563eb' }}>
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                      <span>Représentant de classe</span>
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_membre_adei || false}
                      onChange={(e) => setFormData({ ...formData, is_membre_adei: e.target.checked })}
                      style={{ margin: 0 }}
                    />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#059669' }}>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                        <path d="M9 14l2 2 4-4"/>
                      </svg>
                      <span>Membre de l'ADEI</span>
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_bureau_adei || false}
                      onChange={(e) => setFormData({ ...formData, is_bureau_adei: e.target.checked })}
                      style={{ margin: 0 }}
                    />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#7c3aed' }}>
                        <path d="M3 21h18"/>
                        <path d="M5 21V7l8-4v18"/>
                        <path d="M19 21V11l-6-4"/>
                        <path d="M9 9v.01"/>
                        <path d="M9 12v.01"/>
                        <path d="M9 15v.01"/>
                        <path d="M9 18v.01"/>
                      </svg>
                      <span>Bureau de l'ADEI</span>
                    </span>
                  </label>
                </div>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px', display: 'block' }}>
                  Ces badges seront affichés sur le profil de l'utilisateur et ses feedbacks
                </small>
              </div>

              {/* Badge Schema Section */}
              <div className="form-group">
                <div style={{
                  padding: 'var(--spacing-lg)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  marginTop: 'var(--spacing-md)'
                }}>
                  <h4 style={{ 
                    margin: '0 0 var(--spacing-md) 0', 
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-size-md)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9,12l2,2 4,-4"/>
                    </svg>
                    Guide des badges
                  </h4>
                  
                  <div style={{
                    display: 'grid',
                    gap: 'var(--spacing-sm)',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#dc2626', flexShrink: 0 }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Président de club :</strong>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                          Utilisateur qui dirige un club étudiant officiel
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#2563eb', flexShrink: 0 }}>
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Représentant de classe :</strong>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                          Délégué élu pour représenter sa classe ou filière
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#059669', flexShrink: 0 }}>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                        <path d="M9 14l2 2 4-4"/>
                      </svg>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Membre de l'ADEI :</strong>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                          Membre actif de l'Association Des Élèves Ingénieurs
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#7c3aed', flexShrink: 0 }}>
                        <path d="M3 21h18"/>
                        <path d="M5 21V7l8-4v18"/>
                        <path d="M19 21V11l-6-4"/>
                        <path d="M9 9v.01"/>
                        <path d="M9 12v.01"/>
                        <path d="M9 15v.01"/>
                        <path d="M9 18v.01"/>
                      </svg>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Bureau de l'ADEI :</strong>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                          Membre du bureau exécutif de l'ADEI (Président, VP, Secrétaire, etc.)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: 'var(--spacing-md)',
                    padding: 'var(--spacing-sm)',
                    backgroundColor: 'var(--primary-light)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--primary)',
                    fontSize: 'var(--font-size-xs)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                      </svg>
                      <strong>Note importante :</strong>
                    </div>
                    <p style={{ margin: '4px 0 0 20px', color: 'var(--text-primary)' }}>
                      Les badges sont visibles sur le profil utilisateur et dans les feedbacks. 
                      Ils permettent d'identifier rapidement les rôles et responsabilités de chaque membre.
                    </p>
                  </div>
                </div>
              </div>

              {editingItem && (
                <div className="form-group">
                  <div style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <h4 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--text-primary)' }}>
                      Informations du compte
                    </h4>
                    <div style={{ display: 'grid', gap: 'var(--spacing-xs)', fontSize: '0.9rem' }}>
                      <div>
                        <strong>Créé le:</strong> {new Date(editingItem.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div>
                        <strong>Dernière modification:</strong> {new Date(editingItem.updatedAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div>
                        <strong>ID utilisateur:</strong> {editingItem.id}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                
                {/* Modal Notification */}
                {modalNotification && (
                  <div 
                    className={`modal-notification ${modalNotification.type}`}
                    style={{
                      padding: 'var(--spacing-md)',
                      margin: '0',
                      borderRadius: '0',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      backgroundColor: modalNotification.type === 'success' ? '#d4edda' : '#f8d7da',
                      color: modalNotification.type === 'success' ? '#155724' : '#721c24',
                      border: `1px solid ${modalNotification.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                      borderLeft: 'none',
                      borderRight: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      animation: 'slideDown 0.3s ease-out',
                      position: 'sticky',
                      top: '0',
                      zIndex: '10',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      {modalNotification.type === 'success' ? (
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      )}
                    </svg>
                    {modalNotification.message}
                  </div>
                )}
                
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
      case 'partners': return partnersData;
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
              <th>Organisateur</th>
              <th>Contenu</th>
              <th>Fichiers</th>
              <th>Ordre</th>
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
              <th>Organisateur</th>
              <th>Fichiers</th>
              <th>Ordre</th>
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
              <th>Délégué Filière</th>
              <th>Actions</th>
            </>
          );
        case 'partners':
          return (
            <>
              <th>Nom</th>
              <th>Description</th>
              <th>Site web</th>
              <th style={{ textAlign: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#1877F2' }}>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </th>
              <th style={{ textAlign: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#E4405F' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </th>
              <th style={{ textAlign: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#25D366' }}>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </th>
              <th>Statut</th>
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
              <th className="user-id-col">ID</th>
              <th className="username-col">Utilisateur</th>
              <th className="email-col">Email</th>
              <th className="role-col">Rôle</th>
              <th className="badge-col" title="Président de club">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#dc2626' }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </th>
              <th className="badge-col" title="Représentant de classe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#2563eb' }}>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </th>
              <th className="badge-col" title="Membre de l'ADEI">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#059669' }}>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  <path d="M9 14l2 2 4-4"/>
                </svg>
              </th>
              <th className="badge-col" title="Bureau de l'ADEI">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#7c3aed' }}>
                  <path d="M3 21h18"/>
                  <path d="M5 21V7l8-4v18"/>
                  <path d="M19 21V11l-6-4"/>
                  <path d="M9 9v.01"/>
                  <path d="M9 12v.01"/>
                  <path d="M9 15v.01"/>
                  <path d="M9 18v.01"/>
                </svg>
              </th>
              <th className="date-col">Créé le</th>
              <th className="actions-col">Actions</th>
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
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.image && (
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.title}
                      style={{ width: '40px', height: '30px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                  )}
                  <strong>{item.title}</strong>
                </div>
              </td>
              <td>{item.date}</td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '500' }}>
                    {getOrganizerName(item)}
                  </span>
                  {item.club && (
                    <small style={{ color: 'var(--text-muted)' }}>
                      Club: {item.club.club}
                    </small>
                  )}
                </div>
              </td>
              <td>{item.content?.substring(0, 60)}...</td>
              <td>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {item.image && (
                    <span className="badge info" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '2px' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                      Image
                    </span>
                  )}
                  {item.document && (
                    <span className="badge success" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '2px' }}>
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"/>
                        <polyline points="14,2 14,8 20,8"/>
                      </svg>
                      Doc
                    </span>
                  )}
                  {!item.image && !item.document && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
                  )}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleReorder(item.id || item._id, 'up', 'news')}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Monter"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18,15 12,9 6,15"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleReorder(item.id || item._id, 'down', 'news')}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Descendre"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6,9 12,15 18,9"/>
                    </svg>
                  </button>
                </div>
              </td>
              <td>
                <div className="admin-actions">
                  <button className="admin-action-btn view" onClick={() => handleViewDetails(item, 'news')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Voir
                  </button>
                  <button className="admin-action-btn edit" onClick={() => handleEdit(item)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'news')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Supprimer
                  </button>
                </div>
              </td>
            </>
          );
        case 'events':
          return (
            <>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.image && (
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.title}
                      style={{ width: '40px', height: '30px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <strong>{item.title}</strong>
                    {item.category && (
                      <div>
                        <span className="badge secondary" style={{ fontSize: '0.7rem' }}>
                          {getCategoryLabel(item.category)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td>{item.date}</td>
              <td>{item.time}</td>
              <td>{item.location}</td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '500' }}>
                    {getOrganizerName(item)}
                  </span>
                  {item.club && (
                    <small style={{ color: 'var(--text-muted)' }}>
                      Club: {item.club.club}
                    </small>
                  )}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {item.image && (
                    <span className="badge info" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '2px' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                      Image
                    </span>
                  )}
                  {item.document && (
                    <span className="badge success" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '2px' }}>
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"/>
                        <polyline points="14,2 14,8 20,8"/>
                      </svg>
                      Doc
                    </span>
                  )}
                  {!item.image && !item.document && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
                  )}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleReorder(item.id || item._id, 'up', 'events')}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Monter"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18,15 12,9 6,15"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleReorder(item.id || item._id, 'down', 'events')}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Descendre"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6,9 12,15 18,9"/>
                    </svg>
                  </button>
                </div>
              </td>
              <td>
                <div className="admin-actions">
                  <button className="admin-action-btn view" onClick={() => handleViewDetails(item, 'events')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Voir détails
                  </button>
                  <button className="admin-action-btn edit" onClick={() => handleEdit(item)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'events')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'clubs')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
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
              <td>{item.delegueFiliere || '-'}</td>
              <td>
                <div className="admin-actions">
                  <button className="admin-action-btn edit" onClick={() => handleEdit(item)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'filieres')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Supprimer
                  </button>
                </div>
              </td>
            </>
          );
        case 'partners':
          return (
            <>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src={getImageUrl(item.logo)} 
                    alt={item.name}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'contain' }}
                    onError={(e) => { e.target.src = '/images/ADEI.png'; }}
                  />
                  {item.name}
                </div>
              </td>
              <td>{item.description?.substring(0, 50)}{item.description?.length > 50 ? '...' : ''}</td>
              <td>
                {item.website ? (
                  <a href={item.website} target="_blank" rel="noopener noreferrer" className="link">
                    Visiter
                  </a>
                ) : (
                  '-'
                )}
              </td>
              {/* Social Media Columns */}
              <td style={{ textAlign: 'center' }}>
                {item.facebook ? (
                  <a href={item.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>-</span>
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                {item.instagram ? (
                  <a href={item.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#E4405F' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>-</span>
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                {item.whatsapp ? (
                  <a 
                    href={item.whatsapp.startsWith('http') ? item.whatsapp : `https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#25D366' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>-</span>
                )}
              </td>
              <td>
                <span className={`badge ${item.isActive ? 'success' : 'danger'}`}>
                  {item.isActive ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td>
                <div className="admin-actions">
                  <button className="admin-action-btn edit" onClick={() => handleEdit(item)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'partners')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Modifier
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'adei-members')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Voir
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item.id || item._id, 'feedbacks')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Supprimer
                  </button>
                </div>
              </td>
            </>
          );
        case 'users':
          return (
            <>
              <td className="user-id-col">{item.id}</td>
              <td className="username-col">{item.username}</td>
              <td className="email-col">
                <a href={`mailto:${item.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                  {item.email}
                </a>
              </td>
              <td className="role-col">
                <span className={`role-badge ${item.role}`}>
                  {item.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </td>
              {/* Badge Columns */}
              <td className="badge-col">
                {item.is_president ? (
                  <svg className="badge-icon active" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" title="Président de club">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ) : (
                  <svg className="badge-icon inactive" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                )}
              </td>
              <td className="badge-col">
                {item.is_representant ? (
                  <svg className="badge-icon active" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" title="Représentant de classe">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                ) : (
                  <svg className="badge-icon inactive" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                )}
              </td>
              <td className="badge-col">
                {item.is_membre_adei ? (
                  <svg className="badge-icon active" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" title="Membre de l'ADEI">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    <path d="M9 14l2 2 4-4"/>
                  </svg>
                ) : (
                  <svg className="badge-icon inactive" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    <path d="M9 14l2 2 4-4"/>
                  </svg>
                )}
              </td>
              <td className="badge-col">
                {item.is_bureau_adei ? (
                  <svg className="badge-icon active" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" title="Bureau de l'ADEI">
                    <path d="M3 21h18"/>
                    <path d="M5 21V7l8-4v18"/>
                    <path d="M19 21V11l-6-4"/>
                    <path d="M9 9v.01"/>
                    <path d="M9 12v.01"/>
                    <path d="M9 15v.01"/>
                    <path d="M9 18v.01"/>
                  </svg>
                ) : (
                  <svg className="badge-icon inactive" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18"/>
                    <path d="M5 21V7l8-4v18"/>
                    <path d="M19 21V11l-6-4"/>
                    <path d="M9 9v.01"/>
                    <path d="M9 12v.01"/>
                    <path d="M9 15v.01"/>
                    <path d="M9 18v.01"/>
                  </svg>
                )}
              </td>
              <td className="date-col">
                {new Date(item.createdAt).toLocaleDateString('fr-FR')}
              </td>
              <td className="actions-col">
                <div className="admin-actions">
                  <button 
                    className="admin-action-btn edit" 
                    onClick={() => handleEdit(item)}
                    title="Modifier"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    className="admin-action-btn delete" 
                    onClick={() => handleDelete(item.id, 'users')}
                    title="Supprimer"
                    disabled={item.role === 'admin' && usersData.filter(u => u.role === 'admin').length <= 1}
                    style={{
                      opacity: item.role === 'admin' && usersData.filter(u => u.role === 'admin').length <= 1 ? 0.5 : 1,
                      cursor: item.role === 'admin' && usersData.filter(u => u.role === 'admin').length <= 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
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
      <table className={`admin-table ${activeTab === 'users' ? 'users-table' : ''}`}>
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

  if (loading || user === null) {
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
        {['news', 'events', 'clubs', 'filieres', 'partners', 'adei-members', 'feedbacks', 'users'].map(tab => (
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
             tab === 'partners' ? 'Partenaires' :
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
          
          {/* User Statistics */}
          {activeTab === 'users' && (
            <div className="user-stats" style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              alignItems: 'center',
              marginLeft: 'auto',
              marginRight: 'var(--spacing-md)'
            }}>
              <div className="stat-item" style={{
                padding: '8px 12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem'
              }}>
                <strong style={{ color: 'var(--primary)' }}>
                  {usersData.filter(u => u.role === 'admin').length}
                </strong>
                <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>Admin(s)</span>
              </div>
              <div className="stat-item" style={{
                padding: '8px 12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem'
              }}>
                <strong style={{ color: 'var(--success)' }}>
                  {usersData.filter(u => u.role === 'user').length}
                </strong>
                <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>Utilisateur(s)</span>
              </div>
              <div className="stat-item" style={{
                padding: '8px 12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem'
              }}>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {usersData.length}
                </strong>
                <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>Total</span>
              </div>
            </div>
          )}
          
          {activeTab !== 'feedbacks' && (
            <button className="admin-add-btn" onClick={handleAdd}>
              + Ajouter
            </button>
          )}
        </div>

        {/* Badge Guide Section - Only for Users Tab */}
        {activeTab === 'users' && (
          <div style={{
            marginBottom: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{
              margin: '0 0 var(--spacing-md) 0',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              À propos des badges
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-md)',
              fontSize: 'var(--font-size-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#dc2626', flexShrink: 0 }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Président de club:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                    Vous dirigez un club étudiant
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#2563eb', flexShrink: 0 }}>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Représentant de classe:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                    Vous représentez votre classe
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#059669', flexShrink: 0 }}>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  <path d="M9 14l2 2 4-4"/>
                </svg>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Membre de l'ADEI:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                    Vous faites partie de l'association
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#7c3aed', flexShrink: 0 }}>
                  <path d="M3 21h18"/>
                  <path d="M5 21V7l8-4v18"/>
                  <path d="M19 21V11l-6-4"/>
                  <path d="M9 9v.01"/>
                  <path d="M9 12v.01"/>
                  <path d="M9 15v.01"/>
                  <path d="M9 18v.01"/>
                </svg>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Bureau de l'ADEI:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                    Vous êtes membre du bureau exécutif
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {renderTable()}
      </div>

      {renderModal()}

      {/* Details Modal */}
      {viewingDetails && (
        <div className="modal-overlay" onClick={() => {
          setViewingDetails(null);
          document.body.style.overflow = 'unset';
        }}>
          <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()} style={{
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div className="modal-header">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                  {viewingDetails.type === 'news' ? (
                    // Newspaper icon for news
                    <>
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z"/>
                      <path d="M10 6h8"/>
                      <path d="M10 10h8"/>
                      <path d="M10 14h8"/>
                      <path d="M10 18h8"/>
                    </>
                  ) : (
                    // Calendar icon for events
                    <>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </>
                  )}
                </svg>
                {viewingDetails.type === 'news' ? 'Détails de l\'actualité' : 'Détails de l\'événement'}
              </h2>
              <button 
                className="modal-close-btn" 
                onClick={() => {
                  setViewingDetails(null);
                  document.body.style.overflow = 'unset';
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body" style={{ padding: 'var(--spacing-xl)' }}>
              <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                
                {/* Title and basic info */}
                <div>
                  <h3 style={{ margin: '0 0 var(--spacing-md) 0', color: 'var(--primary)' }}>
                    {viewingDetails.item.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', marginBottom: 'var(--spacing-md)' }}>
                    <span className="badge info" style={{ display: 'flex', alignItems: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {viewingDetails.item.date}
                    </span>
                    {viewingDetails.type === 'events' && (
                      <>
                        <span className="badge secondary" style={{ display: 'flex', alignItems: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                          </svg>
                          {viewingDetails.item.time}
                        </span>
                        <span className="badge warning" style={{ display: 'flex', alignItems: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {viewingDetails.item.location}
                        </span>
                      </>
                    )}
                    {viewingDetails.item.category && (
                      <span className="badge primary">{viewingDetails.item.category}</span>
                    )}
                  </div>
                </div>

                {/* Organizer info */}
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    Organisateur
                  </h4>
                  <p style={{ margin: 0, fontWeight: '500' }}>
                    {getOrganizerName(viewingDetails.item)}
                  </p>
                  {viewingDetails.item.club && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Président: {viewingDetails.item.club.president}
                    </p>
                  )}
                </div>

                {/* Content/Description */}
                <div>
                  <h4 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    {viewingDetails.type === 'news' ? 'Contenu' : 'Description'}
                  </h4>
                  <div style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    lineHeight: '1.6'
                  }}>
                    {viewingDetails.type === 'news' ? viewingDetails.item.content : viewingDetails.item.description}
                  </div>
                </div>

                {/* Files */}
                {(viewingDetails.item.image || viewingDetails.item.document) && (
                  <div>
                    <h4 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                      </svg>
                      Fichiers attachés
                    </h4>
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                      
                      {viewingDetails.item.image && (
                        <div style={{
                          padding: 'var(--spacing-md)',
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)'
                        }}>
                          <h5 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21,15 16,10 5,21"/>
                            </svg>
                            Image
                          </h5>
                          <img
                            src={getImageUrl(viewingDetails.item.image)}
                            alt={viewingDetails.item.title}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '300px',
                              objectFit: 'contain',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-color)'
                            }}
                          />
                        </div>
                      )}

                      {viewingDetails.item.document && (
                        <div style={{
                          padding: 'var(--spacing-md)',
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)'
                        }}>
                          <h5 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"/>
                              <polyline points="14,2 14,8 20,8"/>
                            </svg>
                            Document
                          </h5>
                          <a
                            href={getImageUrl(viewingDetails.item.document)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn secondary"
                            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7,10 12,15 17,10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Télécharger le document
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
                    <div><strong>Créé le:</strong> {new Date(viewingDetails.item.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}</div>
                    <div><strong>Modifié le:</strong> {new Date(viewingDetails.item.updatedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}</div>
                    <div><strong>ID:</strong> {viewingDetails.item.id}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn secondary" 
                onClick={() => {
                  setViewingDetails(null);
                  document.body.style.overflow = 'unset';
                }}
              >
                Fermer
              </button>
              <button 
                className="btn" 
                onClick={() => {
                  setViewingDetails(null);
                  handleEdit(viewingDetails.item);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

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
              top: '100px',
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
