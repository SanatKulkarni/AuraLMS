const express = require('express');
const router = express.Router();
const { readDB } = require('./db');

// Get assignments for a student
router.get('/:studentId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const db = await readDB();

  // Get all assignments
  const assignments = db.assignments;

  // Filter assignments assigned to the student (for now, assume all assignments are assigned to all students)
  // In a real application, you would have a way to assign specific assignments to students
  const studentAssignments = assignments.map(assignment => ({
    ...assignment,
    studentId: studentId,
    submissionStatus: 'Not Submitted', // Default status
    score: null // Default score
  }));

  res.json(studentAssignments);
});

module.exports = router;