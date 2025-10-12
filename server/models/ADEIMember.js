const mongoose = require('mongoose');

const adeiMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: [
      'President',
      'Vice President',
      'Secrétaire Générale',
      'Trésorier',
      'Conseillers',
      'IT Manager',
      'IT Team',
      'Représentant des étudiants étrangers',
      'Représentant des Lauréats',
      'Affaires Administratives',
      'Responsable Media',
      'Responsable Interne',
      'Responsables Sponsoring',
      'Responsables Création & Design'
    ]
  },
  email: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: '/images/default.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ADEIMember', adeiMemberSchema);
