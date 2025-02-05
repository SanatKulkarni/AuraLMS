const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('./db');

// Authentication endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await readDB();
  const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password.toLowerCase() === password.toLowerCase());

  if (user) {
    res.json({
      id: user.id,
      role: user.role,
      username: user.username,
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get user role endpoint
router.get('/role/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const db = await readDB();
  const user = db.users.find(u => u.id === userId);

  if (user) {
    res.json({ role: user.role });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Register a new student
router.post('/register', async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = await readDB();

  // Check if username already exists
  const existingUser = db.users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newStudent = {
    id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    role: 'student',
    username: username,
    password: password,
    name: name,
    permissions: ['enroll_classes', 'view_assessments', 'messaging']
  };

  db.users.push(newStudent);
  await writeDB(db);

  res.status(201).json({ message: 'Student registered successfully', newStudent: newStudent });
});

module.exports = router;