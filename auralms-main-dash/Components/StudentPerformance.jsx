const express = require('express');
const router = express.Router();
const { readDB } = require('../ai-lms-backend/db');
const axios = require('axios');

const geminiApiKey = process.env.GEMINI_API_KEY;

// Get student performance
router.get('/studentId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API key is not defined' });
  }

  try {
    const db = await readDB();

    // Find student assignments and quiz results
    const studentAssignments = db.studentAssignments.filter(sa => sa.studentId === studentId);
    const studentQuizResults = db.studentQuizResults.filter(sq => sq.studentId === studentId);

    // If no data found for student, return an error
    if (studentAssignments.length === 0 && studentQuizResults.length === 0) {
      return res.status(404).json({ error: 'No assignments or quiz results found for this student' });
    }

    let prompt = `Analyze the following student's performance and provide a list of strengths and weaknesses:\n\n`;

    // Add assignment data to the prompt
    if (studentAssignments.length > 0) {
      prompt += `Assignments:\n`;
      studentAssignments.forEach(sa => {
        const assignment = db.assignments.find(a => a.id === sa.assignmentId);
        if (assignment) {
          prompt += `- ${assignment.name}: ${sa.score}\n`;
        }
      });
    }

    // Add quiz data to the prompt
    if (studentQuizResults.length > 0) {
      prompt += `\nQuizzes:\n`;
      studentQuizResults.forEach(sq => {
        const quiz = db.quizzes.find(q => q.id === sq.quizId);
        if (quiz) {
          prompt += `- ${quiz.title}: ${sq.score}\n`;
        }
      });
    }

    // Make request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;

    // Extract strengths and weaknesses from the AI response
    const strengths = aiResponse.split("Strengths:")[1]?.split("Weaknesses:")[0]?.trim() || "Not available";
    const weaknesses = aiResponse.split("Weaknesses:")[1]?.trim() || "Not available";

    // Prepare and send response data
    const performanceData = {
      studentId: studentId,
      strengths: strengths,
      weaknesses: weaknesses,
      assignments: studentAssignments.map(sa => ({
        assignmentId: sa.assignmentId,
        score: sa.score
      })),
      quizzes: studentQuizResults.map(sq => ({
        quizId: sq.quizId,
        score: sq.score
      }))
    };

    res.json(performanceData);

  } catch (error) {
    console.error('Error generating performance data:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

module.exports = router;
