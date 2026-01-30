const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const runMigration = async () => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    
    // Check if columns exist before adding
    const tableDescription = await queryInterface.describeTable('news');
    
    const changes = [];
    
    // Add category column if it doesn't exist
    if (!tableDescription.category) {
      changes.push(
        queryInterface.addColumn('news', 'category', {
          type: DataTypes.STRING(100),
          allowNull: true,
          defaultValue: 'autre'
        })
      );
      console.log('✅ Ajout de la colonne category');
    }
    
    // Add order_display column if it doesn't exist
    if (!tableDescription.order_display) {
      changes.push(
        queryInterface.addColumn('news', 'order_display', {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
          comment: 'Ordre d\'affichage des actualités'
        })
      );
      console.log('✅ Ajout de la colonne order_display');
    }
    
    // Execute all changes
    if (changes.length > 0) {
      await Promise.all(changes);
      console.log('✅ Migration réussie: colonnes ajoutées à la table news');
    } else {
      console.log('ℹ️ Les colonnes existent déjà, aucune migration nécessaire');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
    // Don't throw, just log - in production this might already exist
    return false;
  }
};

module.exports = { runMigration };
