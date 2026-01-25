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
  responsable: {
    type: DataTypes.STRING(255),
    defaultValue: 'À définir',
    comment: 'Nom du responsable de la filière'
  },
  // Responsable pédagogique commun pour les classes préparatoires
  responsablePedagogique: {
    type: DataTypes.STRING(255),
    defaultValue: '',
    comment: 'Responsable pédagogique commun pour toutes les classes préparatoires'
  },
  // Délégués étudiants pour les sections CP
  delegueA1: {
    type: DataTypes.STRING(255),
    defaultValue: '',
    comment: 'Nom complet du délégué étudiant section A1'
  },
  telDelegueA1: {
    type: DataTypes.STRING(20),
    defaultValue: '',
    comment: 'Numéro de téléphone du délégué A1'
  },
  delegueB1: {
    type: DataTypes.STRING(255),
    defaultValue: '',
    comment: 'Nom complet du délégué étudiant section B1'
  },
  telDelegueB1: {
    type: DataTypes.STRING(20),
    defaultValue: '',
    comment: 'Numéro de téléphone du délégué B1'
  },
  delegueC1: {
    type: DataTypes.STRING(255),
    defaultValue: '',
    comment: 'Nom complet du délégué étudiant section C1'
  },
  telDelegueC1: {
    type: DataTypes.STRING(20),
    defaultValue: '',
    comment: 'Numéro de téléphone du délégué C1'
  },
  delegueA2: {
    type: DataTypes.STRING(255),
    defaultValue: '',
    comment: 'Nom complet du délégué étudiant section A2'
  },
  telDelegueA2: {
    type: DataTypes.STRING(20),
    defaultValue: '',
    comment: 'Numéro de téléphone du délégué A2'
  },
  delegueB2: {
    type: DataTypes.STRING(255),
    defaultValue: '',
    comment: 'Nom complet du délégué étudiant section B2'
  },
  telDelegueB2: {
    type: DataTypes.STRING(20),
    defaultValue: '',
    comment: 'Numéro de téléphone du délégué B2'
  },
  delegueC2: {
    type: DataTypes.STRING(255),
    defaultValue: '',
    comment: 'Nom complet du délégué étudiant section C2'
  },
  telDelegueC2: {
    type: DataTypes.STRING(20),
    defaultValue: '',
    comment: 'Numéro de téléphone du délégué C2'
  },
  // Délégué étudiant pour les filières (représentant des 3 ans)
  delegueFiliere: {
    type: DataTypes.STRING(255),
    defaultValue: '',
    comment: 'Nom complet du délégué étudiant représentant de la filière'
  },
  telDelegueFiliere: {
    type: DataTypes.STRING(20),
    defaultValue: '',
    comment: 'Numéro de téléphone du délégué de filière'
  },
  RespoContact: {
    type: DataTypes.STRING(255),
    defaultValue: '',
    comment: 'Contact du responsable (email ou téléphone)'
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