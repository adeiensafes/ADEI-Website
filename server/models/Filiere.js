const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Filiere = sequelize.define('Filiere', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Nom complet de la filière'
  },
  abbreviation: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Abréviation de la filière (ex: GTR, GI, GC, CP)'
  },
  type: {
    type: DataTypes.ENUM('filiere', 'prepa'),
    allowNull: false,
    defaultValue: 'filiere',
    comment: 'Type: filiere pour cycle ingénieur, prepa pour cycle préparatoire'
  },
  
  // Informations générales
  documentation: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    comment: 'Lien vers la documentation officielle'
  },
  drive: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    comment: 'Lien vers le drive de la filière'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description détaillée de la filière'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Indique si la filière est active'
  },
  order_display: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Ordre d\'affichage'
  },

  // Responsable pédagogique (commun pour toute la filière/cycle)
  responsable_pedagogique: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Responsable pédagogique de la filière ou du cycle préparatoire'
  },
  responsable_contact: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Contact du responsable pédagogique'
  },

  // === POUR LES CLASSES PRÉPARATOIRES (type = 'prepa') ===
  // CP1 - Section A
  delegue_cp1_a: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué CP1 Section A'
  },
  tel_delegue_cp1_a: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué CP1 Section A'
  },
  // CP1 - Section B
  delegue_cp1_b: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué CP1 Section B'
  },
  tel_delegue_cp1_b: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué CP1 Section B'
  },
  // CP1 - Section C
  delegue_cp1_c: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué CP1 Section C'
  },
  tel_delegue_cp1_c: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué CP1 Section C'
  },

  // CP2 - Section A
  delegue_cp2_a: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué CP2 Section A'
  },
  tel_delegue_cp2_a: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué CP2 Section A'
  },
  // CP2 - Section B
  delegue_cp2_b: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué CP2 Section B'
  },
  tel_delegue_cp2_b: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué CP2 Section B'
  },
  // CP2 - Section C
  delegue_cp2_c: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué CP2 Section C'
  },
  tel_delegue_cp2_c: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué CP2 Section C'
  },

  // === POUR LES FILIÈRES D'INGÉNIERIE (type = 'filiere') ===
  // 1ère année (ex: GTR1, GI1, GC1)
  delegue_annee1: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué 1ère année de la filière'
  },
  tel_delegue_annee1: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué 1ère année'
  },
  // 2ème année (ex: GTR2, GI2, GC2)
  delegue_annee2: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué 2ème année de la filière'
  },
  tel_delegue_annee2: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué 2ème année'
  },
  // 3ème année (ex: GTR3, GI3, GC3)
  delegue_annee3: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué 3ème année de la filière'
  },
  tel_delegue_annee3: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué 3ème année'
  }

}, {
  tableName: 'filieres',
  timestamps: true,
  indexes: [
    {
      fields: ['abbreviation']
    },
    {
      fields: ['type']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['order_display']
    }
  ]
});

module.exports = Filiere;