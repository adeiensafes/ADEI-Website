const sequelize = require('../config/database');

async function addLastPasswordChangeField() {
  try {
    console.log('🔄 Adding lastPasswordChange field to users table...');

    // Add lastPasswordChange field to users table
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN lastPasswordChange DATETIME NULL 
      COMMENT 'Date du dernier changement de mot de passe'
    `);
    console.log('✅ lastPasswordChange field added to users table');

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    // Check if column already exists
    if (error.message.includes('Duplicate column') || error.message.includes('1060')) {
      console.log('⚠️  Column lastPasswordChange already exists in users table');
    } else {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  } finally {
    await sequelize.close();
  }
}

// Run migration if called directly
if (require.main === module) {
  addLastPasswordChangeField();
}

module.exports = addLastPasswordChangeField;
