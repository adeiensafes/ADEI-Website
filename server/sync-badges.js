const sequelize = require('./config/database');
const User = require('./models/User');
const Feedback = require('./models/Feedback');

async function syncBadges() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    console.log('Synchronizing User model...');
    await User.sync({ alter: true });
    console.log('✅ User model synchronized');

    console.log('Synchronizing Feedback model...');
    await Feedback.sync({ alter: true });
    console.log('✅ Feedback model synchronized');

    // Test creating a user with badges
    console.log('Testing badge fields...');
    const testUser = await User.findOne();
    if (testUser) {
      console.log('Current user structure:', Object.keys(testUser.dataValues));
      console.log('Badge fields present:', {
        is_president: testUser.dataValues.hasOwnProperty('is_president'),
        is_representant: testUser.dataValues.hasOwnProperty('is_representant'),
        is_membre_adei: testUser.dataValues.hasOwnProperty('is_membre_adei'),
        is_bureau_adei: testUser.dataValues.hasOwnProperty('is_bureau_adei')
      });
    }

    console.log('✅ Badge synchronization complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error synchronizing badges:', error);
    process.exit(1);
  }
}

syncBadges();