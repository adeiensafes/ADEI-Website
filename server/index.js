const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { authMiddleware, adminMiddleware, JWT_SECRET } = require('./middleware/auth');

// Import Sequelize models
const sequelize = require('./config/database');
const { Op } = require('sequelize');
const User = require('./models/User');
const News = require('./models/News');
const Event = require('./models/Event');
const Club = require('./models/Club');
const Feedback = require('./models/Feedback');
const ADEIMember = require('./models/ADEIMember');
const Filiere = require('./models/Filiere');
const Partner = require('./models/Partner');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: ["https://adei-ensaf.ma", "https://www.adei-ensaf.ma", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// Connexion à MySQL et synchronisation des modèles
async function connectWithRetry() {
  const maxRetries = 5; // Réduire les tentatives pour Vercel
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log('MySQL connecté avec succès');
      
      // Synchroniser les modèles avec la base de données
      await sequelize.sync({ force: false });
      console.log('Modèles synchronisés');

      // Créer l'utilisateur admin par défaut seulement s'il n'y en a aucun
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('password', 10);
        await User.create({
          username: 'admin',
          email: 'adei_ensa@gmail.com',
          password: hashedPassword,
          role: 'admin'
        });
        console.log('Utilisateur admin par défaut créé');
      } else {
        console.log(`${adminCount} administrateur(s) trouvé(s) dans la base de données`);
      }
      break;
    } catch (err) {
      retries++;
      console.log(`Tentative de connexion MySQL ${retries}/${maxRetries}...`);
      console.error('Erreur MySQL:', err.message);
      if (retries >= maxRetries) {
        console.error('Impossible de se connecter à MySQL après', maxRetries, 'tentatives');
        // Ne pas faire process.exit(1) sur Vercel
        break;
      }
      // Attendre 2 secondes avant de réessayer (moins que 5s)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

connectWithRetry();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API ADEI is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Test endpoint pour vérifier les routes API
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'API routes are working',
    availableRoutes: {
      'POST /api/login': 'Authentication endpoint',
      'GET /api/clubs': 'Get clubs data',
      'GET /api/events': 'Get events data',
      'GET /api/news': 'Get news data',
      'GET /api/filieres': 'Get filieres data'
    },
    timestamp: new Date().toISOString()
  });
});

// Route pour la racine
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'ADEI API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/test',
      login: '/api/login',
      clubs: '/api/clubs',
      events: '/api/events',
      news: '/api/news',
      filieres: '/api/filieres'
    },
    timestamp: new Date().toISOString()
  });
});

// Routes d'authentification
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

app.post('/api/logout', (req, res) => {
  res.json({ success: true });
});

// Cache simple pour éviter les requêtes répétitives
const cache = new Map();
const CACHE_DURATION = 30000; // 30 secondes

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

// Routes News
app.get('/api/news', async (req, res) => {
  try {
    const cacheKey = 'news';
    const cachedNews = getCachedData(cacheKey);
    
    if (cachedNews) {
      return res.json(cachedNews);
    }
    
    const news = await News.findAll({ order: [['createdAt', 'DESC']] });
    setCachedData(cacheKey, news);
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des actualités' });
  }
});

app.post('/api/news', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const news = await News.create(req.body);
    clearCache('news'); // Vider le cache
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'actualité' });
  }
});

app.put('/api/news/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [updated] = await News.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const news = await News.findByPk(req.params.id);
      res.json(news);
    } else {
      res.status(404).json({ message: 'Actualité non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'actualité' });
  }
});

app.delete('/api/news/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await News.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ success: true, message: 'Actualité supprimée' });
    } else {
      res.status(404).json({ message: 'Actualité non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'actualité' });
  }
});

// Routes Events
app.get('/api/events', async (req, res) => {
  try {
    const cacheKey = 'events';
    const cachedEvents = getCachedData(cacheKey);
    
    if (cachedEvents) {
      return res.json(cachedEvents);
    }
    
    const events = await Event.findAll({ order: [['createdAt', 'DESC']] });
    setCachedData(cacheKey, events);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
  }
});

app.post('/api/events', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'événement' });
  }
});

app.put('/api/events/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [updated] = await Event.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const event = await Event.findByPk(req.params.id);
      res.json(event);
    } else {
      res.status(404).json({ message: 'Événement non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'événement' });
  }
});

app.delete('/api/events/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Event.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ success: true, message: 'Événement supprimé' });
    } else {
      res.status(404).json({ message: 'Événement non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'événement' });
  }
});

// Routes Clubs
app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await Club.findAll({ order: [['createdAt', 'DESC']] });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des clubs' });
  }
});

app.post('/api/clubs', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const clubData = { ...req.body };
    if (req.file) {
      clubData.image = `/uploads/${req.file.filename}`;
    }

    // Parser les champs JSON si nécessaire
    if (typeof clubData.activities === 'string') {
      try {
        clubData.activities = JSON.parse(clubData.activities);
      } catch (e) {
        clubData.activities = [];
      }
    }

    if (typeof clubData.achievements === 'string') {
      try {
        clubData.achievements = JSON.parse(clubData.achievements);
      } catch (e) {
        clubData.achievements = [];
      }
    }

    if (typeof clubData.members === 'string') {
      try {
        clubData.members = JSON.parse(clubData.members);
      } catch (e) {
        clubData.members = [];
      }
    }

    if (typeof clubData.socialMedia === 'string') {
      try {
        clubData.socialMedia = JSON.parse(clubData.socialMedia);
      } catch (e) {
        clubData.socialMedia = { facebook: '', instagram: '', linkedin: '' };
      }
    }

    const club = await Club.create(clubData);
    res.status(201).json({ 
      success: true, 
      message: 'Club créé avec succès!', 
      club: club 
    });
  } catch (error) {
    console.error('Erreur création club:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création du club - Veuillez réessayer' 
    });
  }
});

app.put('/api/clubs/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log('=== DÉBUT MODIFICATION CLUB ===');
    console.log('ID du club:', req.params.id);
    console.log('Données reçues:', JSON.stringify(req.body, null, 2));
    
    const clubData = { ...req.body };
    if (req.file) {
      clubData.image = `/uploads/${req.file.filename}`;
    }

    // Parser les champs JSON si nécessaire
    if (typeof clubData.activities === 'string') {
      try {
        clubData.activities = JSON.parse(clubData.activities);
      } catch (e) {
        clubData.activities = [];
      }
    }

    if (typeof clubData.achievements === 'string') {
      try {
        clubData.achievements = JSON.parse(clubData.achievements);
      } catch (e) {
        clubData.achievements = [];
      }
    }

    if (typeof clubData.members === 'string') {
      try {
        clubData.members = JSON.parse(clubData.members);
      } catch (e) {
        clubData.members = [];
      }
    }

    if (typeof clubData.socialMedia === 'string') {
      try {
        clubData.socialMedia = JSON.parse(clubData.socialMedia);
      } catch (e) {
        clubData.socialMedia = { facebook: '', instagram: '', linkedin: '' };
      }
    }

    console.log('=== DÉBUT MODIFICATION CLUB ===');
    console.log('ID du club:', req.params.id);
    console.log('Type de l\'ID:', typeof req.params.id);
    
    // Vérifier si le club existe d'abord
    const existingClub = await Club.findByPk(req.params.id);
    console.log('Club existant trouvé:', existingClub ? 'Oui' : 'Non');
    
    if (!existingClub) {
      return res.status(404).json({ 
        success: false, 
        message: 'Club non trouvé - Impossible de modifier ce club' 
      });
    }
    
    const [updated] = await Club.update(clubData, { where: { id: req.params.id } });
    console.log('Nombre de lignes mises à jour:', updated);
    if (updated) {
      const club = await Club.findByPk(req.params.id);
      res.json({ 
        success: true, 
        message: 'Club modifié avec succès!', 
        club: club 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Club non trouvé - Impossible de modifier ce club' 
      });
    }
  } catch (error) {
    console.error('Erreur mise à jour club:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour du club - Veuillez réessayer' 
    });
  }
});

app.delete('/api/clubs/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id);
    if (club && club.image) {
      const imagePath = path.join(__dirname, club.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    const deleted = await Club.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ success: true, message: 'Club supprimé' });
    } else {
      res.status(404).json({ message: 'Club non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du club' });
  }
});

// Routes Feedbacks
// Public endpoint to get all feedbacks (for display on feedbacks page)
app.get('/api/feedbacks/public', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({ 
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'type', 'message', 'createdAt'] // Exclude email for privacy
    });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des feedbacks' });
  }
});

// Admin endpoint to get all feedbacks (with full details)
app.get('/api/feedbacks', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des feedbacks' });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json({ success: true, message: 'Votre feedback a été envoyé avec succès!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du feedback' });
  }
});

app.put('/api/feedbacks/:id/read', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [updated] = await Feedback.update({ read: true }, { where: { id: req.params.id } });
    if (updated) {
      const feedback = await Feedback.findByPk(req.params.id);
      res.json(feedback);
    } else {
      res.status(404).json({ message: 'Feedback non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du feedback' });
  }
});

app.delete('/api/feedbacks/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Feedback.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ success: true, message: 'Feedback supprimé' });
    } else {
      res.status(404).json({ message: 'Feedback non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du feedback' });
  }
});

// Routes Users
app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({ 
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']] 
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

app.post('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Ce nom d\'utilisateur ou cet email existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

app.put('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const updateData = { username, email, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const [updated] = await User.update(updateData, { where: { id: req.params.id } });
    if (updated) {
      const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
      res.json(user);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

app.delete('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user && user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Impossible de supprimer le dernier administrateur' });
      }
    }

    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ success: true, message: 'Utilisateur supprimé' });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

// Routes ADEI Members
app.get('/api/adei-members', async (req, res) => {
  try {
    const members = await ADEIMember.findAll({ order: [['createdAt', 'DESC']] });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des membres ADEI' });
  }
});

app.post('/api/adei-members', authMiddleware, adminMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const memberData = { ...req.body };
    if (req.file) {
      memberData.photo = `/uploads/${req.file.filename}`;
    }
    const member = await ADEIMember.create(memberData);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du membre ADEI' });
  }
});

app.put('/api/adei-members/:id', authMiddleware, adminMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const memberData = { ...req.body };
    if (req.file) {
      memberData.photo = `/uploads/${req.file.filename}`;
    }
    const [updated] = await ADEIMember.update(memberData, { where: { id: req.params.id } });
    if (updated) {
      const member = await ADEIMember.findByPk(req.params.id);
      res.json(member);
    } else {
      res.status(404).json({ message: 'Membre ADEI non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du membre ADEI' });
  }
});

app.delete('/api/adei-members/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const member = await ADEIMember.findByPk(req.params.id);
    if (member && member.photo && member.photo !== '/images/default.jpg') {
      const photoPath = path.join(__dirname, member.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    const deleted = await ADEIMember.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ success: true, message: 'Membre ADEI supprimé' });
    } else {
      res.status(404).json({ message: 'Membre ADEI non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du membre ADEI' });
  }
});

// Routes Filières
app.get('/api/filieres', async (req, res) => {
  try {
    const filieres = await Filiere.findAll({ 
      where: { isActive: true },
      order: [['order_display', 'ASC'], ['abbreviation', 'ASC']] 
    });
    res.json(filieres);
  } catch (error) {
    console.error('Error fetching filières:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des filières' });
  }
});

app.post('/api/filieres', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const filiere = await Filiere.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Filière créée avec succès!', 
      filiere: filiere 
    });
  } catch (error) {
    console.error('Erreur création filière:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création de la filière - Veuillez réessayer' 
    });
  }
});

app.put('/api/filieres/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [updated] = await Filiere.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const filiere = await Filiere.findByPk(req.params.id);
      res.json({ 
        success: true, 
        message: 'Filière modifiée avec succès!', 
        filiere: filiere 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Filière non trouvée - Impossible de modifier cette filière' 
      });
    }
  } catch (error) {
    console.error('Erreur mise à jour filière:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour de la filière - Veuillez réessayer' 
    });
  }
});

app.delete('/api/filieres/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Filiere.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ success: true, message: 'Filière supprimée' });
    } else {
      res.status(404).json({ message: 'Filière non trouvée' });
    }
  } catch (error) {
    console.error('Erreur suppression filière:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la filière' });
  }
});

// Routes Partners
app.get('/api/partners', async (req, res) => {
  try {
    const partners = await Partner.findAll({ 
      where: { isActive: true },
      order: [['order_display', 'ASC'], ['name', 'ASC']] 
    });
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des partenaires' });
  }
});

app.post('/api/partners', authMiddleware, adminMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const partnerData = { ...req.body };
    if (req.file) {
      partnerData.logo = `/uploads/${req.file.filename}`;
    }

    const partner = await Partner.create(partnerData);
    res.status(201).json({ 
      success: true, 
      message: 'Partenaire créé avec succès!', 
      partner: partner 
    });
  } catch (error) {
    console.error('Erreur création partenaire:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création du partenaire - Veuillez réessayer' 
    });
  }
});

app.put('/api/partners/:id', authMiddleware, adminMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const partnerData = { ...req.body };
    if (req.file) {
      partnerData.logo = `/uploads/${req.file.filename}`;
    }

    const [updated] = await Partner.update(partnerData, { where: { id: req.params.id } });
    if (updated) {
      const partner = await Partner.findByPk(req.params.id);
      res.json({ 
        success: true, 
        message: 'Partenaire modifié avec succès!', 
        partner: partner 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Partenaire non trouvé - Impossible de modifier ce partenaire' 
      });
    }
  } catch (error) {
    console.error('Erreur mise à jour partenaire:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour du partenaire - Veuillez réessayer' 
    });
  }
});

app.delete('/api/partners/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (partner && partner.logo && partner.logo !== '/images/default.jpg') {
      const logoPath = path.join(__dirname, partner.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    const deleted = await Partner.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ success: true, message: 'Partenaire supprimé' });
    } else {
      res.status(404).json({ message: 'Partenaire non trouvé' });
    }
  } catch (error) {
    console.error('Erreur suppression partenaire:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du partenaire' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});