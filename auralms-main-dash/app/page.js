"use client";
import { useState, useEffect } from "react";
import Assignments from "@/Components/Assignments";
import StudentAssignments from "@/Components/StudentAssignments";
import StudentQuizResults from "@/Components/StudentQuizResults";
import Messages from "@/Components/Messages";
import UserManagement from "@/Components/UserManagement";
import CourtOrderUploadComponent from "@/Components/Teacherupload";
import Image from "next/image";
import { Moon, Sun } from "lucide-react"; // Icons for dark mode toggle
import logo from "@/public/logo.png";

export default function Home() {
  const [activeComponent, setActiveComponent] = useState("Assignments");
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  // Toggle theme and store in localStorage
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const componentsMap = {
    Assignments: <Assignments />,
    "User Management": <UserManagement />,
    "Upload file agent": <CourtOrderUploadComponent />,
    "Student Assignments": <StudentAssignments />,
    "Student Quiz Results": <StudentQuizResults />,
    Messages: <Messages />,
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Sidebar - Fixed Full Height */}
      <aside className="w-64 h-screen bg-blue-900 text-white p-6 shadow-lg flex flex-col justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <Image src={logo} alt="Logo" width={70} height={48} />
          <h2 className="text-lg font-semibold"></h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          {Object.keys(componentsMap).map((key) => (
            <button
              key={key}
              onClick={() => setActiveComponent(key)}
              className={`w-full p-3 rounded-md text-left transition ${
                activeComponent === key ? "bg-blue-600" : "hover:bg-blue-700"
              }`}
            >
              {key}
            </button>
          ))}
        </nav>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="mt-6 p-3 bg-gray-800 rounded-md flex items-center justify-center">
          {darkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-gray-200" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className={`shadow-lg rounded-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-2xl font-semibold mb-4">{activeComponent}</h2>
          {componentsMap[activeComponent]}
        </div>
      </main>
    </div>
  );
}
