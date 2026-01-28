import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const ImageUploadTest = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageSelect = (file, preview) => {
    setSelectedImage(file);
    setImagePreview(preview);
    console.log('Image selected:', file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    console.log('Image removed');
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      background: 'var(--card-bg)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)'
    }}>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
        Test de l'éditeur d'images
      </h2>
      
      <ImageUpload
        currentImage={null}
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
        label="Testez l'éditeur d'images"
      />
      
      {selectedImage && (
        <div style={{ marginTop: '20px', padding: '15px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>Image sélectionnée:</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '5px 0' }}>
            <strong>Nom:</strong> {selectedImage.name}
          </p>
          <p style={{ color: 'var(--text-secondary)', margin: '5px 0' }}>
            <strong>Taille:</strong> {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <p style={{ color: 'var(--text-secondary)', margin: '5px 0' }}>
            <strong>Type:</strong> {selectedImage.type}
          </p>
          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ color: 'var(--text-secondary)', margin: '5px 0' }}>
                <strong>Aperçu:</strong>
              </p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  borderRadius: '8px',
                  border: '2px solid var(--border-color)'
                }} 
              />
            </div>
          )}
        </div>
      )}
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: 'var(--primary-light)', 
        borderRadius: '8px',
        border: '1px solid var(--primary)'
      }}>
        <h4 style={{ color: 'var(--primary)', margin: '0 0 10px 0' }}>
          Fonctionnalités testées:
        </h4>
        <ul style={{ color: 'var(--text-primary)', margin: 0, paddingLeft: '20px' }}>
          <li>✅ Glisser-déposer d'images</li>
          <li>✅ Sélection de fichiers</li>
          <li>✅ Éditeur avec crop, zoom, rotation</li>
          <li>✅ Proportions prédéfinies (1:1, 4:3, 16:9)</li>
          <li>✅ Contrôles précis de position</li>
          <li>✅ Raccourcis clavier</li>
          <li>✅ Traitement canvas haute qualité</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploadTest;