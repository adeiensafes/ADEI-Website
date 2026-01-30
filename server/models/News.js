const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  clubId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'clubs',
      key: 'id'
    }
  },
  organizer: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'ADEI'
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  document: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  link: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Lien externe vers plus d\'informations'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'autre'
  },
  order_display: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Ordre d\'affichage des actualités'
  }
}, {
  tableName: 'news',
  timestamps: true
});

module.exports = News;
