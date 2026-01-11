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
    comment: 'Abréviation de la filière (ex: ISCSI, INFO, GM)'
  },
  type: {
    type: DataTypes.ENUM('filiere', 'prepa'),
    allowNull: false,
    defaultValue: 'filiere',
    comment: 'Type: filiere pour les filières d\'ingénierie, prepa pour les classes préparatoires'
  },
  years: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Liste des années d\'étude (ex: ["INFO1", "INFO2", "INFO3"])'
  },
  documentation: {
    type: DataTypes.STRING(1000),
    defaultValue: '',
    comment: 'Lien vers la documentation officielle'
  },
  drive: {
    type: DataTypes.STRING(1000),
    defaultValue: '',
    comment: 'Lien vers le drive de la filière'
  },
  delegate: {
    type: DataTypes.STRING(255),
    defaultValue: 'À définir',
    comment: 'Nom du délégué de la filière'
  },
  delegateContact: {
    type: DataTypes.STRING(255),
    defaultValue: '',
    comment: 'Contact du délégué (email ou téléphone)'
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
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