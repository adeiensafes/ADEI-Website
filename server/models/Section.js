const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Section = sequelize.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Nom de la section (A, B, C)'
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'academic_years',
      key: 'id'
    },
    comment: 'ID de l\'année académique parent'
  },
  delegate_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Nom du délégué étudiant de la section'
  },
  delegate_phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone du délégué étudiant de la section'
  },
  delegate_email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Email du délégué étudiant de la section'
  },
  student_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Nombre d\'étudiants dans la section'
  },
  classroom: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Salle de classe principale'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Indique si la section est active'
  }
}, {
  tableName: 'sections',
  timestamps: true,
  indexes: [
    {
      fields: ['academic_year_id']
    },
    {
      fields: ['name']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = Section;