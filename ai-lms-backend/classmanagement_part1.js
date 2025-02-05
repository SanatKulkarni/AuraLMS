const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('./db');

// Add a student to a course
router.post('/:courseId/students', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const { studentId } = req.body;

  const db = await readDB();

  // Check if student and course exist
  const student = db.users.find(u => u.id === studentId && u.role === 'student');
  const course = db.courses.find(c => c.id === courseId);

  if (!student || !course) {
    return res.status(400).json({ error: 'Invalid studentId or courseId' });
  }

  // Check if already enrolled
  const alreadyEnrolled = db.classEnrollments.find(e => e.studentId === studentId && e.courseId === courseId);
  if (alreadyEnrolled) {
    return res.status(400).json({ error: 'Student already enrolled in this course' });
  }

  const newEnrollment = { studentId, courseId };
  db.classEnrollments.push(newEnrollment);
  await writeDB(db);

  res.json({ message: 'Student added to course successfully' });
});

// Remove a student from a course
router.delete('/:courseId/students/:studentId', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const studentId = parseInt(req.params.studentId);

  const db = await readDB();

  // Find the enrollment to remove
  const enrollmentIndex = db.classEnrollments.findIndex(e => e.studentId === studentId && e.courseId === courseId);

  if (enrollmentIndex === -1) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  db.classEnrollments.splice(enrollmentIndex, 1);
  await writeDB(db);

  res.json({ message: 'Student removed from course successfully' });
});