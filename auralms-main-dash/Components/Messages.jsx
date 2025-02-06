"use client";
import { useState, useEffect } from 'react';
import db from '../ai-lms-backend/db.json';

const Messages = () => {
  const [messages, setMessages] = useState(db.messages);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Messages</h1>
      <div className="w-full max-w-4xl space-y-6 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600 font-semibold">Sender ID: {message.senderId}</p>
              <p className="text-gray-600 font-semibold">Receiver ID: {message.receiverId}</p>
            </div>
            <p className="text-gray-800 text-lg font-medium">{message.text}</p>
            <p className="text-sm text-gray-500 mt-2 text-right">
              {new Date(message.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
