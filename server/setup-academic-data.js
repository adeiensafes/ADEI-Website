const { sequelize, Cycle, AcademicYear, Section, Filiere } = require('./models');

async function setupAcademicData() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully');

    console.log('Synchronizing database models...');
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized');

    // Check if data already exists
    const existingCycles = await Cycle.count();
    if (existingCycles > 0) {
      console.log('Academic data already exists. Skipping setup.');
      return;
    }

    console.log('Setting up academic structure...');

    // Create Cycle Préparatoire
    const cyclePreparatoire = await Cycle.create({
      name: 'Cycle Préparatoire',
      type: 'preparatoire',
      duration_years: 2,
      responsable_pedagogique: 'À définir',
      description: 'Cycle préparatoire de 2 ans avec sections A, B, C pour chaque année'
    });

    // Create Cycle d'Ingénieur
    const cycleIngenieur = await Cycle.create({
      name: 'Cycle d\'Ingénieur',
      type: 'ingenieur',
      duration_years: 3,
      description: 'Cycle d\'ingénieur avec plusieurs filières spécialisées'
    });

    // Create CP1 and CP2 years with sections
    const cp1 = await AcademicYear.create({
      name: 'CP1',
      year_number: 1,
      cycle_id: cyclePreparatoire.id,
      has_sections: true,
      order_display: 1
    });

    const cp2 = await AcademicYear.create({
      name: 'CP2',
      year_number: 2,
      cycle_id: cyclePreparatoire.id,
      has_sections: true,
      order_display: 2
    });

    // Create sections for CP1
    await Section.bulkCreate([
      { name: 'A', academic_year_id: cp1.id },
      { name: 'B', academic_year_id: cp1.id },
      { name: 'C', academic_year_id: cp1.id }
    ]);

    // Create sections for CP2
    await Section.bulkCreate([
      { name: 'A', academic_year_id: cp2.id },
      { name: 'B', academic_year_id: cp2.id },
      { name: 'C', academic_year_id: cp2.id }
    ]);

    // Create sample filières for Cycle d'Ingénieur
    const filieres = [
      { name: 'Génie des Télécommunications et Réseaux', abbreviation: 'GTR' },
      { name: 'Génie Informatique', abbreviation: 'GI' },
      { name: 'Génie Civil', abbreviation: 'GC' },
      { name: 'Génie Électrique', abbreviation: 'GE' },
      { name: 'Génie Mécanique', abbreviation: 'GM' }
    ];

    for (let i = 0; i < filieres.length; i++) {
      const filiere = await Filiere.create({
        name: filieres[i].name,
        abbreviation: filieres[i].abbreviation,
        cycle_id: cycleIngenieur.id,
        responsable_pedagogique: 'À définir',
        order_display: i + 1
      });

      // Create 3 years for each filière
      for (let year = 1; year <= 3; year++) {
        await AcademicYear.create({
          name: `${filieres[i].abbreviation}${year}`,
          year_number: year,
          cycle_id: cycleIngenieur.id,
          filiere_id: filiere.id,
          has_sections: false,
          order_display: (i * 3) + year + 10 // Offset to come after CP years
        });
      }
    }

    console.log('Academic structure setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up academic data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  setupAcademicData()
    .then(() => {
      console.log('Academic data setup completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Academic data setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupAcademicData };