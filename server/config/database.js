const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  database: process.env.DB_NAME || 'adei_db',
  username: process.env.DB_USER || 'adei_user',
  password: process.env.DB_PASSWORD || 'adei_password',
  logging: false, // Désactiver complètement le logging SQL
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true
  }
});

module.exports = sequelize;