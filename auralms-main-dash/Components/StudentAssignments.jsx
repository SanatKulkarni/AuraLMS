"use client";
import { useState, useEffect } from 'react';
import db from '../ai-lms-backend/db.json';

const StudentAssignments = () => {
  const [studentAssignments, setStudentAssignments] = useState(db.studentAssignments);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Student Assignments</h1>
      <div className="w-full max-w-6xl overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
              <th className="px-6 py-3 text-left text-lg font-semibold">Student ID</th>
              <th className="px-6 py-3 text-left text-lg font-semibold">Assignment ID</th>
              <th className="px-6 py-3 text-left text-lg font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            {studentAssignments.map((assignment, index) => (
              <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'}`}>
                <td className="px-6 py-4 text-gray-700 font-medium">{assignment.studentId}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{assignment.assignmentId}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{assignment.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAssignments;
