/*const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },  // Nom de l'utilisateur
  content: { type: String, required: true }, // Contenu du message
  timestamp: { type: Date, default: Date.now },  // Timestamp du message
  classId: { type: String, required: true },  // ID de la classe pour associer le message à une conversation spécifique
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;*/

// models/Message.jsconst mongoose = require('mongoose');
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  classId: { type: String, default: '1' },
  timestamp: { type: Date, default: Date.now }  // Champ pour la date
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
