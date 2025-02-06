"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Assignments = () => {
  const [assignments, setAssignments] = useState([
    {
      "id": 1,
      "name": "Assignment 1",
      "description": "Solve the following problems.",
      "courseId": 1,
      "dueDate": "2025-02-10"
    },
    {
      "id": 2,
      "name": "Assignment 2",
      "description": "Write an essay on a topic.",
      "courseId": 1,
      "dueDate": "2025-02-17"
    }
  ]);

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((assignment) => (
          <Link href="/quiz" key={assignment.id}>
            <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer">
              <h2 className="text-xl font-semibold mb-2 text-black">{assignment.name}</h2>
              <p className="text-black">{assignment.description}</p>
              <p className="text-sm text-gray-500 mt-2">Due Date: {assignment.dueDate}</p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                View Assignment
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Assignments;