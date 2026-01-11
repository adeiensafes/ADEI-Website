import React, { useState, useEffect } from 'react';
import Typewriter from '../components/ui/Typewriter';
import { API_ENDPOINTS } from '../config/api';

const Feedbacks = () => {
  const [formData, setFormData] = useState({ name: '', email: '', type: 'avis', message: '' });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.FEEDBACKS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setSuccess(data.message);
      setFormData({ name: '', email: '', type: 'avis', message: '' });
      setTimeout(() => setSuccess(''), 5001);
    } catch (error) {
      setSuccess("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`page-container ${pageReady ? 'fade-in' : ''}`}>
      <div
        className="hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-contact.png)` }}
      >
        <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
          <h1>
            <Typewriter 
              words={[
                "Vos Feedbacks",
                "Partagez Vos Avis",
                "Vos Suggestions Comptent",
                "Améliorons Ensemble"
              ]} 
              speed={90} 
              delayBetweenWords={2000} 
              cursor={true} 
              cursorChar="|"
              className="typewriter-hero"
            />
          </h1>
          <p>Partagez vos avis, recommandations et suggestions avec nous</p>
        </div>
      </div>

      <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
        <div style={{
          display: 'grid',
          gap: 'var(--spacing-3xl)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
        }}>
          <div className={`card ${pageReady ? 'zoom-in' : ''}`} style={{ animationDelay: '0.3s' }}>
            <h2 className="text-primary mt-0">Envoyez-nous votre feedback</h2>

            {success && (
              <div className={`message ${success.includes('erreur') ? 'error' : 'success'}`}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nom complet
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Votre nom et prénom"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  Type de feedback
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="avis">Avis</option>
                  <option value="recommandation">Recommandation</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Partagez votre feedback avec nous..."
                  required
                  style={{ height: '200px', width: '100%' }}
                />
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
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le feedback'
                )}
              </button>
            </form>
          </div>

          <div className={`card ${pageReady ? 'zoom-in' : ''}`} style={{ animationDelay: '0.4s' }}>
            <h2 className="text-primary mt-0">Informations de contact</h2>

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3>📍 Adresse</h3>
              <p>
                École Nationale des Sciences Appliquées de Fès<br />
                Université Sidi Mohamed Ben Abdellah<br />
                Route d'Imouzzer, BP 72<br />
                30000 Fès, Maroc
              </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3>📞 Téléphone</h3>
              <p>
                <a href="tel:+212600000000" className="text-primary">
                  +212 600 000 000
                </a>
              </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3>📧 Email</h3>
              <p>
                <a href="mailto:contact@adei.org" className="text-primary">
                  contact@adei.org
                </a>
              </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3>🕐 Horaires</h3>
              <p>
                <strong>Lundi - Vendredi :</strong> 8h00 - 18h00<br />
                <strong>Samedi :</strong> 9h00 - 13h00<br />
                <strong>Dimanche :</strong> Fermé
              </p>
            </div>

            <div className="info-card">
              <h4>💡 Conseil</h4>
              <p>
                Votre feedback est précieux pour nous ! N'hésitez pas à partager vos avis,
                recommandations ou toute autre suggestion pour améliorer nos services.
              </p>
            </div>
          </div>
        </div>

        <div className={`card text-center highlight-card ${pageReady ? 'slide-up' : ''}`} style={{
          marginTop: 'var(--spacing-3xl)',
          animationDelay: '0.5s'
        }}>
          <h2 className="text-primary">Vous êtes étudiant à l'ENSAF ?</h2>
          <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xl)' }}>
            Découvrez comment vous pouvez vous impliquer dans la vie associative
            et profiter de toutes les opportunités qu'offre l'ADEI.
          </p>
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a href="/clubs" className="btn">
              Rejoindre un club
            </a>
            <a href="/events" className="btn secondary">
              Voir les événements
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;
