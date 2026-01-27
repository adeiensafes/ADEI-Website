const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcademicYear = sequelize.define('AcademicYear', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nom de l\'année (ex: CP1, CP2, GTR1, GTR2, GTR3)'
  },
  year_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Numéro de l\'année (1, 2, 3)'
  },
  cycle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cycles',
      key: 'id'
    },
    comment: 'ID du cycle parent'
  },
  filiere_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'filieres',
      key: 'id'
    },
    comment: 'ID de la filière (null pour cycle préparatoire)'
  },
  has_sections: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Indique si cette année a des sections (A, B, C)'
  },
  delegate_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Nom du délégué étudiant (pour années sans sections)'
  },
  delegate_phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone du délégué étudiant (pour années sans sections)'
  },
  documentation: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    comment: 'Lien vers la documentation'
  },
  drive: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    comment: 'Lien vers le drive'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Indique si l\'année est active'
  },
  order_display: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Ordre d\'affichage'
  }
}, {
  tableName: 'academic_years',
  timestamps: true,
  indexes: [
    {
      fields: ['cycle_id']
    },
    {
      fields: ['filiere_id']
    },
    {
      fields: ['year_number']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['order_display']
    }
  ]
});

module.exports = AcademicYear;