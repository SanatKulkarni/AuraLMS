const express = require('express');
const router = express.Router();
const { readDB } = require('./db');
const axios = require('axios');

const geminiApiKey = process.env.GEMINI_API_KEY;

// Get student performance
router.get('/:studentId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API key is not defined' });
  }

  const db = await readDB();

  const studentAssignments = db.studentAssignments.filter(sa => sa.studentId === studentId);
  const studentQuizResults = db.studentQuizResults.filter(sq => sq.studentId === studentId);

  let prompt = `Analyze the following student's performance and provide a list of strengths and weaknesses:\n\n`;

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

    // Extract strengths and weaknesses from the AI response (this might need some tweaking depending on the format of the response)
    const strengths = aiResponse.split("Strengths:")[1]?.split("Weaknesses:")[0]?.trim() || "Not available";
    const weaknesses = aiResponse.split("Weaknesses:")[1]?.trim() || "Not available";

    const performanceData = {
      studentId: studentId,
      strengths: strengths,
      weaknesses: weaknesses
    };

    res.json(performanceData);

  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

module.exports = router;