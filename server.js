/*const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const twig = require('twig');
const chatRoutes = require('./routes/chat');
const Message = require('./models/Message');  // Importer le modèle Message

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connexion à MongoDB réussie');
}).catch((err) => {
  console.log('Erreur de connexion à MongoDB', err);
});

// Middleware
app.use(cors());
app.use(express.json());

// Définir Twig comme moteur de templates
app.set('view engine', 'twig');
app.set('views', './views');

// Route pour afficher la page d'accueil
app.get('/', (req, res) => {
  res.render('index');
});

// Routes API pour le chat
app.use('/api/chat', chatRoutes);

// Socket.io pour la gestion des messages en temps réel
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');

  socket.on('sendMessage', async (data) => {
    const message = new Message({
      user: data.user,
      content: data.message,
      timestamp: new Date(),
    });

    try {
      await message.save();  // Sauvegarder le message dans MongoDB
      io.emit('receiveMessage', message);  // Émettre le message aux autres utilisateurs
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du message :', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });
});

// Démarrer le serveur
server.listen(3000, () => {
  console.log('Le serveur est en écoute sur le port 3000');
});
*/
// server.js// Dépendances
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const Message = require('./models/Message');  // Assurez-vous d'importer votre modèle

// Créer l'application Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);  // Crée une instance de Socket.io
app.use(express.static(path.join(__dirname, 'public')));

// Configuration du moteur Twig pour les templates
app.set('view engine', 'twig');
app.set('views', path.join(__dirname, 'views'));  // Dossier contenant le fichier 'index.twig'

// Middleware pour servir les fichiers statiques (CSS, JS, etc.) dans le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connexion à MongoDB réussie');
}).catch(err => {
  console.error('Erreur de connexion à MongoDB :', err);
});

// Route pour afficher la page principale
app.get('/', async (req, res) => {
  try {
    // Récupérer tous les anciens messages depuis MongoDB, triés par timestamp
    const messages = await Message.find().sort({ timestamp: 1 }); // Trier par date de création croissante
    res.render('index', { messages });  // Passer les messages à la vue
  } catch (err) {
    console.error('Erreur lors de la récupération des messages :', err);
    res.status(500).send('Erreur serveur');
  }
});

// Lorsque le serveur WebSocket reçoit une connexion
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');

  // Gérer l'événement 'sendMessage' du client
  socket.on('sendMessage', async (data) => {
    const { user, message, classId = '1' } = data;  // Utiliser '1' par défaut si classId est manquant

    // Vérifier si tous les champs sont présents
    if (!message) {
      console.log('Erreur : le contenu du message est manquant');
      return;
    }

    // Créer un nouveau message
    const newMessage = new Message({
      user,
      content: message,
      classId
    });

    // Sauvegarder le message dans la base de données
    try {
      await newMessage.save();
      console.log('Message enregistré avec succès');
      
      // Émettre le message à tous les clients connectés
      io.emit('receiveMessage', newMessage);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du message :', err);
    }
  });

  // Gérer la déconnexion d'un utilisateur
  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });
});

// Lancer le serveur sur le port 3000
server.listen(3000, () => {
  console.log('Le serveur est en écoute sur le port 3000');
});
