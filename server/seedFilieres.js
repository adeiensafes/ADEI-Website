const sequelize = require('./config/database');
const Filiere = require('./models/Filiere');

const filieresSeed = [
  {
    name: 'Ingénierie des Systèmes Communicants et Sécurité Informatique',
    abbreviation: 'ISCSI',
    type: 'filiere',
    years: ['ISCSI1', 'ISCSI2', 'ISCSI3'],
    documentation: 'https://docs.ensaf.ac.ma/home/fil/ISCSN.pdf',
    drive: '',
    responsable: 'À définir',
    description: 'Formation spécialisée dans les systèmes communicants et la sécurité informatique.',
    order: 1
  },
  {
    name: 'Ingénierie Informatique, Intelligence Artificielle et Confiance Numérique',
    abbreviation: '3IACN',
    type: 'filiere',
    years: ['3IACN1', '3IACN2', '3IACN3'],
    documentation: 'https://docs.ensaf.ac.ma/home/fil/3IACN.pdf',
    drive: '',
    responsable: 'À définir',
    description: 'Formation en informatique avec spécialisation en IA et confiance numérique.',
    order: 2
  },
  {
    name: 'Ingénierie des Systèmes Embarqués et Intelligence Artificielle',
    abbreviation: 'ISEIA',
    type: 'filiere',
    years: ['ISEIA1', 'ISEIA2', 'ISEIA3'],
    documentation: 'https://docs.ensaf.ac.ma/home/fil/ISEIA.pdf',
    drive: '',
    responsable: 'À définir',
    description: 'Formation en systèmes embarqués et intelligence artificielle.',
    order: 3
  },
  {
    name: 'Ingénierie Logicielle et Intelligence Artificielle',
    abbreviation: 'ILIA',
    type: 'filiere',
    years: ['ILIA1', 'ILIA2', 'ILIA3'],
    documentation: 'https://docs.ensaf.ac.ma/home/fil/ILIAV2.pdf',
    drive: '',
    responsable: 'À définir',
    description: 'Formation en ingénierie logicielle et intelligence artificielle.',
    order: 4
  },
  {
    name: 'Génie du développement numérique et Cybersécurité',
    abbreviation: 'GDNC',
    type: 'filiere',
    years: ['GDNC1', 'GDNC2', 'GDNC3'],
    documentation: 'https://docs.ensaf.ac.ma/home/fil/DNC.pdf',
    drive: '',
    responsable: 'À définir',
    description: 'Formation en développement numérique et cybersécurité.',
    order: 5
  },
  {
    name: 'Ingénierie en Science de Données et Intelligence Artificielle',
    abbreviation: 'ISDIA',
    type: 'filiere',
    years: ['ISDIA1', 'ISDIA2', 'ISDIA3'],
    documentation: 'https://docs.ensaf.ac.ma/home/fil/ISDIAV3.pdf',
    drive: '',
    responsable: 'À définir',
    description: 'Formation en science de données et intelligence artificielle.',
    order: 6
  },
  {
    name: 'Génie Informatique',
    abbreviation: 'INFO',
    type: 'filiere',
    years: ['INFO1', 'INFO2', 'INFO3'],
    documentation: 'https://docs.ensaf.ac.ma/home/fil/INFO.pdf',
    drive: '',
    responsable: 'À définir',
    description: 'Formation généraliste en génie informatique.',
    order: 7
  },
  {
    name: 'Génie Mécanique',
    abbreviation: 'GM',
    type: 'filiere',
    years: ['GM1', 'GM2', 'GM3'],
    documentation: 'https://docs.ensaf.ac.ma/home/fil/GM.pdf',
    drive: '',
    responsable: 'À définir',
    description: 'Formation en génie mécanique et systèmes mécaniques.',
    order: 8
  },
  {
    name: 'Génie Energétique et systèmes intelligents',
    abbreviation: 'GESI',
    type: 'filiere',
    years: ['GESI1', 'GESI2', 'GESI3'],
    documentation: 'https://docs.ensaf.ac.ma/home/fil/GESI.pdf',
    drive: '',
    responsable: 'À définir',
    description: 'Formation en génie énergétique et systèmes intelligents.',
    order: 9
  },
  {
    name: 'Génie Mécatronique',
    abbreviation: 'GMT',
    type: 'filiere',
    years: ['GMT1', 'GMT2', 'GMT3'],
    documentation: 'https://docs.ensaf.ac.ma/home/fil/GMT.pdf',
    drive: '',
    responsable: 'À définir',
    description: 'Formation en génie mécatronique alliant mécanique, électronique et informatique.',
    order: 10
  },
  {
    name: 'Génie Industriel',
    abbreviation: 'GIND',
    type: 'filiere',
    years: ['GIND1', 'GIND2', 'GIND3'],
    documentation: 'https://docs.ensaf.ac.ma/home/fil/gind.pdf',
    drive: '',
    responsable: 'À définir',
    description: 'Formation en génie industriel et optimisation des processus.',
    order: 11
  },
  {
    name: 'Classes Préparatoires Intégrées',
    abbreviation: 'CPI',
    type: 'prepa',
    years: ['CPI1', 'CPI2'],
    documentation: '',
    drive: '',
    responsable: 'À définir',
    description: 'Cycle préparatoire de 2 ans préparant aux études d\'ingénieur.',
    order: 12
  }
];

async function seedFilieres() {
  try {
    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie.');

    // Synchroniser le modèle
    await Filiere.sync({ force: false });
    console.log('Table filières synchronisée.');

    // Vérifier si des filières existent déjà
    const existingCount = await Filiere.count();
    if (existingCount > 0) {
      console.log(`${existingCount} filières trouvées. Suppression pour réinitialiser...`);
      await Filiere.destroy({ where: {} });
    }

    // Insérer les nouvelles filières
    const createdFilieres = await Filiere.bulkCreate(filieresSeed);
    console.log(`${createdFilieres.length} filières créées avec succès!`);

    // Afficher les filières créées
    console.log('\nFilières créées:');
    createdFilieres.forEach(filiere => {
      console.log(`- ${filiere.abbreviation}: ${filiere.name}`);
    });

  } catch (error) {
    console.error('Erreur lors du seeding des filières:', error);
  } finally {
    await sequelize.close();
    console.log('\nConnexion fermée.');
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedFilieres();
}

module.exports = { seedFilieres, filieresSeed };