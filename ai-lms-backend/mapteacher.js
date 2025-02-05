const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('./db');

// Map a teacher to a course
router.post('/:teacherId/courses/:courseId', async (req, res) => {
  const teacherId = parseInt(req.params.teacherId);
  const courseId = parseInt(req.params.courseId);

  const db = await readDB();

  // Check if teacher and course exist
  const teacher = db.users.find(u => u.id === teacherId && u.role === 'teacher');
  const course = db.courses.find(c => c.id === courseId);

  if (!teacher || !course) {
    return res.status(400).json({ error: 'Invalid teacherId or courseId' });
  }

  // Check if mapping already exists
  const alreadyMapped = db.teacherCourses.find(tc => tc.teacherId === teacherId && tc.courseId === courseId);
  if (alreadyMapped) {
    return res.status(400).json({ error: 'Teacher already mapped to this course' });
  }

  const newMapping = { teacherId, courseId };
  db.teacherCourses.push(newMapping);
  await writeDB(db);

  res.status(201).json({ message: 'Teacher mapped to course successfully' });
});

module.exports = router;