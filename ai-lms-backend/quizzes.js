const express = require('express');
const router = express.Router();
const { readDB } = require('./db');

// Get quizzes for a student
router.get('/:studentId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const db = await readDB();

  // Get all quizzes
  const quizzes = db.quizzes;

  // Filter quizzes assigned to the student (for now, assume all quizzes are assigned to all students)
  // In a real application, you would have a way to assign specific quizzes to students
  const studentQuizzes = quizzes.map(quiz => ({
    ...quiz,
    studentId: studentId,
    status: 'Not Taken', // Default status
    score: null // Default score
  }));

  res.json(studentQuizzes);
});

module.exports = router;