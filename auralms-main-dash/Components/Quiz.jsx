"use client";
import { useState } from 'react';

const Quiz = ({ quizData }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer.");
      return;
    }

    if (selectedAnswer === quizData.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setSelectedAnswer(null);

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-extrabold mb-4">Quiz Result</h2>
        <p className="text-lg">Your Score: {score} / {quizData.questions.length}</p>
        <button
          className="mt-6 px-6 py-3 bg-white text-purple-600 font-bold rounded-lg shadow-md hover:bg-gray-200 transition"
          onClick={handleRestartQuiz}
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-4">{quizData.title}</h2>
      <p className="text-lg mb-4">Question {currentQuestion + 1} / {quizData.questions.length}</p>
      <p className="text-xl font-semibold mb-4">{quizData.questions[currentQuestion].text}</p>
      <div className="space-y-2">
        {quizData.questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`w-full py-3 px-6 rounded-lg text-lg font-bold transition shadow-md hover:shadow-xl ${
              selectedAnswer === index ? 'bg-white text-purple-600' : 'bg-purple-700 hover:bg-purple-800'
            }`}
            onClick={() => handleAnswerSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        className="mt-6 w-full py-3 px-6 bg-white text-purple-600 font-bold rounded-lg shadow-md hover:bg-gray-200 transition disabled:opacity-50"
        onClick={handleNextQuestion}
        disabled={selectedAnswer === null}
      >
        Next Question
      </button>
    </div>
  );
};

export default Quiz;
