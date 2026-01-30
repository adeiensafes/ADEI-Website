-- Script SQL complet pour créer la table filieres autonome (sans dépendances)
-- Exécuter dans phpMyAdmin ou MySQL Workbench

USE adei_db;

-- Supprimer la table existante si elle existe
DROP TABLE IF EXISTS filieres;

-- Créer la nouvelle table filieres complètement autonome
CREATE TABLE filieres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Informations de base
  name VARCHAR(500) NOT NULL COMMENT 'Nom complet de la filière',
  abbreviation VARCHAR(20) NOT NULL UNIQUE COMMENT 'Abréviation de la filière (ex: GTR, GI, GC, CP)',
  type ENUM('filiere', 'prepa') NOT NULL DEFAULT 'filiere' COMMENT 'Type: filiere pour cycle ingénieur, prepa pour cycle préparatoire',
  
  -- Informations générales
  documentation VARCHAR(1000) NULL COMMENT 'Lien vers la documentation officielle',
  drive VARCHAR(1000) NULL COMMENT 'Lien vers le drive de la filière',
  description TEXT NULL COMMENT 'Description détaillée de la filière',
  isActive BOOLEAN DEFAULT TRUE COMMENT 'Indique si la filière est active',
  order_display INT DEFAULT 0 COMMENT 'Ordre d\'affichage',
  
  -- Responsable pédagogique (commun pour toute la filière/cycle)
  responsable_pedagogique VARCHAR(255) NULL COMMENT 'Responsable pédagogique de la filière ou du cycle préparatoire',
  responsable_contact VARCHAR(255) NULL COMMENT 'Contact du responsable pédagogique (email ou téléphone)',
  
  -- === POUR LES CLASSES PRÉPARATOIRES (type = 'prepa') ===
  -- CP1 - Section A
  delegue_cp1_a VARCHAR(255) NULL COMMENT 'Délégué CP1 Section A',
  tel_delegue_cp1_a VARCHAR(20) NULL COMMENT 'Téléphone délégué CP1 Section A',
  -- CP1 - Section B
  delegue_cp1_b VARCHAR(255) NULL COMMENT 'Délégué CP1 Section B',
  tel_delegue_cp1_b VARCHAR(20) NULL COMMENT 'Téléphone délégué CP1 Section B',
  -- CP1 - Section C
  delegue_cp1_c VARCHAR(255) NULL COMMENT 'Délégué CP1 Section C',
  tel_delegue_cp1_c VARCHAR(20) NULL COMMENT 'Téléphone délégué CP1 Section C',
  
  -- CP2 - Section A
  delegue_cp2_a VARCHAR(255) NULL COMMENT 'Délégué CP2 Section A',
  tel_delegue_cp2_a VARCHAR(20) NULL COMMENT 'Téléphone délégué CP2 Section A',
  -- CP2 - Section B
  delegue_cp2_b VARCHAR(255) NULL COMMENT 'Délégué CP2 Section B',
  tel_delegue_cp2_b VARCHAR(20) NULL COMMENT 'Téléphone délégué CP2 Section B',
  -- CP2 - Section C
  delegue_cp2_c VARCHAR(255) NULL COMMENT 'Délégué CP2 Section C',
  tel_delegue_cp2_c VARCHAR(20) NULL COMMENT 'Téléphone délégué CP2 Section C',
  
  -- === POUR LES FILIÈRES D'INGÉNIERIE (type = 'filiere') ===
  -- 1ère année (ex: GTR1, GI1, GC1)
  delegue_annee1 VARCHAR(255) NULL COMMENT 'Délégué 1ère année de la filière',
  tel_delegue_annee1 VARCHAR(20) NULL COMMENT 'Téléphone délégué 1ère année',
  -- 2ème année (ex: GTR2, GI2, GC2)
  delegue_annee2 VARCHAR(255) NULL COMMENT 'Délégué 2ème année de la filière',
  tel_delegue_annee2 VARCHAR(20) NULL COMMENT 'Téléphone délégué 2ème année',
  -- 3ème année (ex: GTR3, GI3, GC3)
  delegue_annee3 VARCHAR(255) NULL COMMENT 'Délégué 3ème année de la filière',
  tel_delegue_annee3 VARCHAR(20) NULL COMMENT 'Téléphone délégué 3ème année',
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Index pour optimiser les requêtes
  INDEX idx_abbreviation (abbreviation),
  INDEX idx_type (type),
  INDEX idx_isActive (isActive),
  INDEX idx_order_display (order_display)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer les données de base
INSERT INTO filieres (name, abbreviation, type, description, order_display, isActive) VALUES
('Cycle Préparatoire', 'CP', 'prepa', 'Cycle préparatoire intégré de 2 ans avec 3 sections par année (A, B, C)', 1, TRUE),
('Génie Informatique', 'GI', 'filiere', 'Filière spécialisée en informatique et développement logiciel', 2, TRUE),
('Génie Civil', 'GC', 'filiere', 'Filière spécialisée en génie civil et construction', 3, TRUE),
('Génie Électrique', 'GE', 'filiere', 'Filière spécialisée en génie électrique et électronique', 4, TRUE),
('Génie Mécanique', 'GM', 'filiere', 'Filière spécialisée en génie mécanique et mécatronique', 5, TRUE),
('Génie des Télécommunications et Réseaux', 'GTR', 'filiere', 'Filière spécialisée en télécommunications et réseaux informatiques', 6, TRUE);

-- Vérifier la structure créée
DESCRIBE filieres;

-- Afficher les données insérées
SELECT id, name, abbreviation, type, description FROM filieres ORDER BY order_display;