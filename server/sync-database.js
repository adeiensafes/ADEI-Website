const sequelize = require('./config/database');
const Filiere = require('./models/Filiere');

// WARNING: This will drop and recreate the table, losing all data
// Only use in development!
async function syncDatabase() {
  try {
    await Filiere.sync({ force: true });
    console.log('✅ Filiere table synced successfully with new fields');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
}

// Uncomment the line below to run the sync
// syncDatabase();

module.exports = syncDatabase;