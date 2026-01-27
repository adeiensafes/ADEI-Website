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
    comment: 'Abréviation de la filière (ex: GTR, GI, GC)'
  },
  type: {
    type: DataTypes.ENUM('filiere', 'prepa'),
    allowNull: false,
    defaultValue: 'filiere',
    comment: 'Type: filiere pour cycle ingénieur, prepa pour cycle préparatoire'
  },
  cycle_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'cycles',
      key: 'id'
    },
    comment: 'ID du cycle parent'
  },
  years: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: 'Données JSON des années (legacy)'
  },
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
  responsable: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'À définir',
    comment: 'Responsable (legacy)'
  },
  RespoContact: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Contact du responsable'
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
  responsablePedagogique: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Responsable pédagogique de la filière'
  },
  // Délégués sections A, B, C pour année 1
  delegueA1: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué section A année 1'
  },
  telDelegueA1: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué section A année 1'
  },
  delegueB1: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué section B année 1'
  },
  telDelegueB1: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué section B année 1'
  },
  delegueC1: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué section C année 1'
  },
  telDelegueC1: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué section C année 1'
  },
  // Délégués sections A, B, C pour année 2
  delegueA2: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué section A année 2'
  },
  telDelegueA2: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué section A année 2'
  },
  delegueB2: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué section B année 2'
  },
  telDelegueB2: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué section B année 2'
  },
  delegueC2: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué section C année 2'
  },
  telDelegueC2: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué section C année 2'
  },
  // Délégué général de filière
  delegueFiliere: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Délégué général de la filière'
  },
  telDelegueFiliere: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone délégué général de la filière'
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
      fields: ['cycle_id']
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