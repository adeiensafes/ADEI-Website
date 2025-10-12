const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { authMiddleware, adminMiddleware, JWT_SECRET } = require('./middleware/auth');

const User = require('./models/User');
const News = require('./models/News');
const Event = require('./models/Event');
const Club = require('./models/Club');
const Feedback = require('./models/Feedback');
const ADEIMember = require('./models/ADEIMember');

const app = express();
const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adei_db';

app.use(cors());
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

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connecté avec succès');

  const adminExists = await User.findOne({ username: 'admin' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('password', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Utilisateur admin créé (username: admin, password: password)');
  }
})
.catch(err => console.error('Erreur de connexion MongoDB:', err));

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
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

app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des actualités' });
  }
});

app.post('/api/news', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'actualité' });
  }
});

app.put('/api/news/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'actualité' });
  }
});

app.delete('/api/news/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Actualité supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'actualité' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
  }
});

app.post('/api/events', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'événement' });
  }
});

app.put('/api/events/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'événement' });
  }
});

app.delete('/api/events/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Événement supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'événement' });
  }
});

app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
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
    const club = new Club(clubData);
    await club.save();
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du club' });
  }
});

app.put('/api/clubs/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const clubData = { ...req.body };
    if (req.file) {
      clubData.image = `/uploads/${req.file.filename}`;
    }

    if (clubData.activities && typeof clubData.activities === 'string') {
      try {
        clubData.activities = JSON.parse(clubData.activities);
      } catch (e) {
        clubData.activities = [];
      }
    }

    if (clubData.achievements && typeof clubData.achievements === 'string') {
      try {
        clubData.achievements = JSON.parse(clubData.achievements);
      } catch (e) {
        clubData.achievements = [];
      }
    }

    if (clubData.members && typeof clubData.members === 'string') {
      try {
        clubData.members = JSON.parse(clubData.members);
      } catch (e) {
        clubData.members = [];
      }
    }

    if (clubData.socialMedia && typeof clubData.socialMedia === 'string') {
      try {
        clubData.socialMedia = JSON.parse(clubData.socialMedia);
      } catch (e) {
        clubData.socialMedia = { facebook: '', instagram: '', linkedin: '' };
      }
    }

    const club = await Club.findByIdAndUpdate(req.params.id, clubData, { new: true });
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du club' });
  }
});

app.delete('/api/clubs/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (club && club.image) {
      const imagePath = path.join(__dirname, club.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await Club.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Club supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du club' });
  }
});

app.get('/api/feedbacks', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des feedbacks' });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ success: true, message: 'Votre feedback a été envoyé avec succès!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du feedback' });
  }
});

app.put('/api/feedbacks/:id/read', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du feedback' });
  }
});

app.delete('/api/feedbacks/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Feedback supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du feedback' });
  }
});

app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

app.post('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Ce nom d\'utilisateur existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      role: role || 'user'
    });
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

app.put('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const updateData = { username, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

app.delete('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user && user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Impossible de supprimer le dernier administrateur' });
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

app.get('/api/adei-members', async (req, res) => {
  try {
    const members = await ADEIMember.find().sort({ createdAt: -1 });
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
    const member = new ADEIMember(memberData);
    await member.save();
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
    const member = await ADEIMember.findByIdAndUpdate(req.params.id, memberData, { new: true });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du membre ADEI' });
  }
});

app.delete('/api/adei-members/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const member = await ADEIMember.findById(req.params.id);
    if (member && member.photo && member.photo !== '/images/default.jpg') {
      const photoPath = path.join(__dirname, member.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    await ADEIMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Membre ADEI supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du membre ADEI' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
