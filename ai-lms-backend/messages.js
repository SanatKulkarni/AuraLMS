const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('./db');

// Get student messages for a user
router.get('/student/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const db = await readDB();

  // Get all messages where the user is either the sender or the receiver and the message type is student
  const messages = db.messages.filter(m => (m.senderId === userId || m.receiverId === userId) && m.messageType === "student");

  res.json(messages);
});

// Get teacher messages for a user
router.get('/teacher/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const db = await readDB();

  // Get all messages where the user is either the sender or the receiver and the message type is teacher
  const messages = db.messages.filter(m => (m.senderId === userId || m.receiverId === userId) && m.messageType === "teacher");

  res.json(messages);
});


// Send a new message from a student
router.post('/student', async (req, res) => {
  const { senderId, receiverId, text, isAnnouncement } = req.body;
  const db = await readDB();

  const newMessage = {
    id: db.messages.length + 1, // Simple ID generation (not ideal for production)
    senderId: senderId,
    receiverId: receiverId,
    text: text,
    timestamp: new Date().toISOString(),
    isAnnouncement: isAnnouncement || false, // Default to false if not provided
    messageType: "student"
  };

  db.messages.push(newMessage);
  await writeDB(db);

  res.json({ message: 'Message sent successfully', newMessage: newMessage });
});

// Send a new message from a teacher
router.post('/teacher', async (req, res) => {
  const { senderId, receiverId, text, isAnnouncement } = req.body;
  const db = await readDB();

  const newMessage = {
    id: db.messages.length + 1, // Simple ID generation (not ideal for production)
    senderId: senderId,
    receiverId: receiverId,
    text: text,
    timestamp: new Date().toISOString(),
    isAnnouncement: isAnnouncement || false, // Default to false if not provided
    messageType: "teacher"
  };

  db.messages.push(newMessage);
  await writeDB(db);

  res.json({ message: 'Message sent successfully', newMessage: newMessage });
});

module.exports = router;