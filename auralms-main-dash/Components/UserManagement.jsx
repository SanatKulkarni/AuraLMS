'use client';

import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'student', permissions: [] });
  const [showForm, setShowForm] = useState(false);

  const rolePermissions = {
    admin: ["add_user", "remove_user", "manage_permissions", "map_teachers"],
    teacher: ["upload_recordings", "manage_enrollment", "create_quizzes", "access_reports"],
    student: ["enroll_classes", "view_assessments", "messaging"],
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      console.error("Error fetching users:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    try {
      console.log("New User to be added:", newUser);  // Log to check the user data
      const response = await fetch(`http://localhost:5000/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to add user: ${data.message || response.statusText}`);
      }
      setNewUser({ username: '', password: '', name: '', role: 'student', permissions: [] });
      setShowForm(false);
      fetchUsers();
    } catch (e) {
      console.error("Error adding user:", e);
      setError(e);
    }
  };

  const removeUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to remove user: ${data.message || response.statusText}`);
      }
      fetchUsers();
    } catch (e) {
      console.error("Error removing user:", e);
      setError(e);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading users...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">User Management</h1>
      <button onClick={() => setShowForm(true)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Add User</button>
      {showForm && (
        <div className="mb-4 p-4 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-2">Add New User</h2>
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="border p-2 mr-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-2 mr-2 rounded"
          />
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border p-2 mr-2 rounded"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value, permissions: rolePermissions[e.target.value] })}
            className="border p-2 mr-2 rounded"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={addUser} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
        </div>
      )}
      <div className="overflow-x-auto bg-white shadow-md rounded-md p-4">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Permissions</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="odd:bg-white even:bg-gray-100">
                <td className="py-2 px-4 border-b text-center text-black">{user.id}</td>
                <td className="py-2 px-4 border-b text-center text-black">{user.role}</td>
                <td className="py-2 px-4 border-b text-center text-black">{user.username}</td>
                <td className="py-2 px-4 border-b text-center text-black">{user.name}</td>
                <td className="py-2 px-4 border-b text-center text-black">{Array.isArray(user.permissions) ? user.permissions.join(', ') : 'No Permissions'}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button 
                    onClick={() => removeUser(user.id)} 
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
