const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  club: {
    type: String,
    required: true
  },
  president: {
    type: String,
    required: true
  },
  annees_etude: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  website: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  observations: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  activities: {
    type: [String],
    default: []
  },
  achievements: {
    type: [String],
    default: []
  },
  members: {
    type: [{
      name: String,
      role: String,
      year: String
    }],
    default: []
  },
  meetings: {
    type: String,
    default: ''
  },
  socialMedia: {
    facebook: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Club', clubSchema);
