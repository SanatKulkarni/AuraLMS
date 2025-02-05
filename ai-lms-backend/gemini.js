const express = require('express');
const router = express.Router();
const axios = require('axios');
const { readDB } = require('./db');

const geminiApiKey = process.env.GEMINI_API_KEY;

// Gemini API endpoint (example)
router.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API key is not defined' });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

// Quiz evaluation endpoint
router.post('/quizzes/:quizId/evaluate', async (req, res) => {
  const { quizId } = req.params;
  const { studentId } = req.body;

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API key is not defined' });
  }

  const db = await readDB();
  const quiz = db.quizzes.find(q => q.id === parseInt(quizId));

  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  // Simulate student answers
  const studentAnswers = quiz.questions.map(() => Math.floor(Math.random() * 4));

  // Create prompt for Gemini
  let prompt = `Evaluate the following quiz and student's answers:\n\nQuiz Title: ${quiz.title}\n\n`;

  for (let i = 0; i < quiz.questions.length; i++) {
    const question = quiz.questions[i];
    prompt += `Question ${i + 1}: ${question.text}\n`;
    for (let j = 0; j < question.options.length; j++) {
      prompt += `${j + 1}. ${question.options[j]}\n`;
    }
    prompt += `Correct Answer: ${question.options[question.correctAnswer]}\n`;
    prompt += `Student's Answer: ${question.options[studentAnswers[i]]}\n\n`;
  }

  prompt += "Provide a concise evaluation of the student's performance, including the number of correct answers and areas for improvement.";

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ evaluation: aiResponse });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

module.exports = router;