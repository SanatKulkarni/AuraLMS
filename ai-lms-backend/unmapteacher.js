const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('./db');

// Unmap a teacher from a course
router.delete('/:teacherId/courses/:courseId', async (req, res) => {
  const teacherId = parseInt(req.params.teacherId);
  const courseId = parseInt(req.params.courseId);

  const db = await readDB();

  // Find the mapping to remove
  const mappingIndex = db.teacherCourses.findIndex(tc => tc.teacherId === teacherId && tc.courseId === courseId);

  if (mappingIndex === -1) {
    return res.status(404).json({ error: 'Mapping not found' });
  }

  db.teacherCourses.splice(mappingIndex, 1);
  await writeDB(db);

  res.json({ message: 'Teacher unmapped from course successfully' });
});

module.exports = router;