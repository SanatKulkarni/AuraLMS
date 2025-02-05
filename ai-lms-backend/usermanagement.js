const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('./db');
const mapTeacherRoutes = require('./mapteacher');
const unmapTeacherRoutes = require('./unmapteacher');

// Add a new teacher
router.post('/teachers', async (req, res) => {
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

  const newTeacher = {
    id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    role: 'teacher',
    username: username,
    password: password,
    name: name,
    permissions: ['upload_recordings', 'manage_enrollment', 'create_quizzes', 'access_reports']
  };

  db.users.push(newTeacher);
  await writeDB(db);

  res.status(201).json({ message: 'Teacher added successfully', newTeacher: newTeacher });
});

// Remove a user
router.delete('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  const db = await readDB();

  // Find the user to remove
  const userIndex = db.users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.users.splice(userIndex, 1);
  await writeDB(db);

  res.json({ message: 'User removed successfully' });
});

// Update user permissions
router.put('/:userId/permissions', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { permissions } = req.body;

  if (!Array.isArray(permissions)) {
    return res.status(400).json({ error: 'Permissions must be an array' });
  }

  const db = await readDB();

  // Find the user to update
  const userIndex = db.users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.users[userIndex].permissions = permissions;
  await writeDB(db);

  res.json({ message: 'User permissions updated successfully' });
});

router.use('/:teacherId/courses/:courseId', mapTeacherRoutes);
router.delete('/:teacherId/courses/:courseId', unmapTeacherRoutes);

module.exports = router;