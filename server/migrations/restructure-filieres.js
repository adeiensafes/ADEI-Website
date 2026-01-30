const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

async function restructureFilieres() {
  try {
    console.log('🔄 Restructuring filieres table...');
    
    const queryInterface = sequelize.getQueryInterface();
    
    // 1. Supprimer les anciens champs non utilisés
    const fieldsToRemove = [
      'years', 'responsable', 'RespoContact',
      'delegueA1', 'telDelegueA1', 'delegueB1', 'telDelegueB1', 'delegueC1', 'telDelegueC1',
      'delegueA2', 'telDelegueA2', 'delegueB2', 'telDelegueB2', 'delegueC2', 'telDelegueC2',
      'delegueFiliere', 'telDelegueFiliere', 'responsablePedagogique'
    ];
    
    for (const field of fieldsToRemove) {
      try {
        await queryInterface.removeColumn('filieres', field);
        console.log(`✅ Removed column: ${field}`);
      } catch (error) {
        console.log(`⚠️  Column ${field} doesn't exist or already removed`);
      }
    }
    
    // 2. Ajouter le nouveau champ responsable pédagogique unifié
    await queryInterface.addColumn('filieres', 'responsable_pedagogique', {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Responsable pédagogique de la filière ou du cycle préparatoire'
    });
    
    await queryInterface.addColumn('filieres', 'responsable_contact', {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Contact du responsable pédagogique'
    });
    
    // 3. Ajouter les champs pour les Classes Préparatoires (CP1 et CP2)
    const cpFields = [
      // CP1
      { name: 'delegue_cp1_a', comment: 'Délégué CP1 Section A' },
      { name: 'tel_delegue_cp1_a', comment: 'Téléphone délégué CP1 Section A', type: 'tel' },
      { name: 'delegue_cp1_b', comment: 'Délégué CP1 Section B' },
      { name: 'tel_delegue_cp1_b', comment: 'Téléphone délégué CP1 Section B', type: 'tel' },
      { name: 'delegue_cp1_c', comment: 'Délégué CP1 Section C' },
      { name: 'tel_delegue_cp1_c', comment: 'Téléphone délégué CP1 Section C', type: 'tel' },
      
      // CP2
      { name: 'delegue_cp2_a', comment: 'Délégué CP2 Section A' },
      { name: 'tel_delegue_cp2_a', comment: 'Téléphone délégué CP2 Section A', type: 'tel' },
      { name: 'delegue_cp2_b', comment: 'Délégué CP2 Section B' },
      { name: 'tel_delegue_cp2_b', comment: 'Téléphone délégué CP2 Section B', type: 'tel' },
      { name: 'delegue_cp2_c', comment: 'Délégué CP2 Section C' },
      { name: 'tel_delegue_cp2_c', comment: 'Téléphone délégué CP2 Section C', type: 'tel' }
    ];
    
    for (const field of cpFields) {
      try {
        await queryInterface.addColumn('filieres', field.name, {
          type: field.type === 'tel' ? DataTypes.STRING(20) : DataTypes.STRING(255),
          allowNull: true,
          comment: field.comment
        });
        console.log(`✅ Added column: ${field.name}`);
      } catch (error) {
        console.log(`⚠️  Column ${field.name} already exists`);
      }
    }
    
    // 4. Les champs pour les filières d'ingénierie existent déjà (delegue_annee1, etc.)
    // Vérifier qu'ils existent
    const engineeringFields = [
      { name: 'delegue_annee1', comment: 'Délégué 1ère année de la filière' },
      { name: 'tel_delegue_annee1', comment: 'Téléphone délégué 1ère année', type: 'tel' },
      { name: 'delegue_annee2', comment: 'Délégué 2ème année de la filière' },
      { name: 'tel_delegue_annee2', comment: 'Téléphone délégué 2ème année', type: 'tel' },
      { name: 'delegue_annee3', comment: 'Délégué 3ème année de la filière' },
      { name: 'tel_delegue_annee3', comment: 'Téléphone délégué 3ème année', type: 'tel' }
    ];
    
    for (const field of engineeringFields) {
      try {
        await queryInterface.addColumn('filieres', field.name, {
          type: field.type === 'tel' ? DataTypes.STRING(20) : DataTypes.STRING(255),
          allowNull: true,
          comment: field.comment
        });
        console.log(`✅ Added column: ${field.name}`);
      } catch (error) {
        console.log(`✅ Column ${field.name} already exists`);
      }
    }
    
    console.log('✅ Filieres table restructured successfully');
    
  } catch (error) {
    console.error('❌ Error restructuring filieres table:', error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  restructureFilieres()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = restructureFilieres;