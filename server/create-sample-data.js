const { sequelize, Filiere } = require('./models');

async function createSampleData() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Check if data already exists
    const existingFilieres = await Filiere.count();
    if (existingFilieres > 0) {
      console.log('Sample data already exists. Skipping setup.');
      return;
    }

    console.log('Creating sample filières data...');

    // Create sample filières data that works with the existing structure
    const sampleFilieres = [
      {
        name: 'Génie des Télécommunications et Réseaux',
        abbreviation: 'GTR',
        type: 'filiere',
        years: ['GTR1', 'GTR2', 'GTR3'],
        responsable: 'Prof. Responsable GTR',
        delegueFiliere: 'Délégué GTR',
        telDelegueFiliere: '0600000001',
        description: 'Formation d\'ingénieur en télécommunications et réseaux',
        isActive: true,
        order_display: 1
      },
      {
        name: 'Génie Informatique',
        abbreviation: 'GI',
        type: 'filiere',
        years: ['GI1', 'GI2', 'GI3'],
        responsable: 'Prof. Responsable GI',
        delegueFiliere: 'Délégué GI',
        telDelegueFiliere: '0600000002',
        description: 'Formation d\'ingénieur en informatique',
        isActive: true,
        order_display: 2
      },
      {
        name: 'Génie Civil',
        abbreviation: 'GC',
        type: 'filiere',
        years: ['GC1', 'GC2', 'GC3'],
        responsable: 'Prof. Responsable GC',
        delegueFiliere: 'Délégué GC',
        telDelegueFiliere: '0600000003',
        description: 'Formation d\'ingénieur en génie civil',
        isActive: true,
        order_display: 3
      },
      {
        name: 'Classes Préparatoires',
        abbreviation: 'CP',
        type: 'prepa',
        years: ['CP1', 'CP2'],
        responsablePedagogique: 'Prof. Responsable Pédagogique CP',
        delegueA1: 'Délégué CP1 Section A',
        telDelegueA1: '0600000011',
        delegueB1: 'Délégué CP1 Section B',
        telDelegueB1: '0600000012',
        delegueC1: 'Délégué CP1 Section C',
        telDelegueC1: '0600000013',
        delegueA2: 'Délégué CP2 Section A',
        telDelegueA2: '0600000021',
        delegueB2: 'Délégué CP2 Section B',
        telDelegueB2: '0600000022',
        delegueC2: 'Délégué CP2 Section C',
        telDelegueC2: '0600000023',
        description: 'Classes préparatoires intégrées',
        isActive: true,
        order_display: 0
      }
    ];

    await Filiere.bulkCreate(sampleFilieres);
    console.log('Sample filières data created successfully!');
    
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createSampleData()
    .then(() => {
      console.log('Sample data creation completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Sample data creation failed:', error);
      process.exit(1);
    });
}

module.exports = { createSampleData };