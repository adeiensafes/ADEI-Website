const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Club = sequelize.define('Club', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  club: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  president: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  annees_etude: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tel: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  website: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  image: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  observations: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  activities: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  achievements: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  members: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  meetings: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  socialMedia: {
    type: DataTypes.JSON,
    defaultValue: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  }
}, {
  tableName: 'clubs',
  timestamps: true
});

module.exports = Club;
