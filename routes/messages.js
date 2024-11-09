/*const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Récupérer tous les messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }); // Trier par date
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Envoyer un message (via API REST)
router.post('/', async (req, res) => {
  const { user, message } = req.body;

  try {
    const newMessage = new Message({
      user,
      content: message,
      timestamp: new Date(),
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
*/
const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

router.get('/:classId', async (req, res) => {
  const { classId } = req.params;
  try {
    const messages = await Message.find({ classId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
