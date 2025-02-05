const express = require('express');
const router = express.Router();
const { readDB } = require('./db');
const axios = require('axios');

const geminiApiKey = process.env.GEMINI_API_KEY;

// Get dynamic learning path for a student
router.get('/:studentId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API key is not defined' });
  }

  const db = await readDB();

  const studentAssignments = db.studentAssignments.filter(sa => sa.studentId === studentId);
  const studentQuizResults = db.studentQuizResults.filter(sq => sq.studentId === studentId);

  let prompt = `Analyze the following student's performance and provide a dynamic learning path:\n\n`;

  // Add assignment data to the prompt
  prompt += `Assignments:\n`;
  studentAssignments.forEach(sa => {
    const assignment = db.assignments.find(a => a.id === sa.assignmentId);
    prompt += `- ${assignment.name}: ${sa.score}\n`;
  });

  // Add quiz data to the prompt
  prompt += `\nQuizzes:\n`;
  studentQuizResults.forEach(sq => {
    const quiz = db.quizzes.find(q => q.id === sq.quizId);
    prompt += `- ${quiz.title}: ${sq.score}\n`;
  });

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;

    const learningPath = aiResponse;

    const learningPathData = {
      studentId: studentId,
      learningPath: learningPath
    };

    res.json(learningPathData);

  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

module.exports = router;