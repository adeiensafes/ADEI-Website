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
  cycle_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'cycles',
      key: 'id'
    },
    comment: 'ID du cycle parent (cycle d\'ingénieur)'
  },
  responsable_pedagogique: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Responsable pédagogique de la filière (commun pour toutes les années)'
  },
  responsable_contact: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Contact du responsable (email ou téléphone)'
  },
  // Délégués étudiants pour chaque année de la filière
  delegue_annee1: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Nom du délégué étudiant pour la 1ère année (ex: GTR1)'
  },
  tel_delegue_annee1: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone du délégué étudiant 1ère année'
  },
  delegue_annee2: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Nom du délégué étudiant pour la 2ème année (ex: GTR2)'
  },
  tel_delegue_annee2: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone du délégué étudiant 2ème année'
  },
  delegue_annee3: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Nom du délégué étudiant pour la 3ème année (ex: GTR3)'
  },
  tel_delegue_annee3: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone du délégué étudiant 3ème année'
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
  }
}, {
  tableName: 'filieres',
  timestamps: true,
  indexes: [
    {
      fields: ['abbreviation']
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