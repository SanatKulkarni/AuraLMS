const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('./db');

// Add a new student
router.post('/', async (req, res) => {
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

  res.status(201).json({ message: 'Student added successfully', newStudent: newStudent });
});

module.exports = router;