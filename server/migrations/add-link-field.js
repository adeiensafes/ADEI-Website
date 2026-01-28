const sequelize = require('../config/database');

async function addLinkField() {
  try {
    console.log('🔄 Adding link field to news and events tables...');

    // Add link field to news table
    await sequelize.query(`
      ALTER TABLE news 
      ADD COLUMN link VARCHAR(500) NULL 
      COMMENT 'Lien externe vers plus d informations'
    `);
    console.log('✅ Link field added to news table');

    // Add link field to events table
    await sequelize.query(`
      ALTER TABLE events 
      ADD COLUMN link VARCHAR(500) NULL 
      COMMENT 'Lien externe vers plus d informations'
    `);
    console.log('✅ Link field added to events table');

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Run migration if called directly
if (require.main === module) {
  addLinkField();
}

module.exports = addLinkField;