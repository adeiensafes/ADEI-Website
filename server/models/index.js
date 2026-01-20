const sequelize = require('../config/database');
const User = require('./User');
const News = require('./News');
const Event = require('./Event');
const Club = require('./Club');
const Feedback = require('./Feedback');
const ADEIMember = require('./ADEIMember');
const Filiere = require('./Filiere');
const Partner = require('./Partner');

// Définir les associations si nécessaire
// Exemple : User.hasMany(News);

const models = {
  User,
  News,
  Event,
  Club,
  Feedback,
  ADEIMember,
  Filiere,
  Partner,
  sequelize
};

module.exports = models;