const sequelize = require('../config/database');
const User = require('./User');
const News = require('./News');
const Event = require('./Event');
const Club = require('./Club');
const Feedback = require('./Feedback');
const ADEIMember = require('./ADEIMember');
const Filiere = require('./Filiere');
const Partner = require('./Partner');
const Cycle = require('./Cycle');
const AcademicYear = require('./AcademicYear');
const Section = require('./Section');

// Define model associations
News.belongsTo(Club, { foreignKey: 'clubId', as: 'club' });
Event.belongsTo(Club, { foreignKey: 'clubId', as: 'club' });
Club.hasMany(News, { foreignKey: 'clubId', as: 'news' });
Club.hasMany(Event, { foreignKey: 'clubId', as: 'events' });

// User and Feedback associations
User.hasMany(Feedback, { foreignKey: 'userId', as: 'feedbacks' });
Feedback.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Academic structure associations
// Cycle -> Filiere (one-to-many)
Cycle.hasMany(Filiere, { foreignKey: 'cycle_id', as: 'filieres' });
Filiere.belongsTo(Cycle, { foreignKey: 'cycle_id', as: 'cycle' });

// Cycle -> AcademicYear (one-to-many)
Cycle.hasMany(AcademicYear, { foreignKey: 'cycle_id', as: 'academicYears' });
AcademicYear.belongsTo(Cycle, { foreignKey: 'cycle_id', as: 'cycle' });

// Filiere -> AcademicYear (one-to-many, nullable for preparatory cycle)
Filiere.hasMany(AcademicYear, { foreignKey: 'filiere_id', as: 'academicYears' });
AcademicYear.belongsTo(Filiere, { foreignKey: 'filiere_id', as: 'filiere' });

// AcademicYear -> Section (one-to-many)
AcademicYear.hasMany(Section, { foreignKey: 'academic_year_id', as: 'sections' });
Section.belongsTo(AcademicYear, { foreignKey: 'academic_year_id', as: 'academicYear' });

const models = {
  User,
  News,
  Event,
  Club,
  Feedback,
  ADEIMember,
  Filiere,
  Partner,
  Cycle,
  AcademicYear,
  Section,
  sequelize
};

module.exports = models;