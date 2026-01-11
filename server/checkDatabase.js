const sequelize = require('./config/database');
const Filiere = require('./models/Filiere');

async function checkDatabase() {
  try {
    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie.');

    // Synchroniser le modèle Filiere
    await Filiere.sync({ force: false });
    console.log('✅ Table filières synchronisée.');

    // Vérifier si des filières existent
    const count = await Filiere.count();
    console.log(`📊 Nombre de filières dans la base: ${count}`);

    if (count === 0) {
      console.log('⚠️  Aucune filière trouvée. Exécutez le script seedFilieres.js pour ajouter les données.');
    } else {
      // Afficher quelques filières
      const filieres = await Filiere.findAll({ limit: 5 });
      console.log('\n📚 Filières trouvées:');
      filieres.forEach(f => {
        console.log(`- ${f.abbreviation}: ${f.name} (${f.type})`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();