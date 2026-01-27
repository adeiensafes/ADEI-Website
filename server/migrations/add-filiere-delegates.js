const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

async function addFilieresDelegates() {
  try {
    console.log('Adding delegate fields to filieres table...');
    
    // Add delegate fields for each year
    await sequelize.getQueryInterface().addColumn('filieres', 'delegue_annee1', {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Nom du délégué étudiant pour la 1ère année (ex: GTR1)'
    });
    
    await sequelize.getQueryInterface().addColumn('filieres', 'tel_delegue_annee1', {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Téléphone du délégué étudiant 1ère année'
    });
    
    await sequelize.getQueryInterface().addColumn('filieres', 'delegue_annee2', {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Nom du délégué étudiant pour la 2ème année (ex: GTR2)'
    });
    
    await sequelize.getQueryInterface().addColumn('filieres', 'tel_delegue_annee2', {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Téléphone du délégué étudiant 2ème année'
    });
    
    await sequelize.getQueryInterface().addColumn('filieres', 'delegue_annee3', {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Nom du délégué étudiant pour la 3ème année (ex: GTR3)'
    });
    
    await sequelize.getQueryInterface().addColumn('filieres', 'tel_delegue_annee3', {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Téléphone du délégué étudiant 3ème année'
    });
    
    console.log('✅ Delegate fields added successfully to filieres table');
  } catch (error) {
    console.error('❌ Error adding delegate fields:', error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addFilieresDelegates()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addFilieresDelegates;