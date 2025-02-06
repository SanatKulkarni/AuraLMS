"use client";
import Quiz from '../../Components/Quiz';
import db from '../../ai-lms-backend/db.json';

const QuizPage = () => {
  const quizData = db.quizzes[0];

  return (
    <div className="container mx-auto mt-8">
      <Quiz quizData={quizData} />
    </div>
  );
};

export default QuizPage;