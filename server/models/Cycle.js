const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cycle = sequelize.define('Cycle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nom du cycle (ex: Cycle Préparatoire, Cycle d\'Ingénieur)'
  },
  type: {
    type: DataTypes.ENUM('preparatoire', 'ingenieur'),
    allowNull: false,
    comment: 'Type de cycle'
  },
  duration_years: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Durée du cycle en années'
  },
  responsable_pedagogique: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Responsable pédagogique du cycle (pour cycle préparatoire)'
  },
  responsable_contact: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Contact du responsable (email ou téléphone)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description du cycle'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Indique si le cycle est actif'
  }
}, {
  tableName: 'cycles',
  timestamps: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = Cycle;