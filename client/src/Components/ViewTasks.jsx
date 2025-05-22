import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/auth/dashboard/view_tasks', {
        withCredentials: true,
      })
      .then(result => {
        setTasks(result.data.data);
      })
      .catch(err => {
        console.log('Error fetching tasks:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white bg-opacity-95 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Task Overview</h1>
            <p className="text-sm text-gray-500">All tasks created and assigned</p>
          </div>
          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition duration-300"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto p-6">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-bold uppercase">Task ID</th>
                <th className="px-5 py-3 text-left text-sm font-bold uppercase">Title</th>
                <th className="px-5 py-3 text-left text-sm font-bold uppercase">Description</th>
                <th className="px-5 py-3 text-left text-sm font-bold uppercase">Status</th>
                <th className="px-5 py-3 text-left text-sm font-bold uppercase">Assigned To</th>
                <th className="px-5 py-3 text-left text-sm font-bold uppercase">Created By</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr
                    key={task.id || index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-5 py-4">{task.id}</td>
                    <td className="px-5 py-4">{task.title}</td>
                    <td className="px-5 py-4">{task.description}</td>
                    <td className="px-5 py-4">{task.status || "Pending"}</td>
                    <td className="px-5 py-4">{task.assignedTo || "Unassigned"}</td>
                    <td className="px-5 py-4">{task.CreaterName || "Unknown"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500 font-medium">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewTasks;
