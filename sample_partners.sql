-- Sample partners data for ADEI website
-- Run this after the partners table is created by Sequelize

INSERT INTO partners (name, description, website, logo, isActive, order_display, createdAt, updatedAt) VALUES
('ENSAF', 'École Nationale des Sciences Appliquées de Fès - Notre institution de tutelle', 'https://ensaf.ac.ma', '/images/ADEI.png', 1, 1, NOW(), NOW()),
('Université Sidi Mohamed Ben Abdellah', 'Université de tutelle offrant un cadre académique d\'excellence', 'https://usmba.ac.ma', '/images/ADEI.png', 1, 2, NOW(), NOW()),
('Microsoft', 'Partenaire technologique pour la formation et l\'innovation', 'https://microsoft.com', '/images/ADEI.png', 1, 3, NOW(), NOW()),
('Google', 'Partenaire innovation pour les projets étudiants', 'https://google.com', '/images/ADEI.png', 1, 4, NOW(), NOW()),
('IBM', 'Partenaire formation en intelligence artificielle et cloud', 'https://ibm.com', '/images/ADEI.png', 1, 5, NOW(), NOW()),
('Orange Maroc', 'Partenaire télécommunications et transformation digitale', 'https://orange.ma', '/images/ADEI.png', 1, 6, NOW(), NOW());