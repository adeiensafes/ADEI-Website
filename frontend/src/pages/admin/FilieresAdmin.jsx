import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS, getApiUrl } from '../../config/api';
import AdminNavigation from '../../components/AdminNavigation';
import logger from '../../utils/logger';
import '../../styles/admin-panel.css';

const FilieresAdmin = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filieresData, setFilieresData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [modalNotification, setModalNotification] = useState(null);
  const [selectedCycle, setSelectedCycle] = useState('cp1');

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
    
    fetchFilieres();
  }, [token, user, navigate]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const showModalNotification = (message, type = 'success') => {
    setModalNotification({ message, type });
    setTimeout(() => setModalNotification(null), 5000);
  };

  const fetchFilieres = async () => {
    setLoading(true);
    try {
      const filieresResult = await fetch(API_ENDPOINTS.FILIERES).then(r => r.json());
      const filieres = filieresResult.success && Array.isArray(filieresResult.data) 
        ? filieresResult.data 
        : (Array.isArray(filieresResult) ? filieresResult : []);
      
      setFilieresData(Array.isArray(filieres) ? filieres : []);
    } catch (error) {
      logger.error('Erreur lors du chargement des filières');
      setFilieresData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setSelectedCycle('cp1');
    setFormData({
      name: '',
      abbreviation: '',
      type: 'filiere',
      responsable_pedagogique: '',
      responsable_contact: '',
      delegue_cp1_a: '',
      tel_delegue_cp1_a: '',
      delegue_cp1_b: '',
      tel_delegue_cp1_b: '',
      delegue_cp1_c: '',
      tel_delegue_cp1_c: '',
      delegue_cp2_a: '',
      tel_delegue_cp2_a: '',
      delegue_cp2_b: '',
      tel_delegue_cp2_b: '',
      delegue_cp2_c: '',
      tel_delegue_cp2_c: '',
      delegue_annee1: '',
      tel_delegue_annee1: '',
      delegue_annee2: '',
      tel_delegue_annee2: '',
      delegue_annee3: '',
      tel_delegue_annee3: '',
      documentation: '',
      drive: '',
      description: '',
      order_display: 0,
      isActive: true
    });
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    // Déterminer le cycle basé sur les données existantes
    if (item.type === 'prepa') {
      const hasCP1Data = item.delegue_cp1_a || item.delegue_cp1_b || item.delegue_cp1_c;
      const hasCP2Data = item.delegue_cp2_a || item.delegue_cp2_b || item.delegue_cp2_c;
      if (hasCP2Data && !hasCP1Data) {
        setSelectedCycle('cp2');
      } else {
        setSelectedCycle('cp1');
      }
    }
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) return;

    try {
      const response = await fetch(getApiUrl(`filieres/${id}`), {
        method: 'DELETE',
        headers: { Authorization: token }
      });

      const result = await response.json();

      if (response.ok) {
        await fetchFilieres();
        showNotification('Filière supprimée avec succès!', 'success');
      } else {
        showNotification(result.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      logger.error('Erreur lors de la suppression');
      showNotification('Erreur lors de la suppression', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? getApiUrl(`filieres/${editingItem.id || editingItem._id}`)
        : getApiUrl('filieres');

      const cleanedData = { ...formData };
      delete cleanedData._id;
      delete cleanedData.id;
      delete cleanedData.__v;
      delete cleanedData.createdAt;
      delete cleanedData.updatedAt;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(cleanedData)
      });

      const result = await response.json();

      if (response.ok) {
        await fetchFilieres();
        closeModal();
        showNotification(
          result.message || `${editingItem ? 'Modification' : 'Création'} réussie!`,
          'success'
        );
      } else {
        showModalNotification(
          result.message || `Erreur lors de la ${editingItem ? 'modification' : 'création'}`,
          'error'
        );
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
    setModalNotification(null);
    setSelectedCycle('cp1');
    document.body.style.overflow = 'unset';
  };

  const filteredFilieres = filieresData.filter(filiere =>
    filiere.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filiere.abbreviation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderModal = () => {
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
              className="modal-container filieres-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h2>{editingItem ? 'Modifier' : 'Ajouter'} une filière</h2>
                  <button type="button" className="modal-close" onClick={closeModal}>×</button>
                </div>
                
                {modalNotification && (
                  <div className={`modal-notification ${modalNotification.type}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {modalNotification.type === 'success' ? (
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      )}
                    </svg>
                    {modalNotification.message}
                  </div>
                )}
                
                <div className="modal-body">
                  <div className="form-grid">
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
                        <label className="form-label">Responsable Pédagogique</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.responsable_pedagogique || ''}
                          onChange={(e) => setFormData({ ...formData, responsable_pedagogique: e.target.value })}
                          placeholder="Prof. Nom du responsable"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contact du responsable</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.responsable_contact || ''}
                        onChange={(e) => setFormData({ ...formData, responsable_contact: e.target.value })}
                        placeholder="Email ou téléphone du responsable"
                      />
                    </div>

                    {/* Section pour les filières d'ingénierie */}
                    {formData.type === 'filiere' && (
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
                          </svg>
                          Délégués Étudiants par Année ({formData.abbreviation || 'FILIERE'}1, {formData.abbreviation || 'FILIERE'}2, {formData.abbreviation || 'FILIERE'}3)
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
                    )}

                    {/* Structure pour les classes préparatoires */}
                    {formData.type === 'prepa' && (
                      <>
                        {/* Sélecteur de cycle */}
                        <div className="form-group">
                          <label className="form-label">Cycle de classe préparatoire</label>
                          <select
                            className="form-select form-input"
                            value={selectedCycle}
                            onChange={(e) => setSelectedCycle(e.target.value)}
                            required
                          >
                            <option value="cp1">CP1 - Première année</option>
                            <option value="cp2">CP2 - Deuxième année</option>
                          </select>
                        </div>

                        {/* CP1 - Délégués étudiants */}
                        {selectedCycle === 'cp1' && (
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
                              </svg>
                              Délégués Étudiants CP1 (Sections A, B, C)
                            </h3>
                            
                            <div style={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'repeat(3, 1fr)', 
                              gap: 'var(--spacing-lg)' 
                            }}>
                              <div>
                                <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section A</h4>
                                <div className="form-group">
                                  <label className="form-label">Nom complet</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={formData.delegue_cp1_a || ''}
                                    onChange={(e) => setFormData({ ...formData, delegue_cp1_a: e.target.value })}
                                    placeholder="Nom complet délégué CP1-A"
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Téléphone</label>
                                  <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.tel_delegue_cp1_a || ''}
                                    onChange={(e) => setFormData({ ...formData, tel_delegue_cp1_a: e.target.value })}
                                    placeholder="+212 6 12 34 56 78"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section B</h4>
                                <div className="form-group">
                                  <label className="form-label">Nom complet</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={formData.delegue_cp1_b || ''}
                                    onChange={(e) => setFormData({ ...formData, delegue_cp1_b: e.target.value })}
                                    placeholder="Nom complet délégué CP1-B"
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Téléphone</label>
                                  <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.tel_delegue_cp1_b || ''}
                                    onChange={(e) => setFormData({ ...formData, tel_delegue_cp1_b: e.target.value })}
                                    placeholder="+212 6 12 34 56 78"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section C</h4>
                                <div className="form-group">
                                  <label className="form-label">Nom complet</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={formData.delegue_cp1_c || ''}
                                    onChange={(e) => setFormData({ ...formData, delegue_cp1_c: e.target.value })}
                                    placeholder="Nom complet délégué CP1-C"
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Téléphone</label>
                                  <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.tel_delegue_cp1_c || ''}
                                    onChange={(e) => setFormData({ ...formData, tel_delegue_cp1_c: e.target.value })}
                                    placeholder="+212 6 12 34 56 78"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CP2 - Délégués étudiants */}
                        {selectedCycle === 'cp2' && (
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
                              </svg>
                              Délégués Étudiants CP2 (Sections A, B, C)
                            </h3>
                            
                            <div style={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'repeat(3, 1fr)', 
                              gap: 'var(--spacing-lg)' 
                            }}>
                              <div>
                                <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section A</h4>
                                <div className="form-group">
                                  <label className="form-label">Nom complet</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={formData.delegue_cp2_a || ''}
                                    onChange={(e) => setFormData({ ...formData, delegue_cp2_a: e.target.value })}
                                    placeholder="Nom complet délégué CP2-A"
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Téléphone</label>
                                  <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.tel_delegue_cp2_a || ''}
                                    onChange={(e) => setFormData({ ...formData, tel_delegue_cp2_a: e.target.value })}
                                    placeholder="+212 6 12 34 56 78"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section B</h4>
                                <div className="form-group">
                                  <label className="form-label">Nom complet</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={formData.delegue_cp2_b || ''}
                                    onChange={(e) => setFormData({ ...formData, delegue_cp2_b: e.target.value })}
                                    placeholder="Nom complet délégué CP2-B"
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Téléphone</label>
                                  <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.tel_delegue_cp2_b || ''}
                                    onChange={(e) => setFormData({ ...formData, tel_delegue_cp2_b: e.target.value })}
                                    placeholder="+212 6 12 34 56 78"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <h4 style={{ color: '#DC2626', marginBottom: 'var(--spacing-sm)' }}>Section C</h4>
                                <div className="form-group">
                                  <label className="form-label">Nom complet</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={formData.delegue_cp2_c || ''}
                                    onChange={(e) => setFormData({ ...formData, delegue_cp2_c: e.target.value })}
                                    placeholder="Nom complet délégué CP2-C"
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Téléphone</label>
                                  <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.tel_delegue_cp2_c || ''}
                                    onChange={(e) => setFormData({ ...formData, tel_delegue_cp2_c: e.target.value })}
                                    placeholder="+212 6 12 34 56 78"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
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
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-input"
                        rows="3"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description de la filière"
                      />
                    </div>
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

  return (
    <>
      <AdminNavigation />
      <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <h1>Gestion des Filières</h1>
            <p>Gérer les filières d'ingénierie et classes préparatoires</p>
          </div>
          <button className="btn-primary" onClick={handleAdd}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Ajouter une filière
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {notification.type === 'success' ? (
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            )}
          </svg>
          {notification.message}
        </div>
      )}

      <div className="admin-content">
        <div className="admin-controls">
          <div className="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher une filière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Abréviation</th>
                <th>Type</th>
                <th>Responsable</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="loading-cell">Chargement...</td>
                </tr>
              ) : filteredFilieres.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-cell">
                    {searchTerm ? 'Aucune filière trouvée' : 'Aucune filière disponible'}
                  </td>
                </tr>
              ) : (
                filteredFilieres.map((filiere) => (
                  <tr key={filiere.id || filiere._id}>
                    <td>
                      <div className="cell-content">
                        <strong>{filiere.name}</strong>
                        {filiere.description && (
                          <small>{filiere.description.substring(0, 100)}...</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge">{filiere.abbreviation}</span>
                    </td>
                    <td>
                      <span className={`badge ${filiere.type === 'prepa' ? 'badge-warning' : 'badge-success'}`}>
                        {filiere.type === 'prepa' ? 'Classe Préparatoire' : 'Filière d\'ingénierie'}
                      </span>
                    </td>
                    <td>{filiere.responsable_pedagogique || 'Non défini'}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-action-btn edit"
                          onClick={() => handleEdit(filiere)}
                          title="Modifier cette filière"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => handleDelete(filiere.id || filiere._id)}
                          title="Supprimer cette filière"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {renderModal()}
    </div>
    </>
  );
};

export default FilieresAdmin;